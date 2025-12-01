import { useState, useRef, useCallback, useEffect } from 'react';

interface UseResizablePanelOptions {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizablePanel(options: UseResizablePanelOptions = {}) {
  const {
    defaultWidth = 320,
    minWidth = 280,
    maxWidth = 600,
  } = options;

  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const containerWidth = window.innerWidth;
      const newWidth = containerWidth - e.clientX;
      setPanelWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, minWidth, maxWidth]);

  return {
    panelWidth,
    panelRef,
    isResizing,
    handleMouseDown,
  };
}
