import { useRef, useState } from 'react';

export function useDragScroll() {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - containerRef.current.offsetLeft;
    dragState.current.scrollLeft = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = 'grabbing';
    setIsDragging(true);
  };

  const handleMouseLeave = () => {
    dragState.current.isDown = false;
    containerRef.current.style.cursor = 'grab';
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    dragState.current.isDown = false;
    containerRef.current.style.cursor = 'grab';
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDown) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 0.5;
    containerRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return {
    containerRef,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove
    }
  };
}
