import React, { useState, useRef, useEffect } from 'react';
import { Widget as WidgetType } from '../types/dashboard';
import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { TextWidget } from './widgets/TextWidget';
import { Move, MoreVertical, Copy, Trash2, Edit, Unlock } from 'lucide-react';

interface WidgetProps {
  widget: WidgetType;
  onUpdate: (updates: Partial<WidgetType>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDragStart: (offset: { x: number; y: number }) => void;
  onDrag: (x: number, y: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  widget,
  onUpdate,
  onDelete,
  onDuplicate,
  onDragStart,
  onDrag,
  onDragEnd,
  isDragging
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(widget.title);
  const widgetRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onDrag(e.clientX, e.clientY);
      } else if (isResizing && widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, e.clientX - rect.left);
        const newHeight = Math.max(150, e.clientY - rect.top);
        
        onUpdate({
          position: {
            ...widget.position,
            width: Math.round(newWidth / 20) * 20,
            height: Math.round(newHeight / 20) * 20
          }
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        onDragEnd();
      }
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, onDrag, onDragEnd, onUpdate, widget.position]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    onDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleTitleSave = () => {
    onUpdate({ title: editTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(widget.title);
    setIsEditingTitle(false);
  };

  const handleUnlock = () => {
    onUpdate({ isLocked: false });
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget widget={widget} onUpdate={onUpdate} />;
      case 'table':
        return <TableWidget widget={widget} onUpdate={onUpdate} />;
      case 'text':
        return <TextWidget widget={widget} onUpdate={onUpdate} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div
      ref={widgetRef}
      className={`
        absolute bg-white border-2 rounded-lg shadow-lg overflow-hidden
        transition-all duration-200 group
        ${isDragging ? 'border-blue-500 shadow-2xl z-50 cursor-grabbing' : 'border-gray-200 hover:border-gray-300'}
        ${isResizing ? 'select-none' : ''}
      `}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.position.width,
        height: widget.position.height,
        minWidth: 200,
        minHeight: 150
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 text-gray-400" />
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                onBlur={handleTitleSave}
              />
            </div>
          ) : (
            <h3 
              className={`text-sm font-semibold text-gray-800 ${!widget.isLocked ? 'cursor-pointer hover:text-blue-600' : ''} transition-colors`}
              onClick={() => !widget.isLocked && setIsEditingTitle(true)}
            >
              {widget.title}
              {widget.isLocked && <span className="ml-2 text-xs text-green-600">🔒</span>}
              }
            </h3>
          )}
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {!widget.isLocked && (
                  <button
                    onClick={() => {
                      setIsEditingTitle(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Title</span>
                  </button>
                )}
                {widget.isLocked && (
                  <button
                    onClick={() => {
                      handleUnlock();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Widget</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-full overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {renderWidgetContent()}
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
};