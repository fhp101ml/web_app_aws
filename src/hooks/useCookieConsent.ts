"use client";

import { useState, useEffect, useCallback } from 'react';

export type CookieConsentState = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

export const defaultConsent: CookieConsentState = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
};

const STORAGE_KEY = 'cookie_consent_v2';

export function useCookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsentState>(defaultConsent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure necessary is always true regardless of what's stored
        setConsent({ ...defaultConsent, ...parsed, necessary: true });
        setIsLoaded(true);
      } catch (e) {
        // Corrupt storage, show banner
        setIsVisible(true);
        setIsLoaded(true);
      }
    } else {
      // New user
      setIsVisible(true);
      setIsLoaded(true);
    }
  }, []);

  const saveConsent = useCallback((newConsent: CookieConsentState) => {
    // Ensure necessary is always true
    const finalConsent = { ...newConsent, necessary: true };

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConsent));

    // Update state
    setConsent(finalConsent);
    setIsVisible(false);

    // Dispatch event for other scripts (GTM, Analytics)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', {
        detail: finalConsent
      }));
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    });
  }, [saveConsent]);

  const denyAll = useCallback(() => {
    saveConsent({
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
    });
  }, [saveConsent]);

  const toggleCategory = useCallback((category: keyof CookieConsentState) => {
    if (category === 'necessary') return; // Cannot toggle necessary
    setConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  return {
    isVisible,
    consent,
    isLoaded,
    acceptAll,
    denyAll,
    saveConsent,
    toggleCategory,
    setConsent,
  };
}
