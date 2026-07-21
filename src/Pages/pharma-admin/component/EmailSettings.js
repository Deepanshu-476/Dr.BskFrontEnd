import React, { useEffect, useState } from "react";
import axiosInstance from "../../../components/AxiosInstance";
import { toast } from "react-toastify";

function EmailSettings() {
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPassword, setSenderPassword] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/email-settings");
      if (res?.data?.success && res?.data?.data) {
        const { senderEmail, senderPassword, ownerEmail } = res.data.data;
        setSenderEmail(senderEmail || "");
        setSenderPassword(senderPassword || "");
        setOwnerEmail(ownerEmail || "");
      }
    } catch (error) {
      toast.error("Failed to fetch email settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!senderEmail || !senderPassword || !ownerEmail) {
      toast.error("All fields are required");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      toast.error("Please enter a valid sender email");
      return;
    }
    if (!emailRegex.test(ownerEmail)) {
      toast.error("Please enter a valid owner email");
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.put("/api/email-settings", {
        senderEmail,
        senderPassword,
        ownerEmail
      });
      if (res?.data?.success) {
        toast.success("Email settings updated successfully");
      } else {
        toast.error(res?.data?.message || "Failed to update settings");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!senderEmail || !senderPassword || !ownerEmail) {
      toast.error("Please save settings first before testing");
      return;
    }

    setTesting(true);
    try {
      const res = await axiosInstance.post("/api/email-settings/test");
      if (res?.data?.success) {
        toast.success("Test email sent successfully! Please check owner's inbox.");
      } else {
        toast.error(res?.data?.message || "Failed to send test email");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send test email. Double check SMTP details.");
    } finally {
      setTesting(false);
    }
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
      gap: "10px",
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#64748b",
      marginTop: "4px",
    },
    content: {
      padding: "24px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#334155",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      color: "#1e293b",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      outline: "none",
      boxSizing: "border-box",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      marginTop: "30px",
    },
    primaryButton: {
      flex: 1,
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    secondaryButton: {
      padding: "12px 24px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#ffffff",
      color: "#475569",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
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
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    infoText: {
      fontSize: "13px",
      color: "#475569",
      lineHeight: "1.6",
      margin: 0,
    },
    loadingSpinner: {
      width: "16px",
      height: "16px",
      border: "2px solid #ffffff",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    blueSpinner: {
      width: "16px",
      height: "16px",
      border: "2px solid #2563eb",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#2563eb"/>
            </svg>
            Email Settings & SMTP Credentials
          </h2>
          <p style={styles.headerSubtitle}>Configure the sender SMTP details and owner recipient address for notifications</p>
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <div style={styles.blueSpinner}></div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sender Email (Gmail SMTP Username)</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g., drbskhealthcare@gmail.com"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sender Password (Gmail 16-Digit App Password)</label>
                <input
                  type="password"
                  value={senderPassword}
                  onChange={(e) => setSenderPassword(e.target.value)}
                  placeholder="e.g., yxnykcgxwtslcdtl"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Owner Recipient Email (For New Order Alerts)</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="e.g., himanshujangra0633@gmail.com"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  style={styles.secondaryButton}
                  disabled={saving || testing}
                >
                  {testing ? (
                    <>
                      <div style={styles.blueSpinner}></div>
                      Sending Test...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="#475569"/>
                      </svg>
                      Send Test Email
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                  disabled={saving || testing}
                >
                  {saving ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Saving Settings...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="currentColor"/>
                      </svg>
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#2563eb"/>
              </svg>
              Important Instructions for Gmail Sender:
            </h4>
            <p style={styles.infoText}>
              To send emails via Gmail SMTP, you must use a Google Account <strong>App Password</strong>, NOT your normal login password.<br />
              1. Enable 2-Step Verification on your Gmail account.<br />
              2. Go to Google Account Security details and search for <strong>App Passwords</strong>.<br />
              3. Generate a password (select 'Mail' and 'Other/Custom Name' such as 'Dr BSK Portal').<br />
              4. Copy the generated 16-character password and paste it here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSettings;
