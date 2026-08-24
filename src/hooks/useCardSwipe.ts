import { useState, useRef } from 'react';

interface UseCardSwipeOptions {
  onCorrect: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function useCardSwipe({ onCorrect, onSkip, disabled = false }: UseCardSwipeOptions) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyOutDirection, setFlyOutDirection] = useState<'left' | 'right' | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || flyOutDirection) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignored if unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyOutDirection || disabled) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyOutDirection || disabled) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const dx = dragOffset.x;
    const dt = Math.max(1, Date.now() - dragStartRef.current.time);
    const velocityX = Math.abs(dx) / dt;

    const SWIPE_THRESHOLD = 75;
    const VELOCITY_THRESHOLD = 0.38;

    if (dx > SWIPE_THRESHOLD || (dx > 30 && velocityX > VELOCITY_THRESHOLD)) {
      // Throw Right -> Correct
      setFlyOutDirection('right');
      setTimeout(() => {
        onCorrect();
        setDragOffset({ x: 0, y: 0 });
        setFlyOutDirection(null);
      }, 150);
    } else if (dx < -SWIPE_THRESHOLD || (dx < -30 && velocityX > VELOCITY_THRESHOLD)) {
      // Throw Left -> Skip
      setFlyOutDirection('left');
      setTimeout(() => {
        onSkip();
        setDragOffset({ x: 0, y: 0 });
        setFlyOutDirection(null);
      }, 150);
    } else {
      // Smooth spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Swipe progress & physics calculations (Tinder-Style)
  const rightProgress = Math.min(1, Math.max(0, dragOffset.x / 65));
  const leftProgress = Math.min(1, Math.max(0, -dragOffset.x / 65));

  let cardTransform = 'translate3d(0, 0, 0) rotate(0deg)';
  let cardTransition =
    'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.2s ease, box-shadow 0.15s ease, border-color 0.15s ease';
  let cardOpacity = 1;

  if (flyOutDirection === 'right') {
    cardTransform = 'translate3d(120vw, 20px, 0) rotate(25deg)';
    cardOpacity = 0;
    cardTransition = 'transform 0.18s ease-out, opacity 0.18s ease-out';
  } else if (flyOutDirection === 'left') {
    cardTransform = 'translate3d(-120vw, 20px, 0) rotate(-25deg)';
    cardOpacity = 0;
    cardTransition = 'transform 0.18s ease-out, opacity 0.18s ease-out';
  } else if (isDragging) {
    const rot = Math.max(-18, Math.min(18, dragOffset.x * 0.08));
    cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.35}px, 0) rotate(${rot}deg)`;
    cardTransition = 'none';
  }

  const cardBoxShadow =
    dragOffset.x > 15
      ? `0 15px 40px rgba(16, 185, 129, ${Math.min(0.65, rightProgress * 0.75)})`
      : dragOffset.x < -15
      ? `0 15px 40px rgba(244, 63, 94, ${Math.min(0.65, leftProgress * 0.75)})`
      : '0 20px 40px -15px rgba(0, 0, 0, 0.7)';

  const cardBorderColor =
    dragOffset.x > 15
      ? `rgba(52, 211, 153, ${0.4 + rightProgress * 0.6})`
      : dragOffset.x < -15
      ? `rgba(251, 113, 133, ${0.4 + leftProgress * 0.6})`
      : 'rgba(71, 85, 105, 0.8)';

  return {
    dragOffset,
    isDragging,
    flyOutDirection,
    handlePointerDown,
    handlePointerMove,
    handlePointerUpOrCancel,
    rightProgress,
    leftProgress,
    cardTransform,
    cardTransition,
    cardOpacity,
    cardBoxShadow,
    cardBorderColor,
  };
}
