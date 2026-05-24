import { useState, useEffect } from 'react';
import { TOOLS_CATALOG } from '../utils/toolsCatalog';
import type { ToolEntry } from '../utils/toolsCatalog';

export const useSmartClipboard = (
  clipboardPermission: string,
  checkClipboardText: () => Promise<string | null>,
  activeToolId: string
) => {
  const [smartDetectedTool, setSmartDetectedTool] = useState<ToolEntry | null>(null);
  const [detectedText, setDetectedText] = useState('');

  const runSmartClipboardScanner = async () => {
    if (clipboardPermission !== 'granted') return;

    const text = await checkClipboardText();
    if (!text || !text.trim() || text.length < 3) {
      setSmartDetectedTool(null);
      setDetectedText('');
      return;
    }

    const trimmed = text.trim();
    setDetectedText(trimmed);

    // Rule 1: Detect UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'regex-tester') || null); // Regex checker can verify format
      return;
    }

    // Rule 2: Detect JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed);
        setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'json-formatter') || null);
        return;
      } catch {
        // Not valid JSON
      }
    }

    // Rule 3: Detect Base64
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (trimmed.length > 15 && base64Regex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'base64-converter') || null);
      return;
    }

    // Rule 4: Detect Unix timestamp
    const epochRegex = /^\d{10}$|^\d{13}$/;
    if (epochRegex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'epoch-converter') || null);
      return;
    }

    // Rule 5: Detect JWT Token
    const jwtRegex = /^[a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+$/;
    if (jwtRegex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'jwt-debugger') || null);
      return;
    }

    // Rule 6: Detect IPv4 Subnet Calculator
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipv4Regex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'subnet-calculator') || null);
      return;
    }

    // Rule 7: Detect raw SVG Markup
    if (trimmed.startsWith('<svg') || (trimmed.startsWith('<?xml') && trimmed.includes('<svg'))) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'svg-optimizer') || null);
      return;
    }

    // Rule 8: Detect special accented Unicode characters
    const accentLettersRegex = /[áéíóúñüçßàèìòùâêîôûäëïöÿæœåøÁÉÍÓÚÑÜÇÀÈÌÒÙÂÊÎÔÛÄËÏÖŸÆŒÅØ]/;
    if (accentLettersRegex.test(trimmed) && trimmed.length < 500) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'html-accents-encoder') || null);
      return;
    }

    // Rule 9: Detect SQL statements
    const sqlRegex = /^\s*(select|insert|update|delete|create|drop|alter|truncate)\b/i;
    if (sqlRegex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'sql-formatter') || null);
      return;
    }

    // Rule 10: Detect Markdown headers/lists
    const mdRegex = /^(?:#+\s+.+|-\s+.+|\*\s+.+)/m;
    if (mdRegex.test(trimmed) && trimmed.length < 1000) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'markdown-previewer') || null);
      return;
    }

    // Rule 11: Detect raw CSS rulesets
    const cssRegex = /^\s*[\.#a-zA-Z0-9_\-\*]+\s*\{[^}]*\}/m;
    if (cssRegex.test(trimmed) && trimmed.length < 1000) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'css-formatter') || null);
      return;
    }

    // Rule 12: Detect Cron expression
    const cronRegex = /^\s*(?:[0-5]?\d|\*|(?:\d+(?:-\d+)?(?:,\d+)*)(?:\/\d+)?)\s+(?:[0-2]?\d|\*|(?:\d+(?:-\d+)?(?:,\d+)*)(?:\/\d+)?)\s+(?:[0-3]?\d|\*|(?:\d+(?:-\d+)?(?:,\d+)*)(?:\/\d+)?)\s+(?:[1-9]|1[0-2]|\*|(?:\d+(?:-\d+)?(?:,\d+)*)(?:\/\d+)?)\s+(?:[0-7]|\*|(?:\d+(?:-\d+)?(?:,\d+)*)(?:\/\d+)?)\s*$/;
    if (cronRegex.test(trimmed)) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'cron-descriptor') || null);
      return;
    }

    // Rule 13: Detect URLs for QR Code
    if (/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(trimmed) && trimmed.length < 150) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'qrcode-generator') || null);
      return;
    }

    // Rule 14: Detect massive text block for Word Counter
    if (trimmed.split(/\s+/).length > 80) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'word-counter') || null);
      return;
    }

    // Rule 15: Detect Git Diff structures or edit outputs for Text Diff
    if (trimmed.startsWith('diff --git') || (trimmed.includes('\n+') && trimmed.includes('\n-'))) {
      setSmartDetectedTool(TOOLS_CATALOG.find((t) => t.id === 'text-diff') || null);
      return;
    }

    setSmartDetectedTool(null);
  };

  useEffect(() => {
    window.addEventListener('focus', runSmartClipboardScanner);
    runSmartClipboardScanner(); // initial trigger
    return () => window.removeEventListener('focus', runSmartClipboardScanner);
  }, [clipboardPermission, activeToolId]);

  return { smartDetectedTool, detectedText, setSmartDetectedTool };
};
