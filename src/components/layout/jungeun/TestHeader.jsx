import React from "react";
import { logout } from "../../../api/Auth";
import useAuthStore from "../../../store/jungeun/AuthStore";
import { useToast } from "../../../context/jungeun/ToastContext";


const Header = () => {

    const { showToast } = useToast();
    
    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            const response = await logout();
            if (response.data.status === "success") {
                useAuthStore.getState().zu_logout();
                localStorage.removeItem("access-token");
                localStorage.removeItem("user-info");
                // 홈으로 이동
                window.location.href = "/";

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
            color: "white"
        }}>
            <h1 style={{ margin: 0 }}>TESSERIS</h1>
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: "#FDCD00",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                로그아웃
            </button>
        </header>
    );
};

export default Header;
