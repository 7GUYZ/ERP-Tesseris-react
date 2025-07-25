import React from "react";
import { logout } from "../../../api/auth/JungeunAuth";
import useAuthStore from "../../../store/jungeun/AuthStore";
import { useNavigate } from "react-router-dom";

const TestHeader = () => {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            const response = await logout();
            if (response.data.status === "success") {
                useAuthStore.getState().zu_logout();
                localStorage.removeItem("access-token");
                localStorage.removeItem("user-info");
                // 홈으로 이동
                navigate("/");

            }
        } catch (error) {

        }
    }

    return (
        <header style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#170F58",
            color: "white",
            boxShadow: "0 2px 8px rgba(23, 15, 88, 0.15)"
        }}>
            <h1 style={{ margin: 0, fontWeight: "600" }}>TESSERIS</h1>
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: "#FDCD00",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: "#170F58",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(253, 205, 0, 0.2)",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "14px"
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FDD835";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(253, 205, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#FDCD00";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(253, 205, 0, 0.2)";
                }}
            >
                로그아웃
            </button>
        </header>
    );
};

export default TestHeader;
