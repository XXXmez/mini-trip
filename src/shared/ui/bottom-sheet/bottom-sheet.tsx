import { useEffect, useRef, useState } from 'react';
import styles from './bottom-sheet.module.scss';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  // закрытие при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        sheetRef.current &&
        !sheetRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // обработка свайпа вниз
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null) {
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0) setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
    startY.current = null;
  };

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ''}`}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        style={{
          transform: open ? `translateY(${dragY}px)` : `translateY(100%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
