import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PharmaAdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminName, setAdminName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
            if (adminName === "Bsk admin" && password === "Bsk@321") {
                localStorage.setItem("isAdminLoggedIn", "true");
                const redirectTo = location.state?.from?.pathname || "/pharma-admin/dashboard";
                navigate(redirectTo, { replace: true });
            } else {
                setError("Invalid username or password");
            }
            setLoading(false);
        }, 1000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #68171b 0%, #450d10 100%)",
            padding: "20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background Pattern */}
            <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(104, 23, 27, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(69, 13, 16, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(138, 31, 36, 0.05) 0%, transparent 50%)
                `,
                zIndex: "0"
            }}></div>

            <div style={{
                width: "100%",
                maxWidth: "440px",
                background: "rgba(255, 255, 255, 0.98)",
                borderRadius: "24px",
                padding: "48px 40px",
                boxShadow: "0 25px 70px rgba(104, 23, 27, 0.4)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                position: "relative",
                overflow: "hidden",
                zIndex: "1"
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "180px",
                    height: "180px",
                    background: "linear-gradient(135deg, #68171b 0%, #8a1f24 100%)",
                    borderRadius: "50%",
                    opacity: "0.15",
                    animation: "float 6s ease-in-out infinite"
                }}></div>
                <div style={{
                    position: "absolute",
                    bottom: "-40px",
                    left: "-40px",
                    width: "120px",
                    height: "120px",
                    background: "linear-gradient(135deg, #68171b 0%, #8a1f24 100%)",
                    borderRadius: "50%",
                    opacity: "0.15",
                    animation: "float 8s ease-in-out infinite 1s"
                }}></div>

                {/* Header */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "48px",
                    position: "relative",
                    zIndex: "2"
                }}>
                    <div style={{
                        width: "88px",
                        height: "88px",
                        margin: "0 auto 24px",
                        background: "linear-gradient(135deg, #68171b 0%, #8a1f24 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 15px 35px rgba(104, 23, 27, 0.4)",
                        border: "4px solid white",
                        animation: "pulse 2s infinite"
                    }}>
                        <svg 
                            style={{ 
                                width: "42px", 
                                height: "42px", 
                                fill: "white",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                            }} 
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <h2 style={{
                        margin: "0 0 12px",
                        color: "#68171b",
                        fontSize: "32px",
                        fontWeight: "800",
                        letterSpacing: "-0.5px",
                        textShadow: "0 2px 4px rgba(104, 23, 27, 0.1)"
                    }}>
                        Pharma Admin Portal
                    </h2>
                    <p style={{
                        margin: "0",
                        color: "#666",
                        fontSize: "15px",
                        fontWeight: "500",
                        maxWidth: "280px",
                        margin: "0 auto",
                        lineHeight: "1.5"
                    }}>
                        Secure access to pharmaceutical management dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} style={{ position: "relative", zIndex: "2" }}>
                    <div style={{ marginBottom: "8px" }}>
                        <div style={{
                            position: "relative",
                            marginBottom: "28px"
                        }}>
                            <div style={{
                                position: "relative"
                            }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    color: "#68171b",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    letterSpacing: "0.3px"
                                }}>
                                    <span style={{
                                        marginRight: "8px",
                                        fontSize: "18px"
                                    }}>👨‍💼</span>
                                    Username
                                </label>
                                <div style={{
                                    position: "relative"
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Enter admin username"
                                        required
                                        value={adminName}
                                        onChange={(e) => {
                                            setAdminName(e.target.value);
                                            setError("");
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "18px 20px 18px 56px",
                                            border: "2px solid #e1e5e9",
                                            borderRadius: "14px",
                                            fontSize: "16px",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            backgroundColor: "#f8f0f1",
                                            boxSizing: "border-box",
                                            color: "#333",
                                            fontWeight: "500",
                                            outline: "none"
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#68171b";
                                            e.target.style.backgroundColor = "#ffffff";
                                            e.target.style.boxShadow = "0 0 0 4px rgba(104, 23, 27, 0.15)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "#e1e5e9";
                                            e.target.style.backgroundColor = "#f8f0f1";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#68171b",
                                        fontSize: "20px",
                                        opacity: "0.8"
                                    }}>
                                        👨‍⚕️
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "32px" }}>
                            <div style={{
                                position: "relative"
                            }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    color: "#68171b",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    letterSpacing: "0.3px"
                                }}>
                                    <span style={{
                                        marginRight: "8px",
                                        fontSize: "18px"
                                    }}>🔒</span>
                                    Password
                                </label>
                                <div style={{
                                    position: "relative"
                                }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your secure password"
                                        required
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError("");
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "18px 60px 18px 56px",
                                            border: "2px solid #e1e5e9",
                                            borderRadius: "14px",
                                            fontSize: "16px",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            backgroundColor: "#f8f0f1",
                                            boxSizing: "border-box",
                                            color: "#333",
                                            fontWeight: "500",
                                            outline: "none",
                                            letterSpacing: showPassword ? "normal" : "2px"
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#68171b";
                                            e.target.style.backgroundColor = "#ffffff";
                                            e.target.style.boxShadow = "0 0 0 4px rgba(104, 23, 27, 0.15)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "#e1e5e9";
                                            e.target.style.backgroundColor = "#f8f0f1";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#68171b",
                                        fontSize: "20px",
                                        opacity: "0.8"
                                    }}>
                                        🔐
                                    </div>
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            color: "#68171b",
                                            cursor: "pointer",
                                            fontSize: "22px",
                                            padding: "0",
                                            width: "32px",
                                            height: "32px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            transition: "all 0.3s ease",
                                            opacity: "0.7"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.opacity = "1";
                                            e.target.style.backgroundColor = "rgba(104, 23, 27, 0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.opacity = "0.7";
                                            e.target.style.backgroundColor = "transparent";
                                        }}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                               
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                marginBottom: "24px",
                                padding: "16px",
                                backgroundColor: "rgba(220, 53, 69, 0.1)",
                                border: "1px solid rgba(220, 53, 69, 0.3)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                animation: "shake 0.6s ease",
                                borderLeft: "4px solid #dc3545"
                            }}>
                                <div style={{
                                    color: "#dc3545",
                                    fontSize: "22px",
                                    flexShrink: "0"
                                }}>
                                    ⚠️
                                </div>
                                <div>
                                    <p style={{
                                        margin: "0 0 4px",
                                        color: "#dc3545",
                                        fontSize: "15px",
                                        fontWeight: "700"
                                    }}>
                                        Authentication Failed
                                    </p>
                                    <p style={{
                                        margin: "0",
                                        color: "#dc3545",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        opacity: "0.9"
                                    }}>
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "20px",
                                background: loading 
                                    ? "linear-gradient(135deg, #8a1f24 0%, #68171b 100%)" 
                                    : "linear-gradient(135deg, #68171b 0%, #8a1f24 100%)",
                                border: "none",
                                borderRadius: "14px",
                                color: "white",
                                fontSize: "17px",
                                fontWeight: "800",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                boxShadow: "0 12px 30px rgba(104, 23, 27, 0.4)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "12px",
                                position: "relative",
                                overflow: "hidden",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase"
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = "translateY(-3px) scale(1.02)";
                                    e.target.style.boxShadow = "0 18px 40px rgba(104, 23, 27, 0.5)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = "translateY(0) scale(1)";
                                    e.target.style.boxShadow = "0 12px 30px rgba(104, 23, 27, 0.4)";
                                }
                            }}
                            onMouseDown={(e) => {
                                if (!loading) {
                                    e.target.style.transform = "translateY(1px) scale(0.98)";
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: "22px",
                                        height: "22px",
                                        border: "3px solid rgba(255, 255, 255, 0.3)",
                                        borderTopColor: "white",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite"
                                    }}></div>
                                    AUTHENTICATING...
                                </>
                            ) : (
                                <>
                                    <span style={{ 
                                        fontSize: "20px",
                                        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                                    }}>🔑</span>
                                    ACCESS DASHBOARD
                                </>
                            )}
                            <div style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                                transform: "translateX(-100%)",
                                animation: loading ? "shimmer 2s infinite" : "none"
                            }}></div>
                        </button>

                        {/* Security Info */}
                       
                    </div>
                </form>

                {/* Footer Note */}
               
            </div>

            {/* Animations */}
            <style>
                {`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    33% { transform: translateY(-15px) rotate(2deg); }
                    66% { transform: translateY(5px) rotate(-2deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 15px 35px rgba(104, 23, 27, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 20px 45px rgba(104, 23, 27, 0.5); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #68171b;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #8a1f24;
                }
                
                /* Selection color */
                ::selection {
                    background-color: rgba(104, 23, 27, 0.3);
                    color: white;
                }
                
                /* Focus styles */
                *:focus {
                    outline: 2px solid #68171b;
                    outline-offset: 2px;
                }
                `}
            </style>
        </div>
    );
};

export default PharmaAdminLogin;