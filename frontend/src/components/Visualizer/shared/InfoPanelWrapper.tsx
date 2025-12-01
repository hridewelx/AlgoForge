import React from 'react';

interface InfoPanelWrapperProps {
  children: React.ReactNode;
  isDark: boolean;
  panelWidth: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  panelRef?: React.RefObject<HTMLDivElement | null>;
}

export const InfoPanelWrapper: React.FC<InfoPanelWrapperProps> = ({
  children,
  isDark,
  panelWidth,
  isResizing,
  handleMouseDown,
  panelRef,
}) => {
  return (
    <div
      ref={panelRef}
      className={`relative border-l overflow-y-auto flex-shrink-0 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      }`}
      style={{ width: panelWidth }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-500 transition-colors z-10 ${
          isResizing ? 'bg-cyan-500' : isDark ? 'bg-gray-700' : 'bg-slate-200'
        }`}
      />
      <div className="p-4 pl-3">
        {children}
      </div>
    </div>
  );
};

export default InfoPanelWrapper;
