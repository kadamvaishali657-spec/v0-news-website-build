'use client';

import { useEffect, useState, useCallback } from 'react';

export interface ScaryScrollConfig {
  triggerDelay?: number;
  intensity?: 'light' | 'medium' | 'intense';
  enableSoundEffect?: boolean;
}

export function useScaryScroll(config: ScaryScrollConfig = {}) {
  const {
    triggerDelay = 300,
    intensity = 'medium',
    enableSoundEffect = true,
  } = config;

  const [scrollY, setScrollY] = useState(0);
  const [scareTriggered, setScareTriggered] = useState(false);
  const [cardIndices, setCardIndices] = useState<number[]>([]);

  const playScareSound = useCallback(() => {
    if (!enableSoundEffect) return;
    
    // Create an eerie low frequency tone
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    // Deep, unsettling frequency
    oscillator.frequency.value = 40;
    oscillator.type = 'sawtooth';
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [enableSoundEffect]);

  const triggerScareEffect = useCallback((cardIndex: number) => {
    if (cardIndices.includes(cardIndex)) return;
    
    setCardIndices(prev => [...prev, cardIndex]);
    setScareTriggered(true);
    
    playScareSound();
    
    setTimeout(() => {
      setScareTriggered(false);
    }, triggerDelay);
  }, [cardIndices, triggerDelay, playScareSound]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Detect when cards enter viewport and trigger scare effect
      const cards = document.querySelectorAll('[data-scary-card]');
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport && Math.random() > 0.7) {
          triggerScareEffect(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerScareEffect]);

  return {
    scrollY,
    scareTriggered,
    triggerScareEffect,
    intensity,
  };
}
