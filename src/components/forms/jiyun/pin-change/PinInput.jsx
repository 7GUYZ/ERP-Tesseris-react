import { useState, useEffect } from "react";

export default function PinInput({ onComplete }) {
  const [pin, setPin] = useState([]);

  const handleKeyPress = (key) => {
    if (key === "⌫") {
      setPin((prev) => prev.slice(0, -1));
    } else if (typeof key === "number" && pin.length < 6) {
      const next = [...pin, key];
      setPin(next);
    }
  };

  useEffect(() => {
    if (pin.length === 6) {
      onComplete(pin.join(""));
    }
  }, [pin, onComplete]);

  return (
    <>
      <div className="pin-box-wrapper">
        {Array(6)
          .fill()
          .map((_, idx) => {
            const isFilled = pin[idx] != null;
            return (
              <div
                key={idx}
                className={`pin-box ${isFilled ? "filled" : "empty"}`}
              >
                {isFilled ? "*" : ""}
              </div>
            );
          })}
      </div>

      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((key, idx) => (
          <div
            key={idx}
            className="keypad-key"
            onClick={() => key !== "" && handleKeyPress(key)}
          >
            {key}
          </div>
        ))}
      </div>
    </>
  );
}
