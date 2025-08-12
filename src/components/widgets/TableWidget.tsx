import React, { useState } from 'react';
import { TableWidget as TableWidgetType } from '../../types/dashboard';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';

interface TableWidgetProps {
  widget: TableWidgetType;
  onUpdate: (updates: Partial<TableWidgetType>) => void;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ widget, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editColumns, setEditColumns] = useState(widget.columns);
  const [editData, setEditData] = useState(widget.data);

  const handleSave = () => {
    onUpdate({ 
      columns: editColumns, 
      data: editData,
      isLocked: true 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditColumns(widget.columns);
    setEditData(widget.data);
    setIsEditing(false);
  };

  const addColumn = () => {
    const newColumnName = `column${editColumns.length + 1}`;
    setEditColumns([...editColumns, newColumnName]);
    setEditData(editData.map(row => ({ ...row, [newColumnName]: '' })));
  };

  const removeColumn = (columnIndex: number) => {
    const columnToRemove = editColumns[columnIndex];
    setEditColumns(editColumns.filter((_, i) => i !== columnIndex));
    setEditData(editData.map(row => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    }));
  };

  const updateColumnName = (index: number, newName: string) => {
    const oldName = editColumns[index];
    const newColumns = [...editColumns];
    newColumns[index] = newName;
    setEditColumns(newColumns);
    
    setEditData(editData.map(row => {
      const newRow = { ...row };
      if (oldName !== newName) {
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
      }
      return newRow;
    }));
  };

  const addRow = () => {
    const newRow: Record<string, string | number> = {};
    editColumns.forEach(column => {
      newRow[column] = '';
    });
    setEditData([...editData, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    setEditData(editData.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex: number, column: string, value: string | number) => {
    const newData = [...editData];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    setEditData(newData);
  };

  return (
    <div className="h-full flex flex-col">
      {!widget.isLocked && (
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Table Configuration</span>
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={addColumn}
                  className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Column
                </button>
                <button
                  onClick={addRow}
                  className="flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Row
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <div className="p-2">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {editColumns.map((column, columnIndex) => (
                    <th key={columnIndex} className="px-2 py-1 border border-gray-300">
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={column}
                          onChange={(e) => updateColumnName(columnIndex, e.target.value)}
                          className="flex-1 text-xs border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeColumn(columnIndex)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-1 border border-gray-300 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {editData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {editColumns.map((column, columnIndex) => (
                      <td key={columnIndex} className="px-2 py-1 border border-gray-300">
                        <input
                          type="text"
                          value={row[column] || ''}
                          onChange={(e) => updateCell(rowIndex, column, e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 border border-gray-300">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {widget.columns.map(column => (
                  <th
                    key={column}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {widget.data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {widget.columns.map(column => (
                    <td key={column} className="px-3 py-2 whitespace-nowrap text-gray-900">
                      {column === 'status' ? (
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-semibold rounded-full
                          ${row[column] === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {row[column]}
                        </span>
                      ) : column === 'sales' ? (
                        <span className="font-medium">${row[column]}</span>
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};