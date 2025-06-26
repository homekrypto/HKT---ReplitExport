import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hkt-onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('hkt-onboarding-skipped');
    const lastShownDate = localStorage.getItem('hkt-onboarding-last-shown');
    
    // Check if this is user's first visit
    const hasVisitedBefore = localStorage.getItem('hkt-has-visited');
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem('hkt-has-visited', 'true');
    }

    // Show onboarding if:
    // 1. User is authenticated AND
    // 2. Has not completed or skipped onboarding AND
    // 3. (Is first visit OR hasn't been shown in the last 7 days)
    if (isAuthenticated && user && !hasCompletedOnboarding && !hasSkippedOnboarding) {
      const shouldShow = isFirstVisit || !lastShownDate || 
        (Date.now() - parseInt(lastShownDate) > 7 * 24 * 60 * 60 * 1000);
      
      if (shouldShow) {
        // Small delay to ensure smooth user experience
        const timer = setTimeout(() => {
          setShowOnboarding(true);
          localStorage.setItem('hkt-onboarding-last-shown', Date.now().toString());
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, isFirstVisit]);

  const startOnboarding = () => {
    setShowOnboarding(true);
    localStorage.setItem('hkt-onboarding-last-shown', Date.now().toString());
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hkt-onboarding-completed', 'true');
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hkt-onboarding-skipped', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('hkt-onboarding-completed');
    localStorage.removeItem('hkt-onboarding-skipped');
    localStorage.removeItem('hkt-onboarding-last-shown');
    setShowOnboarding(false);
  };

  const hasCompletedOnboarding = () => {
    return localStorage.getItem('hkt-onboarding-completed') === 'true';
  };

  return {
    showOnboarding,
    setShowOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    hasCompletedOnboarding,
    isFirstVisit
  };
}