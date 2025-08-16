import React, { useState } from 'react';
import { Edit3, Download, Mail, Copy, Check, FileText, FileDown } from 'lucide-react';
import { exportToPDF, exportToWord } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const SummaryDisplay = ({ summary, onEdit, onEmail, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary?.summary || summary?.generatedSummary || '');
  const [copied, setCopied] = useState(false);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedSummary);
    }
    setIsEditing(!isEditing);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary);
      setCopied(true);
      toast.success('Summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(editedSummary, 'meeting-summary');
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportWord = async () => {
    try {
      await exportToWord(editedSummary, 'meeting-summary');
      toast.success('Word document exported successfully!');
    } catch (error) {
      toast.error('Failed to export Word document');
    }
  };

  if (!summary) {
    return null;
  }

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Generated Summary</h3>
        <div className="flex items-center space-x-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title={isEditing ? 'Save changes' : 'Edit summary'}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Download className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={handleExportWord}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export as Word</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email Button */}
          <button
            onClick={onEmail}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Send via email"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Content */}
      <div className="space-y-4">
        {isEditing ? (
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="textarea-field"
            rows={12}
          />
        ) : (
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                {editedSummary}
              </pre>
            </div>
          </div>
        )}

        {/* Summary Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span>Words: {editedSummary.split(/\s+/).length}</span>
            <span>Characters: {editedSummary.length}</span>
            {summary.processingTime && (
              <span>Generated in: {summary.processingTime}ms</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {summary.provider && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {summary.provider}
              </span>
            )}
            {summary.summaryStyle && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {summary.summaryStyle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedSummary(summary.generatedSummary);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;
