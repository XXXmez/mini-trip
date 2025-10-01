import { BottomSheet, Typography } from 'shared';

import styles from './used-words-sheet.module.scss';

interface UsedWordsSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly usedWords: string[];
}

export function UsedWordsSheet(props: UsedWordsSheetProps) {
  const { open, onClose, usedWords } = props;

  return (
    <BottomSheet open={open} onClose={onClose}>
      {usedWords.length === 0 ? (
        <Typography>Пока нет слов</Typography>
      ) : (
        <div className={styles.usedWordsSheetContent}>
          {usedWords.map((word) => (
            <Typography key={word} className={styles.word}>
              {word}
            </Typography>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
