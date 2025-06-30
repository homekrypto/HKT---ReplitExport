import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export function useAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Auto-open assistant on certain pages or conditions
  useEffect(() => {
    // Could implement smart opening logic here
    // For example, open on first visit to complex pages
  }, [location]);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close,
    currentPage: location
  };
}