import { useState, useEffect, useCallback } from 'react';
import { Widget, DashboardLayout } from '../types/dashboard';

const STORAGE_KEY = 'dashboard-layout';
const GRID_SIZE = 20;

const generateSampleData = () => [
  { label: 'Q1', value: 65 },
  { label: 'Q2', value: 78 },
  { label: 'Q3', value: 82 },
  { label: 'Q4', value: 94 }
];

const defaultChartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

const generateSampleTableData = () => [
  { name: 'John Doe', email: 'john@example.com', status: 'Active', sales: 1250 },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'Active', sales: 980 },
  { name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive', sales: 750 },
  { name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Active', sales: 1400 }
];

export const useDashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      try {
        const layout: DashboardLayout = JSON.parse(savedLayout);
        setWidgets(layout.widgets);
      } catch (error) {
        console.error('Error loading dashboard layout:', error);
      }
    }
  }, []);

  // Save layout to localStorage whenever widgets change
  useEffect(() => {
    const layout: DashboardLayout = {
      widgets,
      gridSize: GRID_SIZE
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [widgets]);

  const snapToGrid = useCallback((value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  const addWidget = useCallback((type: Widget['type']) => {
    const id = `widget-${Date.now()}`;
    const baseWidget = {
      id,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      position: {
        x: snapToGrid(Math.random() * 300),
        y: snapToGrid(Math.random() * 200),
        width: snapToGrid(280),
        height: snapToGrid(200)
      }
    };

    let newWidget: Widget;
    switch (type) {
      case 'chart':
        newWidget = {
          ...baseWidget,
          type: 'chart',
          chartType: 'bar',
          data: generateSampleData(),
          colors: defaultChartColors,
          isLocked: false
        };
        break;
      case 'table':
        newWidget = {
          ...baseWidget,
          type: 'table',
          title: 'Data Table',
          columns: ['name', 'email', 'status', 'sales'],
          data: generateSampleTableData(),
          position: { ...baseWidget.position, width: snapToGrid(400), height: snapToGrid(300) },
          isLocked: false
        };
        break;
      case 'text':
        newWidget = {
          ...baseWidget,
          type: 'text',
          title: 'Text Widget',
          content: 'This is a customizable text widget. Click to edit the content.',
          fontSize: 'medium',
          textColor: '#374151',
          backgroundColor: 'transparent',
          isLocked: false
            };
        break;
      default:
        return;
    }

    setWidgets(prev => [...prev, newWidget]);
  }, [snapToGrid]);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  }, []);

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  }, []);

  const duplicateWidget = useCallback((id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      const newWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
        position: {
          ...widget.position,
          x: snapToGrid(widget.position.x + 20),
          y: snapToGrid(widget.position.y + 20)
        }
      };
      setWidgets(prev => [...prev, newWidget]);
    }
  }, [widgets, snapToGrid]);

  const startDrag = useCallback((id: string, offset: { x: number; y: number }) => {
    setDraggedWidget(id);
    setDragOffset(offset);
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    if (!draggedWidget) return;

    const snappedX = snapToGrid(x - dragOffset.x);
    const snappedY = snapToGrid(y - dragOffset.y);

    updateWidget(draggedWidget, {
      position: {
        ...widgets.find(w => w.id === draggedWidget)?.position!,
        x: Math.max(0, snappedX),
        y: Math.max(0, snappedY)
      }
    });
  }, [draggedWidget, dragOffset, snapToGrid, updateWidget, widgets]);

  const endDrag = useCallback(() => {
    setDraggedWidget(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const clearDashboard = useCallback(() => {
    setWidgets([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    widgets,
    addWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    startDrag,
    updateDrag,
    endDrag,
    draggedWidget,
    snapToGrid,
    clearDashboard
  };
};