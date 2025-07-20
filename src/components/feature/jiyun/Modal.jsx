import "../../../styles/jiyun/feature/modal.css";

export default function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">알림</div>
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
