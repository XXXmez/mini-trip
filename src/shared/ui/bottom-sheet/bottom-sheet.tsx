import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { ChildrenProps } from '../../models';

import styles from './bottom-sheet.module.scss';

interface BottomSheetProps extends ChildrenProps {
  readonly open: boolean;
  readonly onClose: () => void;
  /**
   * Порог закрытия в пикселях (опционально). По умолчанию: max(100, 0.25 * sheetHeight).
   */
  readonly closeThresholdPx?: number;
}

export function BottomSheet({
  open,
  onClose,
  children,
  closeThresholdPx,
}: BottomSheetProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // refs для drag
  const draggingRef = useRef(false);
  const startYRef = useRef<number>(0);
  const lastDeltaRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // локальный стейт только для ререндеров при открытии/закрытии
  const [, setTick] = useState(0);

  // запрет скролла заднего фона, когда открыт
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Закрытие по Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // при внешнем переключении open -> true/false анимируем лист
  useEffect(() => {
    if (!sheetRef.current) return;
    // если закрываем извне — скользим вниз (css transition сделает анимацию)
    if (!open) {
      sheetRef.current.style.transform = `translateY(100%)`;
    } else {
      // открываем и ставим в 0
      sheetRef.current.style.transform = `translateY(0)`;
    }
    // форс ререндера рефов (необязательно)
    setTick((t) => t + 1);
  }, [open]);

  // helper: установить transform через RAF (плавнее)
  const applyTranslate = (y: number) => {
    const v = Math.max(0, Math.round(y));
    if (sheetRef.current)
      sheetRef.current.style.transform = `translateY(${v}px)`;
  };

  const startDragging = (
    clientY: number,
    pointerId?: number,
    setPointerCapture?: (id: number) => void,
  ) => {
    draggingRef.current = true;
    startYRef.current = clientY;
    lastDeltaRef.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
    // если передали pointerId/setPointerCapture — попытаемся захватить
    try {
      if (
        pointerId !== undefined &&
        sheetRef.current &&
        'setPointerCapture' in sheetRef.current
      ) {
        sheetRef.current.setPointerCapture(pointerId);
      } else if (setPointerCapture && pointerId !== undefined) {
        setPointerCapture(pointerId);
      }
    } catch {
      // ignore
    }
  };

  const moveDragging = useCallback((clientY: number) => {
    if (!draggingRef.current) return;
    const delta = Math.max(0, clientY - startYRef.current);
    lastDeltaRef.current = delta;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => applyTranslate(delta));
  }, []);

  const endDragging = useCallback(
    (releasePointerId?: number) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      // threshold: max(100px, 25% sheet height) or provided closeThresholdPx
      const sheetHeight =
        sheetRef.current?.getBoundingClientRect().height ?? window.innerHeight;
      const defaultThreshold = Math.max(100, Math.round(sheetHeight * 0.25));
      const threshold =
        typeof closeThresholdPx === 'number'
          ? closeThresholdPx
          : defaultThreshold;

      // restore transition
      if (sheetRef.current)
        sheetRef.current.style.transition =
          'transform 220ms cubic-bezier(.22,.9,.3,1)';

      if (lastDeltaRef.current >= threshold) {
        // animate out
        if (sheetRef.current)
          sheetRef.current.style.transform = `translateY(100%)`;
        // wait until transition ends then onClose
        const onTransitionEnd = () => {
          sheetRef.current?.removeEventListener(
            'transitionend',
            onTransitionEnd,
          );
          onClose();
        };
        sheetRef.current?.addEventListener('transitionend', onTransitionEnd);
      } else {
        // animate back to 0
        if (sheetRef.current)
          sheetRef.current.style.transform = `translateY(0)`;
      }

      // release pointer capture if needed
      try {
        if (
          releasePointerId !== undefined &&
          sheetRef.current &&
          'releasePointerCapture' in sheetRef.current
        ) {
          sheetRef.current.releasePointerCapture(releasePointerId);
        }
      } catch {
        console.log('error', releasePointerId);
      }
      lastDeltaRef.current = 0;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    },
    [closeThresholdPx, onClose],
  );

  // pointer events (preferred)
  const supportsPointer =
    typeof window !== 'undefined' && 'PointerEvent' in window;

  // Pointer handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!open) return;
      // старт драгa только с ручки или если контент вверху
      const target = e.target as Node;
      const handleElem = handleRef.current;
      const contentElem = contentRef.current;
      const isHandle = handleElem ? handleElem.contains(target) : false;
      const contentAtTop = contentElem ? contentElem.scrollTop <= 0 : true;

      if (!isHandle && !contentAtTop) {
        // не начинаем драга — это обычный скролл в контенте
        return;
      }

      // prevent default to avoid text selection
      e.preventDefault();

      startDragging(e.clientY, e.pointerId);
    },
    [open],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) {
        return;
      }
      moveDragging(e.clientY);
    },
    [moveDragging],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      endDragging(e.pointerId);
    },
    [endDragging],
  );

  // Touch fallback (if PointerEvent not supported)
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!open) return;
      const touch = e.touches[0];
      const target = e.target as Node;
      const handleElem = handleRef.current;
      const contentElem = contentRef.current;
      const isHandle = handleElem ? handleElem.contains(target) : false;
      const contentAtTop = contentElem ? contentElem.scrollTop <= 0 : true;
      if (!isHandle && !contentAtTop) return;
      startDragging(touch.clientY);
    },
    [open],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!draggingRef.current) {
        return;
      }
      const touch = e.touches[0];
      // prevent page scroll while dragging
      e.preventDefault();
      moveDragging(touch.clientY);
    },
    [moveDragging],
  );

  const onTouchEnd = useCallback(() => {
    if (!draggingRef.current) {
      return;
    }
    endDragging();
  }, [endDragging]);

  // клик вне — закрываем; при клике в overlay, если target === overlayRef
  const onOverlayPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!overlayRef.current) {
        return;
      }
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const onOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!overlayRef.current) {
        return;
      }
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <div
      ref={overlayRef}
      className={classNames(styles.overlay, { [styles.open]: open })}
      aria-hidden={!open}
      onPointerDown={supportsPointer ? onOverlayPointerDown : undefined}
      onMouseDown={!supportsPointer ? onOverlayMouseDown : undefined}
    >
      <div
        ref={sheetRef}
        className={styles.sheet}
        style={{
          transform: open ? `translateY(0)` : `translateY(100%)`,
          transition: 'transform 300ms cubic-bezier(.22,.9,.3,1)',
        }}
        // pointer/touch handlers on sheet so we capture gestures
        onPointerDown={supportsPointer ? onPointerDown : undefined}
        onPointerMove={supportsPointer ? onPointerMove : undefined}
        onPointerUp={supportsPointer ? onPointerUp : undefined}
        onPointerCancel={supportsPointer ? onPointerUp : undefined}
        onTouchStart={!supportsPointer ? onTouchStart : undefined}
        onTouchMove={!supportsPointer ? onTouchMove : undefined}
        onTouchEnd={!supportsPointer ? onTouchEnd : undefined}
      >
        <div ref={handleRef} className={styles.handle} />
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
