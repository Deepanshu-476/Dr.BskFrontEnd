import React, { useEffect, useState } from "react";
import axiosInstance from "../../../components/AxiosInstance";
import API_URL from '../../../config';
import { toast } from "react-toastify";

function PaymentSettings() {
  const [codEnabled, setCodEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get("/api/cash-on-delivery");
      setCodEnabled(res?.data?.data?.codEnabled ?? true);
    } catch (error) {
      toast.error("Failed to fetch payment settings");
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await axiosInstance.put("/api/Updated-COD", {
        codEnabled: !codEnabled,
      });

      setCodEnabled(!codEnabled);
      toast.success("Payment settings updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      border: "1px solid #eef2f6",
    },
    header: {
      padding: "20px 24px",
      borderBottom: "1px solid #eef2f6",
      backgroundColor: "#fafbfc",
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#64748b",
      marginTop: "4px",
    },
    content: {
      padding: "24px",
    },
    settingRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #eef2f6",
    },
    settingRowLast: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "none",
    },
    settingInfo: {
      flex: 1,
    },
    settingLabel: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#1e293b",
      marginBottom: "4px",
    },
    settingDescription: {
      fontSize: "14px",
      color: "#64748b",
    },
    toggleButton: (enabled) => ({
      padding: "10px 24px",
      borderRadius: "30px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: enabled ? "#10b981" : "#ef4444",
      color: "#ffffff",
      boxShadow: enabled 
        ? "0 2px 4px rgba(16, 185, 129, 0.2)" 
        : "0 2px 4px rgba(239, 68, 68, 0.2)",
      minWidth: "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    }),
    toggleButtonHover: (enabled) => ({
      transform: "translateY(-1px)",
      boxShadow: enabled 
        ? "0 4px 8px rgba(16, 185, 129, 0.3)" 
        : "0 4px 8px rgba(239, 68, 68, 0.3)",
    }),
    toggleButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "16px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#f1f5f9",
      color: "#475569",
      marginLeft: "12px",
    },
    statusIndicator: (enabled) => ({
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: enabled ? "#10b981" : "#ef4444",
      display: "inline-block",
      marginRight: "8px",
    }),
    loadingSpinner: {
      width: "16px",
      height: "16px",
      border: "2px solid #ffffff",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    infoBox: {
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      padding: "16px",
      marginTop: "24px",
      border: "1px solid #e2e8f0",
    },
    infoTitle: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "8px",
    },
    infoText: {
      fontSize: "14px",
      color: "#475569",
      lineHeight: "1.5",
    },
  };

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#2563eb"/>
            </svg>
            Cash On Delevery Settings
          </h2>
          <p style={styles.headerSubtitle}>Manage your payment methods and preferences</p>
        </div>

        <div style={styles.content}>
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={styles.settingLabel}>Cash on Delivery (COD)</span>
                <span style={styles.badge}>
                  <span style={styles.statusIndicator(codEnabled)}></span>
                  {codEnabled ? "Active" : "Inactive"}
                </span>
              </div>
              <p style={styles.settingDescription}>
                Allow customers to pay with cash when they receive their order
              </p>
            </div>
            
            <button
              onClick={handleToggle}
              style={{
                ...styles.toggleButton(codEnabled),
                ...(loading ? styles.toggleButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.currentTarget.style, styles.toggleButtonHover(codEnabled));
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.toggleButton(codEnabled).boxShadow;
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Updating...
                </>
              ) : (
                <>
                  {codEnabled ? "Enabled" : "Disabled"}
                </>
              )}
            </button>
          </div>

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px", verticalAlign: "middle" }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#2563eb"/>
              </svg>
              About Cash on Delivery
            </h4>
            <p style={styles.infoText}>
              When enabled, customers can choose to pay with cash at the time of delivery. 
              This option is popular for customers who prefer not to pay online. 
              Make sure your delivery partners are equipped to handle cash collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSettings;