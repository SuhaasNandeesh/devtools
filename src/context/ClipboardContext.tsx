import React, { createContext, useContext, useEffect, useState } from 'react';

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  sourceTool?: string;
}

interface ClipboardContextType {
  history: HistoryItem[];
  addToHistory: (text: string, sourceTool?: string) => void;
  deleteItem: (id: string) => void;
  clearHistory: () => void;
  clipboardPermission: PermissionState | 'unknown';
  requestPermission: () => Promise<boolean>;
  checkClipboardText: () => Promise<string | null>;
}

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

export const ClipboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('devtools_clip_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [clipboardPermission, setClipboardPermission] = useState<PermissionState | 'unknown'>(() => {
    // Default setting stored locally or unknown
    const optIn = localStorage.getItem('devtools_clip_opt_in');
    return optIn === 'granted' ? 'granted' : optIn === 'denied' ? 'denied' : 'unknown';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('devtools_clip_history', JSON.stringify(history));
  }, [history]);

  // Request browser clipboard permission (Opt-in)
  const requestPermission = async (): Promise<boolean> => {
    try {
      // In modern browsers, querying permissions is safe
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        setClipboardPermission(status.state);
        localStorage.setItem('devtools_clip_opt_in', status.state);
        
        // Listen for changes
        status.onchange = () => {
          setClipboardPermission(status.state);
          localStorage.setItem('devtools_clip_opt_in', status.state);
        };
        
        return status.state === 'granted';
      }
      
      // Fallback: try reading straight away
      await navigator.clipboard.readText();
      setClipboardPermission('granted');
      localStorage.setItem('devtools_clip_opt_in', 'granted');
      return true;
    } catch {
      setClipboardPermission('denied');
      localStorage.setItem('devtools_clip_opt_in', 'denied');
      return false;
    }
  };

  // Add text snippet safely, maintaining a max boundary of 30 items
  const addToHistory = (text: string, sourceTool?: string) => {
    if (!text || !text.trim()) return;

    setHistory((prev) => {
      // Avoid duplicate consecutive snippets
      if (prev.length > 0 && prev[0].text === text) return prev;
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 11),
        text: text.trim(),
        timestamp: Date.now(),
        sourceTool
      };
      
      // Prune to latest 30 entries
      const filtered = [newItem, ...prev.filter(item => item.text !== text)];
      return filtered.slice(0, 30);
    });
  };

  // Delete a specific snippet
  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Wipe history clean
  const clearHistory = () => {
    setHistory([]);
  };

  // Try to safely check clipboard text for smart recommendation triggers
  const checkClipboardText = async (): Promise<string | null> => {
    if (clipboardPermission !== 'granted') return null;
    try {
      const text = await navigator.clipboard.readText();
      return text || null;
    } catch {
      return null;
    }
  };

  // Check state changes when window regains focus
  useEffect(() => {
    const handleFocus = async () => {
      if (localStorage.getItem('devtools_clip_opt_in') === 'granted') {
        try {
          if (navigator.permissions && navigator.permissions.query) {
            const status = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
            setClipboardPermission(status.state);
          }
        } catch {
          // Ignore errors
        }
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <ClipboardContext.Provider
      value={{
        history,
        addToHistory,
        deleteItem,
        clearHistory,
        clipboardPermission,
        requestPermission,
        checkClipboardText
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = () => {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error('useClipboard must be used within a ClipboardProvider');
  }
  return context;
};
