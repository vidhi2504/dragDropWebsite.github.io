import React from 'react';
import { Widget } from './Widget';
import { WidgetToolbox } from './WidgetToolbox';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const {
    widgets,
    addWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    startDrag,
    updateDrag,
    endDrag,
    draggedWidget,
    clearDashboard
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <WidgetToolbox onAddWidget={addWidget} onClearDashboard={clearDashboard} />
      
      <div 
        className="relative p-6 min-h-screen"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets yet</h3>
              <p className="text-gray-500 mb-4">Add your first widget using the toolbar above</p>
            </div>
          </div>
        ) : (
          widgets.map(widget => (
            <Widget
              key={widget.id}
              widget={widget}
              onUpdate={(updates) => updateWidget(widget.id, updates)}
              onDelete={() => deleteWidget(widget.id)}
              onDuplicate={() => duplicateWidget(widget.id)}
              onDragStart={(offset) => startDrag(widget.id, offset)}
              onDrag={updateDrag}
              onDragEnd={endDrag}
              isDragging={draggedWidget === widget.id}
            />
          ))
        )}
      </div>
    </div>
  );
};