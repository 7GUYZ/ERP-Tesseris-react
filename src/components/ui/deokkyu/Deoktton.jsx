import React from "react"
import "../../../styles/deokkyu/Deoktton.css";

export default function CustomButton({ children, className = "", ...props }) {
  return (
    <button className={`custom-button ${className}`} {...props}>
      {children}
    </button>
)
}
