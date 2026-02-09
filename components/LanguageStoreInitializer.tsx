'use client';

import { useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/language';

/**
 * Component to initialize language store from database
 * Should be placed at the root of the app
 */
export function LanguageStoreInitializer() {
  const initializeFromDatabase = useLanguageStore(
    state => state.initializeFromDatabase
  );
  const languagesDetected = useLanguageStore(state => state.languagesDetected);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once and only if not already detected
    if (!hasInitialized.current && !languagesDetected) {
      hasInitialized.current = true;
      initializeFromDatabase();
    }
  }, [initializeFromDatabase, languagesDetected]);

  return null;
}
