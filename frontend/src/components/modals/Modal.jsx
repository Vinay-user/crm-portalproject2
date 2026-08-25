import { X } from "lucide-react";

export default function Modal({ title, onClose, children, width }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={width ? { maxWidth: width } : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>

          <button className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
