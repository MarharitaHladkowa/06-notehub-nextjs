"use client"; // Важно: делает компонент клиентским, чтобы использовать DOM API

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Тип для дочерних элементов
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Используем состояние для отслеживания монтирования компонента на клиенте.
  const [isMounted, setIsMounted] = useState(false); // Этот useEffect выполняется только один раз на клиенте, когда компонент монтируется.

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // --- 1. Обработка клавиши ESC ---
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);

    // --- 2. Керування прокруткою ---
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // --- 3. Функція очищення (CLEANUP) ---

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  // Если модальное окно закрыто или мы еще не монтировались на клиенте, не рендерим ничего.
  if (!isOpen || !isMounted) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
           {" "}
      <div
        className={css.modal} // Остановка всплытия, чтобы клик внутри модального окна не закрывал его
        onClick={(e) => e.stopPropagation()}
      >
                {/* Кнопка закрытия (X) */}       {" "}
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Закрыть модальное окно"
        >
                   {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
                       {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
                     {" "}
          </svg>
                 {" "}
        </button>
                {children}     {" "}
      </div>
         {" "}
    </div>,
    document.body // Рендерим прямо в body, как в вашем примере
  );
}
