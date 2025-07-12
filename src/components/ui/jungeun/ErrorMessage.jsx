"use client"
const ErrorMessage = ({ message }) => {
  const errorStyles = {
    color: "#ff6b6b",
    fontSize: "14px",
    marginTop: "4px",
    marginBottom: "16px",
    marginLeft: "4px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    animation: "slideInError 0.3s ease-out",
  }

  const iconStyles = {
    width: "16px",
    height: "16px",
    flexShrink: 0,
  }

  return (
    <>
      <style>
        {`
          @keyframes slideInError {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={errorStyles}>
        <svg style={iconStyles} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {message}
      </div>
    </>
  )
}

export default ErrorMessage
