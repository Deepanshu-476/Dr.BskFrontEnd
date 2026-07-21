import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { clearProducts, deleteProduct } from "../../store/Action";
import API_URL from "../../config";
import JoinUrl from "../../JoinUrl";
import { openMagicCheckout } from "../../utils/magicCheckout";
import "./CartDrawer.css";

export const CART_DRAWER_EVENT = "bsk:open-cart-drawer";

export const openCartDrawer = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_DRAWER_EVENT));
};

const formatPrice = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const getItemPrice = (item) => {
  if (item.isWholesaler) {
    return Number(item.retail_price || item.unitPrice || item.price || item.final_price || 0);
  }
  return Number(item.unitPrice || item.price || item.final_price || item.consumer_price || 0);
};

const getItemMrp = (item, price) => {
  const mrp = Number(item.mrp || item.retail_price || price || 0);
  return Math.max(mrp, price);
};

const getItemImage = (item) => {
  const url = item.media?.[0]?.url || item.imageUrl || item.image;
  return url ? JoinUrl(API_URL, url) : "/medicineFallbackImg.jpeg";
};

const normalizePhoneNumber = (phone) =>
  phone?.toString().trim().replace(/^\+91/, "").replace(/^91/, "").trim() || "";

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const cartItems = useSelector((state) => state.app.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(CART_DRAWER_EVENT, handleOpen);
    return () => window.removeEventListener(CART_DRAWER_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totals = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        const qty = Number(item.quantity || 1);
        const price = getItemPrice(item);
        const mrp = getItemMrp(item, price);
        acc.subtotal += price * qty;
        acc.mrpTotal += mrp * qty;
        acc.quantity += qty;
        return acc;
      },
      { subtotal: 0, mrpTotal: 0, quantity: 0 }
    );
  }, [cartItems]);

  const savings = Math.max(totals.mrpTotal - totals.subtotal, 0);

  const changeQuantity = (item, nextQuantity) => {
    if (nextQuantity < 1) return;
    dispatch(
      {
        type: "UPDATE_QUANTITY",
        payload: {
          productId: item._id,
          variantLabel: item.selectedVariant?.label,
          quantity: nextQuantity,
        },
      }
    );
  };

  const getMagicCheckoutItems = () =>
    cartItems.map((item) => {
      const qty = parseInt(item.quantity, 10) || 1;
      const price = getItemPrice(item);
      const mrp = Number(item.mrp || item.retail_price || price);

      if (!item._id || !item.name || qty < 1 || price <= 0) {
        throw new Error(`Invalid item data for: ${item.name || "Unknown item"}`);
      }

      return {
        productId: item._id,
        name: item.name.trim(),
        quantity: qty,
        price,
        mrp: Math.max(mrp, price),
        variant: item.selectedVariant?.label || item.variant || item.variantLabel || "Standard Pack",
        description: item.description || item.name,
        imageUrl: getItemImage(item),
      };
    });

  const handleCheckout = async () => {
    if (checkoutLoading) return;
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckoutLoading(true);

    try {
      const result = await openMagicCheckout({
        items: getMagicCheckoutItems(),
        totalAmount: totals.subtotal,
        userData: {
          ...userData,
          email: userData.email || localStorage.getItem("guestEmail") || "",
          phone: normalizePhoneNumber(
            userData.phone || userData.mobile || localStorage.getItem("guestPhone") || ""
          ),
        },
        description: "Order Payment",
      });

      if (!result) {
        setCheckoutLoading(false);
        return;
      }

      dispatch(clearProducts());
      localStorage.removeItem("cartItems");
      toast.success("Order placed successfully!");
      setIsOpen(false);
      navigate("/success", {
        state: {
          orderId: result.orderId || result.order?.orderId,
          orderDetails: result.orderDetails || result.order,
          isCOD: false,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Checkout failed. Please try again.";
      toast.error(errorMessage);
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <div
        className={`Sidecart-overlay ${isOpen ? "Sidecart-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      <aside className={`Sidecart-drawer ${isOpen ? "Sidecart-open" : ""}`} aria-hidden={!isOpen}>
        <div className="Sidecart-header">
          <div className="Sidecart-title">
            <h2>Your cart</h2>
            <span>({cartItems.length})</span>
          </div>
          <button type="button" className="Sidecart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={26} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="Sidecart-empty">
            <h3>Your cart is empty</h3>
            <p>Add products to see them here.</p>
          </div>
        ) : (
          <>
            <div className="Sidecart-items">
              {cartItems.map((item) => {
                const price = getItemPrice(item);
                const mrp = getItemMrp(item, price);
                const qty = Number(item.quantity || 1);
                const key = `${item._id}-${item.selectedVariant?.label || "default"}`;

                return (
                  <div className="Sidecart-item" key={key}>
                    <img
                      className="Sidecart-item-img"
                      src={getItemImage(item)}
                      alt={item.name || "Cart item"}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/medicineFallbackImg.jpeg";
                      }}
                    />
                    <div className="Sidecart-item-main">
                      <div className="Sidecart-item-top">
                        <h3>{item.name}</h3>
                        <span>{formatPrice(price * qty)}</span>
                      </div>
                      <div className="Sidecart-price-line">
                        <span>{formatPrice(price)}</span>
                        {mrp > price && <del>{formatPrice(mrp)}</del>}
                      </div>
                      <div className="Sidecart-controls">
                        <div className="Sidecart-qty">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, qty - 1)}
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="Sidecart-delete"
                          onClick={() => dispatch(deleteProduct(item._id))}
                          aria-label="Remove item"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="Sidecart-summary">
              <button type="button" className="Sidecart-discount">
                <span>Discount</span>
                <Plus size={22} />
              </button>
              <div className="Sidecart-row">
                <span>Subtotal ({totals.quantity} Items)</span>
                <strong>{formatPrice(totals.subtotal)}</strong>
              </div>
              <div className="Sidecart-row">
                <span>Shipping</span>
                <strong className="Sidecart-free-shipping">FREE</strong>
              </div>
              {savings > 0 && (
                <div className="Sidecart-row">
                  <span>You Save</span>
                  <strong>- {formatPrice(savings)}</strong>
                </div>
              )}
              <div className="Sidecart-total">
                <span>Estimated total</span>
                <strong>{formatPrice(totals.subtotal)}</strong>
              </div>
              <p>Duties and taxes included. Shipping is calculated at checkout.</p>
              <button
                type="button"
                className="Sidecart-checkout"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Proceed..." : "Check out"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
