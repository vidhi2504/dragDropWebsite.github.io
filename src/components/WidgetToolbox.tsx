import React from 'react';
import { BarChart3, Table, Type, Plus } from 'lucide-react';
import { Widget } from '../types/dashboard';

interface WidgetToolboxProps {
  onAddWidget: (type: Widget['type']) => void;
  onClearDashboard: () => void;
}

export const WidgetToolbox: React.FC<WidgetToolboxProps> = ({ onAddWidget, onClearDashboard }) => {
  const widgetTypes = [
    { type: 'chart' as const, icon: BarChart3, label: 'Chart', color: 'bg-blue-500' },
    { type: 'table' as const, icon: Table, label: 'Table', color: 'bg-emerald-500' },
    { type: 'text' as const, icon: Type, label: 'Text', color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Builder</h2>
          <div className="flex items-center space-x-2">
            {widgetTypes.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => onAddWidget(type)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium
                  ${color} hover:opacity-90 transition-opacity
                `}
              >
                <Plus className="w-4 h-4" />
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onClearDashboard}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};