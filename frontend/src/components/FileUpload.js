import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const FileUpload = ({ onTranscriptChange, transcript }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is a text file
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert('File size must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileName(file.name);
      onTranscriptChange(content);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFileName('');
    onTranscriptChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">TXT files only, max 1MB</p>
        </div>
      </div>

      {/* File Info */}
      {fileName && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{fileName}</span>
          </div>
          <button
            onClick={clearFile}
            className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Manual Text Input */}
      <div className="space-y-2">
        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
          Or paste your transcript here:
        </label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="textarea-field"
          rows={8}
        />
        {transcript && (
          <div className="text-xs text-gray-500">
            {transcript.split(/\s+/).length} words, {transcript.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
