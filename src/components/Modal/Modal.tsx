import "./Modal.scss";
import { IModal } from "../../types/post";
import React, { useEffect } from "react";

const Modal: React.FC<IModal> = ({ isOpen, text, closePopap }) => {
  useEffect(() => {
    const hendleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        closePopap();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", hendleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", hendleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closePopap]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closePopap} role="dialog" aria-modal="true">
      <div className="modal-window" onClick={(e) => e.stopPropagation}>
        <button className="modal-window__close-btn" onClick={closePopap} type="button" aria-label="Закрыть уведомление">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://w3.org">
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <p className="modal-window__text">{text}</p>
      </div>
    </div>
  );
};

export default Modal;
