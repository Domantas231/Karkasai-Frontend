import { useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
}

function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-custom">
            <div className={`modal-content-custom modal-${size}`} ref={modalRef}>
                <div className="modal-header-custom">
                    <h5 className="modal-title-custom">
                        <i className="bi bi-info-circle me-2"></i>
                        {title}
                    </h5>
                    {showCloseButton && (
                        <button 
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Uždaryti"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    )}
                </div>

                <div className="modal-body-custom">
                    {children}
                </div>

                <div className="modal-footer-custom">
                    <button 
                        className="btn btn-primary"
                        onClick={onClose}
                    >
                        Supratau
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;