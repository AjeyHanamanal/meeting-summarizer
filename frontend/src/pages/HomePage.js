import React, { useState, useEffect } from 'react';
import { useSummary } from '../context/SummaryContext';
import { summaryAPI } from '../services/api';
import FileUpload from '../components/FileUpload';
import SummaryForm from '../components/SummaryForm';
import SummaryDisplay from '../components/SummaryDisplay';
import EmailModal from '../components/EmailModal';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { 
    currentSummary, 
    setCurrentSummary, 
    addToHistory, 
    updateCurrentSummary,
    loading,
    setLoading,
    error,
    setError,
    userId
  } = useSummary();

  const [transcript, setTranscript] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [error, setError]);

  const handleGenerateSummary = async (formData) => {
    if (!transcript.trim()) {
      toast.error('Please provide a transcript');
      return;
    }

    setLoading(true);
    try {
      const response = await summaryAPI.generate({
        transcript: transcript.trim(),
        prompt: formData.prompt,
        style: formData.style,
        provider: formData.provider,
        userId
      });

      const summaryData = {
        ...response.data,
        generatedSummary: response.data.summary, // Map summary to generatedSummary for compatibility
        prompt: formData.prompt,
        summaryStyle: formData.style
      };

      setCurrentSummary(summaryData);
      addToHistory(summaryData);
      
      toast.success('Summary generated successfully!');
      
    } catch (error) {
      console.error('Summary generation error:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSummary = async (editedSummary) => {
    if (!currentSummary?.id) {
      toast.error('No summary to edit');
      return;
    }

    try {
      const response = await summaryAPI.update(currentSummary.id, {
        editedSummary
      });

      const updatedSummary = {
        ...currentSummary,
        editedSummary: response.data.editedSummary
      };

      setCurrentSummary(updatedSummary);
      updateCurrentSummary(updatedSummary);
      
      toast.success('Summary updated successfully!');
      
    } catch (error) {
      console.error('Summary update error:', error);
      toast.error('Failed to update summary');
    }
  };

  const handleEmailSummary = () => {
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Meeting Summarizer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your meeting transcript or paste text to generate intelligent summaries using AI. 
          Choose from different styles and share via email or export to PDF/Word.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Transcript
            </h2>
            <FileUpload 
              onTranscriptChange={setTranscript}
              transcript={transcript}
            />
          </div>

          {/* Summary Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generate Summary
            </h2>
            <SummaryForm 
              onSubmit={handleGenerateSummary}
              loading={loading}
            />
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          {/* Summary Display */}
          {currentSummary && (
            <SummaryDisplay
              summary={currentSummary}
              onEdit={handleEditSummary}
              onEmail={handleEmailSummary}
              loading={loading}
            />
          )}

          {/* Instructions */}
          {!currentSummary && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How to Use
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    1
                  </div>
                  <p>Upload a .txt file or paste your meeting transcript in the text area</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    2
                  </div>
                  <p>Choose a summary style or write your own custom prompt</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    3
                  </div>
                  <p>Click "Generate Summary" to create your AI-powered summary</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    4
                  </div>
                  <p>Edit, export, or share your summary via email</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={handleCloseEmailModal}
        summary={currentSummary}
        summaryId={currentSummary?.id}
      />
    </div>
  );
};

export default HomePage;
