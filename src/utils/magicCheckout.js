import axiosInstance from "../components/AxiosInstance";

let razorpayScriptPromise;

const MAGIC_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/magic-checkout.js";

const loadRazorpay = () => {
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${MAGIC_CHECKOUT_SCRIPT}"]`);
    if (existingScript) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => {
        razorpayScriptPromise = null;
        resolve(false);
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = MAGIC_CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const openMagicCheckout = async ({
  items,
  totalAmount,
  userData,
  description = "Order Payment",
  themeColor = "#68171b",
}) => {
  const normalizedTotal = Number(totalAmount);
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty");
  }
  if (!Number.isFinite(normalizedTotal) || normalizedTotal <= 0) {
    throw new Error("A valid order amount is required");
  }

  const userId =
    userData?._id ||
    `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const orderPayload = {
    userId,
    items,
    totalAmount: Number(normalizedTotal.toFixed(2)),
    checkoutMode: "magic",
    pricingTier:
      userData?.type === "wholesalePartner" ? "wholesale" : "consumer",
    ...(userData?.email ? { email: userData.email } : {}),
    ...(userData?.phone || userData?.mobile
      ? { phone: userData.phone || userData.mobile }
      : {}),
  };

  const orderResponse = await axiosInstance.post(
    "/api/createPaymentOrder",
    orderPayload
  );

  if (!orderResponse.data?.success) {
    throw new Error(
      orderResponse.data?.message || "Unable to start Magic Checkout"
    );
  }

  if (!(await loadRazorpay())) {
    throw new Error("Razorpay could not be loaded. Please refresh and retry.");
  }

  const { order, key_id: key, checkoutToken } = orderResponse.data;
  if (!order?.id || !key || !checkoutToken) {
    throw new Error("Payment gateway returned an incomplete checkout session");
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key,
      one_click_checkout: true,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Dr BSK",
      description,
      prefill: {
        name: userData?.name || "",
        email: userData?.email || "",
        contact: userData?.phone || userData?.mobile || "",
      },
      theme: { color: themeColor },
      config: { display: { language: "en" } },
      modal: {
        confirm_close: true,
        ondismiss: () => resolve(null),
      },
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await axiosInstance.post("/api/verifyPayment", {
            ...paymentResponse,
            ...orderPayload,
            checkoutToken,
          });

          if (!verifyResponse.data?.success) {
            throw new Error(
              verifyResponse.data?.message || "Order could not be created"
            );
          }

          resolve(verifyResponse.data);
        } catch (error) {
          reject(error);
        }
      },
    });

    checkout.on("payment.failed", (response) => {
      reject(
        new Error(response?.error?.description || "Payment failed. Please retry.")
      );
    });

    checkout.open();
  });
};
