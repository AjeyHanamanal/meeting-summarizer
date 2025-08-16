import React, { useState } from 'react';
import { X, Mail, Send, AlertCircle } from 'lucide-react';
import { emailAPI } from '../services/api';
import toast from 'react-hot-toast';

const EmailModal = ({ isOpen, onClose, summary, summaryId }) => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipients.trim()) {
      toast.error('Please enter at least one recipient email');
      return;
    }

    const emailList = recipients.split(',').map(email => email.trim()).filter(email => email);
    
    if (emailList.length === 0) {
      toast.error('Please enter valid email addresses');
      return;
    }

    setLoading(true);
    try {
      const response = await emailAPI.send({
        summaryId,
        summary: summary?.generatedSummary || summary,
        recipients: emailList,
        subject
      });

      setEmailStatus({
        success: true,
        message: `Email sent successfully to ${response.data.recipients.length} recipient(s)`,
        data: response.data
      });
      
      toast.success('Email sent successfully!');
      
      // Reset form
      setRecipients('');
      setSubject('Meeting Summary');
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setEmailStatus(null);
      }, 2000);
      
    } catch (error) {
      setEmailStatus({
        success: false,
        message: error.message || 'Failed to send email'
      });
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setEmailStatus(null);
      setRecipients('');
      setSubject('Meeting Summary');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Send Summary via Email</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email Status */}
          {emailStatus && (
            <div className={`p-3 rounded-lg ${
              emailStatus.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{emailStatus.message}</span>
              </div>
            </div>
          )}

          {/* Recipients */}
          <div className="space-y-2">
            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
              Recipients *
            </label>
            <textarea
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Enter email addresses separated by commas..."
              className="textarea-field"
              rows={3}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Separate multiple email addresses with commas
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Summary Preview
            </label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-700 line-clamp-4">
                {summary?.generatedSummary || summary || 'No summary available'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !recipients.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
