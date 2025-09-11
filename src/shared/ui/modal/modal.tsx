import { ReactNode } from 'react';

import styles from './Modal.module.scss';
import { CloseIcon, Header, IconButton } from 'src/shared';

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose?: () => void;
  readonly title?: ReactNode;
  readonly maxWidth?: string;
  readonly children: ReactNode;
}

export function Modal(props: ModalProps) {
  const { isOpen, onClose, title, maxWidth = '500px', children } = props;

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
      >
        <Header
          paddingY={'small'}
          center={
            <>{title && <div className={styles.modalTitle}>{title}</div>}</>
          }
          right={
            <>
              {onClose && (
                <IconButton
                  icon={<CloseIcon />}
                  size={'xxsmall'}
                  onClick={onClose}
                />
              )}
            </>
          }
        />
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
