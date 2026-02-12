'use client';

import OneSignal from 'react-onesignal';

export async function initOneSignal(userId?: string | number) {
  if (typeof window === 'undefined') return;

  const allowedDomains = [
    'web.agpaiidigital.org',
    'localhost',
    '127.0.0.1',
  ];

  const hostname = window.location.hostname;
  if (!allowedDomains.some(d => hostname.includes(d))) return;

  await OneSignal.init({
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
    notifyButton: { enable: false },
    allowLocalhostAsSecureOrigin: hostname === 'localhost',
    serviceWorkerPath: '/OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
  });

  if (userId) {
    await OneSignal.login(String(userId));
  }
}
