import React from "react"
import { ChevronRight } from "lucide-react"

// 🔹 약관 항목 컴포넌트
export default function AgreementItem({ title, description, checked, onClick, bold = false }) {
  return (
    <div onClick={onClick} className="agreement-item">
      <div className="agreement-item-content">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onClick} 
          className="agreement-checkbox" 
        />
        <div className="agreement-text">
          <p className={`agreement-title ${bold ? 'bold' : ''}`}>{title}</p>
          {description && <p className="agreement-description">{description}</p>}
        </div>
      </div>
      <ChevronRight className="agreement-arrow" />
    </div>
  )
} 