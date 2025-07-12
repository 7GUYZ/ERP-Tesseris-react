import LoginPage from "../pages/jungeun/LoginPage"

const LoginForm = () => {
  const pageStyles = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, #170F58 0%, #2D1B69 50%, #170F58 100%)`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  }

  const backgroundShapes = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  }

  const shape1 = {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "300px",
    height: "300px",
    background: "rgba(253, 205, 0, 0.1)",
    borderRadius: "50%",
    filter: "blur(40px)",
    animation: "float 6s ease-in-out infinite",
  }

  const shape2 = {
    position: "absolute",
    bottom: "10%",
    right: "10%",
    width: "200px",
    height: "200px",
    background: "rgba(245, 245, 249, 0.1)",
    borderRadius: "50%",
    filter: "blur(40px)",
    animation: "float 8s ease-in-out infinite reverse",
  }

  const shape3 = {
    position: "absolute",
    top: "50%",
    right: "20%",
    width: "150px",
    height: "150px",
    background: "rgba(253, 205, 0, 0.08)",
    borderRadius: "50%",
    filter: "blur(30px)",
    animation: "float 10s ease-in-out infinite",
  }

  return (
    <div style={pageStyles}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={backgroundShapes}>
        <div style={shape1}></div>
        <div style={shape2}></div>
        <div style={shape3}></div>
      </div>
      <LoginPage />
    </div>
  )
}

export default LoginForm
