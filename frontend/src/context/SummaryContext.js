import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SummaryContext = createContext();

const initialState = {
  currentSummary: null,
  history: [],
  loading: false,
  error: null,
  userId: localStorage.getItem('userId') || uuidv4(),
  providers: [],
  styles: []
};

const summaryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_CURRENT_SUMMARY':
      return { ...state, currentSummary: action.payload };
    
    case 'UPDATE_CURRENT_SUMMARY':
      return { 
        ...state, 
        currentSummary: { ...state.currentSummary, ...action.payload }
      };
    
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history]
      };
    
    case 'UPDATE_HISTORY_ITEM':
      return {
        ...state,
        history: state.history.map(item => 
          item._id === action.payload._id ? action.payload : item
        )
      };
    
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        history: state.history.filter(item => item._id !== action.payload)
      };
    
    case 'SET_PROVIDERS':
      return { ...state, providers: action.payload };
    
    case 'SET_STYLES':
      return { ...state, styles: action.payload };
    
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    
    default:
      return state;
  }
};

export const SummaryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(summaryReducer, initialState);

  // Save userId to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userId', state.userId);
  }, [state.userId]);

  const value = {
    ...state,
    dispatch,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    setCurrentSummary: (summary) => dispatch({ type: 'SET_CURRENT_SUMMARY', payload: summary }),
    updateCurrentSummary: (updates) => dispatch({ type: 'UPDATE_CURRENT_SUMMARY', payload: updates }),
    setHistory: (history) => dispatch({ type: 'SET_HISTORY', payload: history }),
    addToHistory: (summary) => dispatch({ type: 'ADD_TO_HISTORY', payload: summary }),
    updateHistoryItem: (summary) => dispatch({ type: 'UPDATE_HISTORY_ITEM', payload: summary }),
    removeFromHistory: (id) => dispatch({ type: 'REMOVE_FROM_HISTORY', payload: id }),
    setProviders: (providers) => dispatch({ type: 'SET_PROVIDERS', payload: providers }),
    setStyles: (styles) => dispatch({ type: 'SET_STYLES', payload: styles }),
    setUserId: (userId) => dispatch({ type: 'SET_USER_ID', payload: userId })
  };

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};
