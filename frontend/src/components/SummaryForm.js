import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { summaryAPI } from '../services/api';

const SummaryForm = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('custom');
  const [customPrompt, setCustomPrompt] = useState('');
  const [styles, setStyles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Load styles and providers
    const loadData = async () => {
      try {
        const [stylesRes, providersRes] = await Promise.all([
          summaryAPI.getStyles(),
          summaryAPI.getProviders()
        ]);
        
        setStyles(stylesRes.data || []);
        setProviders(providersRes.data?.providers || []);
        setSelectedProvider(providersRes.data?.default || '');
      } catch (error) {
        console.error('Failed to load styles/providers:', error);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Update prompt when style changes
    const selectedStyleData = styles.find(style => style.id === selectedStyle);
    if (selectedStyleData && selectedStyle !== 'custom') {
      setPrompt(selectedStyleData.prompt);
    } else if (selectedStyle === 'custom') {
      setPrompt(customPrompt);
    }
  }, [selectedStyle, styles, customPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    onSubmit({
      prompt,
      style: selectedStyle,
      provider: selectedProvider
    });
  };

  const handleStyleChange = (styleId) => {
    setSelectedStyle(styleId);
    if (styleId === 'custom') {
      setPrompt(customPrompt);
    }
  };

  const handleCustomPromptChange = (value) => {
    setCustomPrompt(value);
    if (selectedStyle === 'custom') {
      setPrompt(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Summary Style Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Summary Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleStyleChange(style.id)}
              className={`p-3 text-left border rounded-lg transition-colors duration-200 ${
                selectedStyle === style.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{style.name}</div>
              <div className="text-sm text-gray-600 mt-1">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          {selectedStyle === 'custom' ? 'Custom Prompt' : 'Prompt (editable)'}
        </label>
        <textarea
          id="prompt"
          value={selectedStyle === 'custom' ? customPrompt : prompt}
          onChange={(e) => {
            if (selectedStyle === 'custom') {
              handleCustomPromptChange(e.target.value);
            } else {
              setPrompt(e.target.value);
            }
          }}
          placeholder="Enter your custom prompt for the AI..."
          className="textarea-field"
          rows={4}
        />
        <div className="text-xs text-gray-500">
          {prompt.length} characters
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          <span>Advanced Options</span>
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* AI Provider Selection */}
            {providers.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  AI Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="input-field"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} ({provider.model})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select className="input-field">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="loading-spinner"></div>
            <span>Generating Summary...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Summary</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SummaryForm;
