'use client';

import { useEffect, useRef } from 'react';
import { initOneSignal } from '@/utils/onesignal';
import { useAuth } from '@/utils/context/auth_context';

export default function OneSignalProvider() {
  const initialized = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    initOneSignal(user?.id);
  }, [user?.id]);

  return null;
}
