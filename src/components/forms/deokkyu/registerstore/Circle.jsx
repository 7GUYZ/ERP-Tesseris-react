import React from "react"

// 🔹 Circle Step 컴포넌트
export default function Circle({ filled }) {
  return (
    <div className={`step-circle ${filled ? 'filled' : ''}`} />
  )
} 