// src/common/ConfirmModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/confirmModal.css';

export default function ConfirmModal({ isOpen, productName, onConfirm, onCancel }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
                <p className="confirm-modal-message">
                    Вы действительно хотите удалить <strong>{productName}</strong>?
                </p>
                <span></span>
                <div className="confirm-modal-buttons">
                    <button className="confirm-modal-button-confirm" onClick={onConfirm}>
                        Да
                    </button>
                    <button className="confirm-modal-button-cancel" onClick={onCancel}>
                        Нет
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
