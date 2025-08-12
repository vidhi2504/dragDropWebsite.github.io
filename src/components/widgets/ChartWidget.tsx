import React, { useState } from 'react';
import { ChartWidget as ChartWidgetType } from '../../types/dashboard';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';

interface ChartWidgetProps {
  widget: ChartWidgetType;
  onUpdate: (updates: Partial<ChartWidgetType>) => void;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ widget, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(widget.data);
  const [editColors, setEditColors] = useState(widget.colors);
  const [editChartType, setEditChartType] = useState(widget.chartType);

  const maxValue = Math.max(...widget.data.map(d => d.value));

  const handleSave = () => {
    onUpdate({ 
      data: editData, 
      colors: editColors, 
      chartType: editChartType,
      isLocked: true 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(widget.data);
    setEditColors(widget.colors);
    setEditChartType(widget.chartType);
    setIsEditing(false);
  };

  const addDataPoint = () => {
    setEditData([...editData, { label: `Item ${editData.length + 1}`, value: 0 }]);
  };

  const removeDataPoint = (index: number) => {
    setEditData(editData.filter((_, i) => i !== index));
  };

  const updateDataPoint = (index: number, field: 'label' | 'value', value: string | number) => {
    const newData = [...editData];
    newData[index] = { ...newData[index], [field]: value };
    setEditData(newData);
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...editColors];
    newColors[index] = color;
    setEditColors(newColors);
  };

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-32 px-4">
      {widget.data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div
            className="w-8 rounded-t transition-all duration-300 hover:opacity-80"
            style={{ 
              height: `${(item.value / maxValue) * 100}px`,
              backgroundColor: widget.colors[index % widget.colors.length]
            }}
          />
          <span className="text-xs text-gray-600 font-medium">{item.label}</span>
          <span className="text-xs text-gray-500">{item.value}</span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-32 mx-4">
      <svg className="w-full h-full">
        <polyline
          points={widget.data.map((item, index) => 
            `${(index / (widget.data.length - 1)) * 100}% ${100 - (item.value / maxValue) * 80}%`
          ).join(' ')}
          fill="none"
          stroke={widget.colors[0]}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        {widget.data.map((item, index) => (
          <g key={index}>
            <circle
              cx={`${(index / (widget.data.length - 1)) * 100}%`}
              cy={`${100 - (item.value / maxValue) * 80}%`}
              r="3"
              fill={widget.colors[0]}
              className="hover:r-4 transition-all duration-200"
            />
            <text
              x={`${(index / (widget.data.length - 1)) * 100}%`}
              y="95%"
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => {
    const total = widget.data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="flex items-center justify-center h-32">
        <div className="relative">
          <svg width="100" height="100" className="transform -rotate-90">
            {widget.data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 2.51} ${100 * 2.51}`;
              const strokeDashoffset = -cumulativePercentage * 2.51;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={widget.colors[index % widget.colors.length]}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="hover:stroke-width-10 transition-all duration-200"
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-4 space-y-1">
          {widget.data.map((item, index) => {
            return (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: widget.colors[index % widget.colors.length] }}
                />
                <span className="text-gray-700">{item.label}: {item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {!widget.isLocked && (
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Chart Configuration</span>
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
                <label className="text-xs font-medium text-gray-700">Chart Type:</label>
                <select
                  value={editChartType}
                  onChange={(e) => setEditChartType(e.target.value as ChartWidgetType['chartType'])}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Data Points:</label>
                  <button
                    onClick={addDataPoint}
                    className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {editData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Label"
                      />
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => updateDataPoint(index, 'value', parseFloat(e.target.value) || 0)}
                        className="w-16 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Value"
                      />
                      <input
                        type="color"
                        value={editColors[index] || '#3B82F6'}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                      />
                      <button
                        onClick={() => removeDataPoint(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex-1 p-2">
        {widget.chartType === 'bar' && renderBarChart()}
        {widget.chartType === 'line' && renderLineChart()}
        {widget.chartType === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};