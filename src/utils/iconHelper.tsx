import React from 'react';
import {
  Clock,
  Binary,
  RefreshCw,
  Braces,
  Code2,
  FileCode,
  Paintbrush,
  Database,
  BookOpen,
  Zap,
  Fingerprint,
  Key,
  AlignLeft,
  Lock,
  Shield,
  QrCode,
  Barcode,
  Cpu,
  Users,
  Calendar,
  Terminal,
  Type,
  GitCompare,
  ArrowUpAZ,
  Scissors,
  Gauge,
  Eraser,
  Slash,
  Replace,
  Globe,
  Send,
  AlertCircle,
  Network,
  Laptop,
  Link,
  Box,
  Layout,
  Layers,
  Languages,
  Keyboard,
  Maximize,
  Palette,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const getToolIcon = (toolId: string): React.ComponentType<{ size?: number; style?: React.CSSProperties }> => {
  switch (toolId) {
    case 'epoch-converter':
      return Clock;
    case 'timezone-converter':
      return Clock;
    case 'radix-converter':
      return Binary;
    case 'base64-converter':
      return RefreshCw;
    case 'json-formatter':
      return Braces;
    case 'xml-formatter':
      return Code2;
    case 'html-formatter':
      return FileCode;
    case 'css-formatter':
      return Paintbrush;
    case 'sql-formatter':
      return Database;
    case 'markdown-previewer':
      return BookOpen;
    case 'js-minifier':
      return Zap;
    case 'uuid-generator':
      return Fingerprint;
    case 'password-generator':
      return Key;
    case 'lorem-ipsum-generator':
      return AlignLeft;
    case 'hash-generator':
      return Lock;
    case 'hmac-generator':
      return Shield;
    case 'qrcode-generator':
      return QrCode;
    case 'barcode-generator':
      return Barcode;
    case 'rsa-generator':
      return Cpu;
    case 'fake-data-generator':
      return Users;
    case 'cron-descriptor':
      return Calendar;
    case 'regex-tester':
      return Terminal;
    case 'case-converter':
      return Type;
    case 'text-diff':
      return GitCompare;
    case 'line-sorter':
      return ArrowUpAZ;
    case 'line-splitter':
      return Scissors;
    case 'word-counter':
      return Gauge;
    case 'comment-stripper':
      return Eraser;
    case 'string-escaper':
      return Slash;
    case 'find-replace':
      return Replace;
    case 'slug-generator':
      return Globe;
    case 'jwt-debugger':
      return Send;
    case 'curl-builder':
      return Terminal;
    case 'http-status-lookup':
      return AlertCircle;
    case 'subnet-calculator':
      return Network;
    case 'user-agent-inspector':
      return Laptop;
    case 'link-extractor':
      return Link;
    case 'mime-lookup':
      return Box;
    case 'css-shadow-border':
      return Layout;
    case 'css-layout-sandbox':
      return Layers;
    case 'html-accents-encoder':
      return Languages;
    case 'keyboard-event-monitor':
      return Keyboard;
    case 'aspect-ratio-calculator':
      return Maximize;
    case 'svg-optimizer':
      return Palette;
    case 'web-safe-font-stacks':
      return Type;
    case 'glassmorphic-css-styler':
      return Sparkles;
    case 'feedback-hub':
      return MessageSquare;
    default:
      return FileCode;
  }
};
