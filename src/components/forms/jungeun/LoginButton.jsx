"use client"

const LoginButton = ({ children, type = "button", onClick, isLoading }) => {
  const buttonStyles = {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#170F58",
    background: "linear-gradient(135deg, #FDCD00 0%, #FDD835 100%)",
    border: "2px solid #FDCD00",
    borderRadius: "12px",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
    position: "relative",
    overflow: "hidden",
    opacity: isLoading ? 0.7 : 1,
    boxShadow: "0 4px 15px rgba(253, 205, 0, 0.3)",
  }

  const loadingSpinnerStyles = {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "2px solid rgba(23, 15, 88, 0.3)",
    borderTop: "2px solid #170F58",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
  }

  const hoverStyles = {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(253, 205, 0, 0.4)",
    background: "linear-gradient(135deg, #FDD835 0%, #FDCD00 100%)",
  }

  const handleMouseEnter = (e) => {
    if (!isLoading) {
      Object.assign(e.target.style, hoverStyles)
    }
  }

  const handleMouseLeave = (e) => {
    if (!isLoading) {
      e.target.style.transform = "none"
      e.target.style.boxShadow = "0 4px 15px rgba(253, 205, 0, 0.3)"
      e.target.style.background = "linear-gradient(135deg, #FDCD00 0%, #FDD835 100%)"
    }
  }

  const handleMouseDown = (e) => {
    if (!isLoading) {
      e.target.style.transform = "translateY(0px)"
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <button
        type={type}
        style={buttonStyles}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        disabled={isLoading}
      >
        {isLoading && <span style={loadingSpinnerStyles}></span>}
        {children}
      </button>
    </>
  )
}

export default LoginButton
