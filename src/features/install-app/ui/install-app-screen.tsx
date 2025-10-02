import { Button, Typography, useInstallPrompt } from 'shared';

export function InstallAppScreen() {
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography size='xl2' weight='bold'>
        Установите приложение
      </Typography>
      {canInstall ? (
        <Button onClick={promptInstall}>Установить</Button>
      ) : (
        <Typography>
          Чтобы установить приложение, откройте меню браузера и выберите
          <br />
          <b>«Добавить на главный экран»</b>.
        </Typography>
      )}
    </div>
  );
}
