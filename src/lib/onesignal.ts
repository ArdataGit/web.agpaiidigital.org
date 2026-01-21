'use client';

export const initOneSignal = async () => {
  if (typeof window === 'undefined') return;

  const OneSignal = (await import('react-onesignal')).default;

  await OneSignal.init({
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
    notifyButton: {
      enable: false,
    },
    allowLocalhostAsSecureOrigin: false,
    serviceWorkerPath: '/OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
  });
};
