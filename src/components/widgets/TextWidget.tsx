import React, { useState } from 'react';
import { TextWidget as TextWidgetType } from '../../types/dashboard';
import { Edit3, Save, X } from 'lucide-react';

interface TextWidgetProps {
  widget: TextWidgetType;
  onUpdate: (updates: Partial<TextWidgetType>) => void;
}

export const TextWidget: React.FC<TextWidgetProps> = ({ widget, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(widget.content);
  const [editTextColor, setEditTextColor] = useState(widget.textColor);
  const [editBackgroundColor, setEditBackgroundColor] = useState(widget.backgroundColor);

  const handleSave = () => {
    onUpdate({ 
      content: editContent,
      textColor: editTextColor,
      backgroundColor: editBackgroundColor,
      isLocked: true
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(widget.content);
    setEditTextColor(widget.textColor);
    setEditBackgroundColor(widget.backgroundColor);
    setIsEditing(false);
  };

  const handleFontSizeChange = (fontSize: TextWidgetType['fontSize']) => {
    onUpdate({ fontSize });
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="h-full flex flex-col">
      {!widget.isLocked && (
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Text Configuration</span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleSave}
                  className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Font Size:</label>
                <select
                  value={widget.fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value as TextWidgetType['fontSize'])}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">Text Color:</label>
                  <input
                    type="color"
                    value={editTextColor}
                    onChange={(e) => setEditTextColor(e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700">Background:</label>
                  <div className="flex space-x-1">
                    <input
                      type="color"
                      value={editBackgroundColor === 'transparent' ? '#ffffff' : editBackgroundColor}
                      onChange={(e) => setEditBackgroundColor(e.target.value)}
                      className="flex-1 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => setEditBackgroundColor('transparent')}
                      className="px-2 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div 
        className="flex-1 p-4"
        style={{ 
          backgroundColor: widget.backgroundColor === 'transparent' ? 'transparent' : widget.backgroundColor 
        }}
      >
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={`
              w-full h-full resize-none border border-gray-300 rounded p-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${fontSizeClasses[widget.fontSize]}
            `}
            style={{ 
              color: editTextColor,
              backgroundColor: editBackgroundColor === 'transparent' ? 'transparent' : editBackgroundColor
            }}
            placeholder="Enter your text content here..."
            autoFocus
          />
        ) : (
          <div 
            className={`${fontSizeClasses[widget.fontSize]} leading-relaxed h-full overflow-auto`}
            style={{ color: widget.textColor }}
          >
            {widget.content || 'Click edit to add content...'}
          </div>
        )}
      </div>
    </div>
  );
};