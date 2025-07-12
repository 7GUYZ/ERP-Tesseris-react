"use client"

const InputField = ({ type, placeholder, value, onChange, required, icon, error }) => {

  const focusStyles = {
    borderColor: error ? "#ff6b6b" : "#FDCD00",
    backgroundColor: error ? "rgba(255, 107, 107, 0.1)" : "#ffffff",
    boxShadow: error ? "0 0 0 3px rgba(255, 107, 107, 0.1)" : "0 0 0 3px rgba(253, 205, 0, 0.2)",
    transform: "translateY(-2px)",
  }

  const handleFocus = (e) => {
    Object.assign(e.target.style, focusStyles)
    const icon = e.target.parentElement.querySelector(".input-icon")
    if (icon) {
      icon.style.color = error ? "#ff6b6b" : "#FDCD00"
    }
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? "#ff6b6b" : "rgba(23, 15, 88, 0.2)"
    e.target.style.backgroundColor = error ? "rgba(255, 107, 107, 0.05)" : "#ffffff"
    e.target.style.boxShadow = "none"
    e.target.style.transform = "none"
    const icon = e.target.parentElement.querySelector(".input-icon")
    if (icon) {
      icon.style.color = error ? "#ff6b6b" : "rgba(23, 15, 88, 0.6)"
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "id":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        )
      case "lock":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`input-field-container${error ? ' error' : ''}`}>
      <div className={`input-icon${error ? ' error' : ''}`}>
        {getIcon()}
      </div>
      <input
        className={`input-field${error ? ' error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <style>
        {`
          input::placeholder {
            color: ${error ? "rgba(255, 107, 107, 0.7)" : "rgba(23, 15, 88, 0.5)"};
          }
        `}
      </style>
    </div>
  )
}

export default InputField
