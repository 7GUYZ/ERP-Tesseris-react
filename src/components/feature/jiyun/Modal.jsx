import "../../../styles/jiyun/feature/modal.css";

export default function Modal({ message, onClose }) {
  return (
    <div className="check-modal-overlay">
      <div className="check-modal-box">
        <div className="check-modal-header">알림</div>
        <div className="check-modal-body">{message}</div>
        <div className="check-modal-footer">
          <button className="check-modal-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
