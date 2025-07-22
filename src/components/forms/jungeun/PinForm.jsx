import { useEffect, useRef, useState } from "react"
import "../../../styles/jungeun/pin.css";

export default function PinForm(){
    const [pin, setPin] = useState(["", "", "", "", "", ""])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isShaking, setIsShaking] = useState(false)
    const containerRef = useRef(null)
  
    useEffect(() => {
      // Focus the container to capture keyboard events
      if (containerRef.current) {
        containerRef.current.focus()
      }
    }, [])
  
    const handleKeyPress = (value) => {
      if (currentIndex < 6) {
        const newPin = [...pin]
        newPin[currentIndex] = value
        setPin(newPin)
        setCurrentIndex(currentIndex + 1)
  
        // Check if PIN is complete
        if (currentIndex === 5) {
          setTimeout(() => {
            console.log("PIN entered:", newPin.join(""))
            // Here you can add your PIN validation logic
          }, 100)
        }
      }
    }
  
    const handleBackspace = () => {
      if (currentIndex > 0) {
        const newPin = [...pin]
        const indexToDelete = currentIndex - 1
        newPin[indexToDelete] = ""
        setPin(newPin)
        setCurrentIndex(indexToDelete)
      }
    }
  
    const handleReset = () => {
      setPin(["", "", "", "", "", ""])
      setCurrentIndex(0)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  
    const handleKeyDown = (e) => {
      e.preventDefault()
  
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key)
      } else if (e.key === "Backspace") {
        handleBackspace()
      } else if (e.key === "Escape") {
        handleReset()
      }
    }
  
    const handleNumberClick = (number) => {
      handleKeyPress(number.toString())
    }
  
    return (
        <div className="gift-pin-container" tabIndex={0} onKeyDown={handleKeyDown} ref={containerRef}>
        <div className="gift-pin-header">
          <button className="gift-pin-back-button" onClick={() => window.history.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="gift-pin-header-title">PIN 번호 입력</h1>
          <div></div>
        </div>
  
        <div className="gift-pin-content">
          <div className="gift-pin-title-section">
            <h2 className="gift-pin-title">보안 PIN 입력</h2>
            <p className="gift-pin-subtitle">안전한 인증을 위해 6자리 PIN 번호를 입력해주세요</p>
          </div>
  
          <div className={`gift-pin-dots-container ${isShaking ? "gift-pin-shake" : ""}`}>
            {pin.map((digit, index) => (
              <div
                key={index}
                className={`gift-pin-dot ${digit ? "gift-pin-filled" : ""} ${index === currentIndex ? "gift-pin-active" : ""}`}
              >
                {digit && <div className="gift-pin-dot-inner"></div>}
              </div>
            ))}
          </div>
  
          <div className="gift-pin-keypad">
            <div className="gift-pin-keypad-row">
              {[1, 2, 3].map((num) => (
                <button key={num} className="gift-pin-keypad-button" onClick={() => handleNumberClick(num)}>
                  {num}
                </button>
              ))}
            </div>
            <div className="gift-pin-keypad-row">
              {[4, 5, 6].map((num) => (
                <button key={num} className="gift-pin-keypad-button" onClick={() => handleNumberClick(num)}>
                  {num}
                </button>
              ))}
            </div>
            <div className="gift-pin-keypad-row">
              {[7, 8, 9].map((num) => (
                <button key={num} className="gift-pin-keypad-button" onClick={() => handleNumberClick(num)}>
                  {num}
                </button>
              ))}
            </div>
            <div className="gift-pin-keypad-row">
              <button className="gift-pin-keypad-button gift-pin-action-button" onClick={handleReset}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12A9 9 0 0 1 12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7V12L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="gift-pin-keypad-button" onClick={() => handleNumberClick(0)}>
                0
              </button>
              <button className="gift-pin-keypad-button gift-pin-action-button" onClick={handleBackspace}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0.59 12L5.41 20.12C5.77 20.65 6.31 21 7 21H22C22.55 21 23 20.55 23 20V4C23 3.45 22.55 3 22 3Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 9L12 15M12 9L18 15"
                    stroke="#170F58"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
  
          <div className="gift-pin-footer">
            <p className="gift-pin-keyboard-hint">키보드로도 입력 가능합니다</p>
          </div>
        </div>
      </div>
    )
}