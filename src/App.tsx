import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './context/ThemeContext';
import { useClipboard } from './context/ClipboardContext';
import { ClipboardPanel } from './components/ClipboardPanel';
import { OnboardingModal } from './components/OnboardingModal';

import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Clipboard,
  Search,
  Sparkles,
  Command,
  X,
  FileCode,
  ArrowRight,
  HelpCircle,
  Star,
  Clock,
  Binary,
  RefreshCw,
  Braces,
  Code2,
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
  MessageSquare
} from 'lucide-react';

import {
  toggleFavouriteArray,
  ensureFeedbackHubAtBottom,
  reorderFavourites
} from './utils/engines';

// Tool Components
import { EpochConverter } from './tools/converters/EpochConverter';
import { RadixConverter } from './tools/converters/RadixConverter';
import { Base64Converter } from './tools/converters/Base64Converter';
import { TimeZoneConverter } from './tools/converters/TimeZoneConverter';
import { JSONFormatter } from './tools/formatters/JSONFormatter';
import { XmlFormatter } from './tools/formatters/XmlFormatter';
import { HtmlFormatter } from './tools/formatters/HtmlFormatter';
import { CssFormatter } from './tools/formatters/CssFormatter';
import { SqlFormatter } from './tools/formatters/SqlFormatter';
import { MarkdownPreviewer } from './tools/formatters/MarkdownPreviewer';
import { JsMinifier } from './tools/formatters/JsMinifier';
import { UUIDGenerator } from './tools/generators/UUIDGenerator';
import { PasswordGenerator } from './tools/generators/PasswordGenerator';
import { LoremIpsumGenerator } from './tools/generators/LoremIpsumGenerator';
import { HashGenerator } from './tools/generators/HashGenerator';
import { HmacGenerator } from './tools/generators/HmacGenerator';
import { QrCodeGenerator } from './tools/generators/QrCodeGenerator';
import { BarcodeGenerator } from './tools/generators/BarcodeGenerator';
import { RsaGenerator } from './tools/generators/RsaGenerator';
import { FakeDataGenerator } from './tools/generators/FakeDataGenerator';
import { CronDescriptor } from './tools/generators/CronDescriptor';
import { RegexTester } from './tools/text/RegexTester';
import { CaseConverter } from './tools/text/CaseConverter';
import { TextDiff } from './tools/text/TextDiff';
import { LineSorter } from './tools/text/LineSorter';
import { LineSplitter } from './tools/text/LineSplitter';
import { WordCounter } from './tools/text/WordCounter';
import { CommentStripper } from './tools/text/CommentStripper';
import { StringEscaper } from './tools/text/StringEscaper';
import { FindReplace } from './tools/text/FindReplace';
import { SlugGenerator } from './tools/text/SlugGenerator';

// Category E: Network & API Debugging Tools
import { JWTDebugger } from './tools/network/JWTDebugger';
import { CurlBuilder } from './tools/network/CurlBuilder';
import { HttpStatusLookup } from './tools/network/HttpStatusLookup';
import { SubnetCalculator } from './tools/network/SubnetCalculator';
import { UserAgentInspector } from './tools/network/UserAgentInspector';
import { LinkExtractor } from './tools/network/LinkExtractor';
import { MimeLookup } from './tools/network/MimeLookup';

// Category F: Web Design & CSS Playgrounds
import { CSSShadowBorder } from './tools/frontend/CSSShadowBorder';
import { CSSLayoutSandbox } from './tools/frontend/CSSLayoutSandbox';
import { HtmlAccents } from './tools/frontend/HtmlAccents';
import { KeyboardMonitor } from './tools/frontend/KeyboardMonitor';
import { AspectRatioCalc } from './tools/frontend/AspectRatioCalc';
import { SvgOptimizer } from './tools/frontend/SvgOptimizer';
import { WebFontStacks } from './tools/frontend/WebFontStacks';
import { GlassmorphismStyler } from './tools/frontend/GlassmorphismStyler';
import { FeedbackHub } from './tools/feedback/FeedbackHub';

// Update & Changelog components and utilities
import { ChangelogModal } from './components/ChangelogModal';
import { UpdateNotification } from './components/UpdateNotification';
import { CURRENT_VERSION } from './assets/changelogContent';
import { isNewerVersion, evaluateUpdateCheckSchedule, saveUpdateCheckCache } from './utils/version';


interface ToolEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.FC;
}

const TOOLS_CATALOG: ToolEntry[] = [
  {
    id: 'epoch-converter',
    name: 'Epoch Unix Timestamp',
    category: 'Converters',
    description: 'Convert seconds/milliseconds epochs to human dates and vice versa.',
    component: EpochConverter
  },
  {
    id: 'timezone-converter',
    name: 'Time Zone Converter',
    category: 'Converters',
    description: 'Convert UTC, IST, GMT/BST, and global timezones with live ticking dashboards.',
    component: TimeZoneConverter
  },
  {
    id: 'radix-converter',
    name: 'Radix Base Converter',
    category: 'Converters',
    description: 'Convert Dec, Hex, Bin, Oct representations instantly.',
    component: RadixConverter
  },
  {
    id: 'base64-converter',
    name: 'Base64 Text Encoder',
    category: 'Converters',
    description: 'UTF-8 compatible string encoding and decoding.',
    component: Base64Converter
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Minifier',
    category: 'Formatters',
    description: 'Sort keys, pretty-print or compress JSON records.',
    component: JSONFormatter
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter & Minifier',
    category: 'Formatters',
    description: 'Prettify XML structures or compress markup offline.',
    component: XmlFormatter
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter & Minifier',
    category: 'Formatters',
    description: 'Structure HTML element scopes or minify web templates.',
    component: HtmlFormatter
  },
  {
    id: 'css-formatter',
    name: 'CSS Beautifier & Minifier',
    category: 'Formatters',
    description: 'Clean stylesheet selectors or compress CSS code.',
    component: CssFormatter
  },
  {
    id: 'sql-formatter',
    name: 'SQL Query Beautifier',
    category: 'Formatters',
    description: 'Standardize keyword casings and format database queries.',
    component: SqlFormatter
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown to HTML Previewer',
    category: 'Formatters',
    description: 'Real-time Markdown editor and live HTML rendering.',
    component: MarkdownPreviewer
  },
  {
    id: 'js-minifier',
    name: 'JS / TS Minifier',
    category: 'Formatters',
    description: 'Compress, optimize, and minify JavaScript and TypeScript.',
    component: JsMinifier
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator',
    category: 'Generators',
    description: 'Bulk synthesize version 4 or version 1 secure identifiers.',
    component: UUIDGenerator
  },
  {
    id: 'password-generator',
    name: 'Strong Password Generator',
    category: 'Generators',
    description: 'Generate secure, high-entropy random passwords offline.',
    component: PasswordGenerator
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    description: 'Generate standard Latin placeholder text by words/sentences/paragraphs.',
    component: LoremIpsumGenerator
  },
  {
    id: 'hash-generator',
    name: 'Hash Digest Generator',
    category: 'Generators',
    description: 'Compute MD5, SHA-256, and SHA-512 hashes in real-time.',
    component: HashGenerator
  },
  {
    id: 'hmac-generator',
    name: 'HMAC Signature Generator',
    category: 'Generators',
    description: 'Generate HMAC-SHA256 signatures offline with secret keys.',
    component: HmacGenerator
  },
  {
    id: 'qrcode-generator',
    name: 'QR Code Generator',
    category: 'Generators',
    description: 'Generate scannable QR Code vector SVGs locally offline.',
    component: QrCodeGenerator
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    category: 'Generators',
    description: 'Generate Code 128 barcode vector SVGs offline.',
    component: BarcodeGenerator
  },
  {
    id: 'rsa-generator',
    name: 'RSA Key Pair Generator',
    category: 'Generators',
    description: 'Locally generate secure public/private key pairs in PEM layouts.',
    component: RsaGenerator
  },
  {
    id: 'fake-data-generator',
    name: 'Fake Test Data Generator',
    category: 'Generators',
    description: 'Generate repeatable mock databases of names, cards, and addresses.',
    component: FakeDataGenerator
  },
  {
    id: 'cron-descriptor',
    name: 'Cron Scheduler Descriptor',
    category: 'Generators',
    description: 'Build cron scheduler rules visually and translate them to plain-English.',
    component: CronDescriptor
  },
  {
    id: 'regex-tester',
    name: 'Interactive Regex Tester',
    category: 'Text Utilities',
    description: 'Test patterns, highlights match overlays and groupings.',
    component: RegexTester
  },
  {
    id: 'case-converter',
    name: 'String Case Converter',
    category: 'Text Utilities',
    description: 'Convert string casing styles between camel, Pascal, snake, kebab, or constant case configurations.',
    component: CaseConverter
  },
  {
    id: 'text-diff',
    name: 'Text Diff & Comparison',
    category: 'Text Utilities',
    description: 'Line-by-line visual difference highlighting of text edits, insertions and deletions.',
    component: TextDiff
  },
  {
    id: 'line-sorter',
    name: 'Line Sorter & Deduplicator',
    category: 'Text Utilities',
    description: 'Filter empty rows, remove duplicates and sort lines alphabetically.',
    component: LineSorter
  },
  {
    id: 'line-splitter',
    name: 'Huge Line Splitter',
    category: 'Text Utilities',
    description: 'Split massive horizontal lists or CSV structures into custom line chunks.',
    component: LineSplitter
  },
  {
    id: 'word-counter',
    name: 'Word & Token Counter',
    category: 'Text Utilities',
    description: 'Count words, chars, white spaces, reading speeds and top recurring token density charts.',
    component: WordCounter
  },
  {
    id: 'comment-stripper',
    name: 'Code Comment Stripper',
    category: 'Text Utilities',
    description: 'Strip comments from JS/TS, Python, C++, HTML and CSS snippets.',
    component: CommentStripper
  },
  {
    id: 'string-escaper',
    name: 'String Escaper & Unescaper',
    category: 'Text Utilities',
    description: 'Safely encode or decode special characters in HTML, JSON, SQL, or C# styles.',
    component: StringEscaper
  },
  {
    id: 'find-replace',
    name: 'Find & Replace',
    category: 'Text Utilities',
    description: 'Search and replace string tokens with regex search patterns or literal lookups.',
    component: FindReplace
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    category: 'Text Utilities',
    description: 'Translate special Unicode characters into clean URL-safe hyphenated SEO slugs.',
    component: SlugGenerator
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Debugger',
    category: 'Network Utilities',
    description: 'Decode and inspect JSON Web Token (JWT) claims offline.',
    component: JWTDebugger
  },
  {
    id: 'curl-builder',
    name: 'Curl Command Builder',
    category: 'Network Utilities',
    description: 'Visual form generator for customized cURL commands.',
    component: CurlBuilder
  },
  {
    id: 'http-status-lookup',
    name: 'HTTP Status Directory',
    category: 'Network Utilities',
    description: 'Directory reference sheet of standard HTTP status codes.',
    component: HttpStatusLookup
  },
  {
    id: 'subnet-calculator',
    name: 'IPv4 CIDR Calculator',
    category: 'Network Utilities',
    description: 'Visual IPv4 calculator and CIDR boundary slider.',
    component: SubnetCalculator
  },
  {
    id: 'user-agent-inspector',
    name: 'User Agent Inspector',
    category: 'Network Utilities',
    description: 'Parse, inspect, and decode User Agent headers offline.',
    component: UserAgentInspector
  },
  {
    id: 'link-extractor',
    name: 'HTML Link Scraper',
    category: 'Network Utilities',
    description: 'Extract, scrape, and group hyperlinks and assets from raw HTML.',
    component: LinkExtractor
  },
  {
    id: 'mime-lookup',
    name: 'MIME Types Lookup',
    category: 'Network Utilities',
    description: 'Offline searchable database of standard MIME content types.',
    component: MimeLookup
  },
  {
    id: 'css-shadow-border',
    name: 'CSS Shadow & Radius',
    category: 'Web Design & CSS Playgrounds',
    description: 'Visual designer for CSS box shadows and border corner radii.',
    component: CSSShadowBorder
  },
  {
    id: 'css-layout-sandbox',
    name: 'CSS Flexbox & Grid Sandbox',
    category: 'Web Design & CSS Playgrounds',
    description: 'Real-time visual layout designer for CSS Flexbox and Grid containers.',
    component: CSSLayoutSandbox
  },
  {
    id: 'html-accents-encoder',
    name: 'HTML Accents Entity Encoder',
    category: 'Web Design & CSS Playgrounds',
    description: 'Translate special Unicode accented characters to HTML named entities.',
    component: HtmlAccents
  },
  {
    id: 'keyboard-event-monitor',
    name: 'Keyboard Event Monitor',
    category: 'Web Design & CSS Playgrounds',
    description: 'Real-time capturing and display of key event parameters.',
    component: KeyboardMonitor
  },
  {
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Scaler',
    category: 'Web Design & CSS Playgrounds',
    description: 'Simplify display resolutions or lock ratios to scale width and height coordinates.',
    component: AspectRatioCalc
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Vector Optimizer',
    category: 'Web Design & CSS Playgrounds',
    description: 'Optimize, minifies, and render raw SVG vector designs offline.',
    component: SvgOptimizer
  },
  {
    id: 'web-safe-font-stacks',
    name: 'Web Safe Font Stacks',
    category: 'Web Design & CSS Playgrounds',
    description: 'Cross-platform CSS safe font families reference directory.',
    component: WebFontStacks
  },
  {
    id: 'glassmorphic-css-styler',
    name: 'Glassmorphism CSS Styler',
    category: 'Web Design & CSS Playgrounds',
    description: 'Frosted CSS backdrops, blur radii, and shadow designer dashboard.',
    component: GlassmorphismStyler
  },
  {
    id: 'feedback-hub',
    name: 'Feedback & Support Hub',
    category: 'Support',
    description: 'Create offline feedback reports, manage drafts locker, or bridge to GitHub issues securely.',
    component: FeedbackHub
  }
];

const getToolIcon = (toolId: string): React.ComponentType<{ size?: number; style?: React.CSSProperties }> => {
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

let audioCtx: AudioContext | null = null;
let audioMutedGlobal = true; // Default to muted by default as requested!

if (typeof localStorage !== 'undefined') {
  const cachedMute = localStorage.getItem('devtools_audio_muted');
  if (cachedMute !== null) {
    audioMutedGlobal = cachedMute === 'true';
  }
}

const playFeedbackSound = (type: 'click' | 'success') => {
  if (audioMutedGlobal) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'success') {
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      gainNode.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      osc1.connect(gainNode);

      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25);
      osc2.connect(gainNode);

      osc1.start(now);
      osc1.stop(now + 0.25);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.25);
    }
  } catch (err) {
    console.warn('Audio feedback failed:', err);
  }
};

if (typeof window !== 'undefined') {
  (window as any).playFeedbackSound = playFeedbackSound;
}

const getBgThemeColors = (themeName: string) => {
  switch (themeName) {
    case 'cosmic-nebula':
      return {
        color1: 'hsl(265, 80%, 45%)',
        color2: 'hsl(340, 80%, 45%)',
        color3: 'hsl(217, 89%, 45%)',
        mixMode: 'screen'
      };
    case 'zenith-mint':
      return {
        color1: 'hsl(142, 60%, 75%)',
        color2: 'hsl(180, 50%, 70%)',
        color3: 'hsl(205, 50%, 75%)',
        mixMode: 'multiply'
      };
    case 'minimalist-slate':
      return {
        color1: 'transparent',
        color2: 'transparent',
        color3: 'transparent',
        mixMode: 'normal'
      };
    case 'neon-aurora':
    default:
      return {
        color1: 'var(--accent-primary)',
        color2: 'var(--accent-secondary)',
        color3: 'var(--color-success)',
        mixMode: 'screen'
      };
  }
};



const DashboardHub: React.FC<{
  onSelectTool: (id: string) => void;
  favourites: string[];
  toggleFavourite: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clipboardScrapsCount: number;
}> = ({ onSelectTool, favourites, toggleFavourite, searchQuery, setSearchQuery, clipboardScrapsCount }) => {
  const filteredTools = TOOLS_CATALOG.filter((tool) => {
    const q = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
    );
  });

  const grouped = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolEntry[]>);



  return (
    <div 
      style={{ 
        padding: 'var(--space-6)', 
        height: '100%', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        position: 'relative'
      }}
      className="animate-fade"
    >
      <div 
        className="glass-panel"
        style={{
          padding: 'var(--space-6)',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h1 
            style={{ 
              fontSize: '1.75rem', 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, var(--text-primary), var(--accent-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ background: 'linear-gradient(45deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to DevTools
            </span>
            <span 
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.05em',
                boxShadow: '0 0 10px var(--accent-glow)',
                WebkitTextFillColor: 'var(--accent-primary)',
                flexShrink: 0
              }}
            >
              v{CURRENT_VERSION}
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Airtight, local-origin developer utility framework. 100% Secure & Offline.
          </p>
        </div>

      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-4)'
        }}
      >
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Utilities</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>45 Tools</span>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Clipboard Scraps</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{clipboardScrapsCount} cached</span>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>My Favourites</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{favourites.length} active</span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          placeholder="Search all 45 utilities, converters, formatters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input"
          style={{
            padding: 'var(--space-4) var(--space-10)',
            fontSize: '1rem',
            borderRadius: 'var(--radius-lg)'
          }}
        />
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: 'var(--space-4)', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} 
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {Object.entries(grouped).map(([category, tools]) => {
          if (tools.length === 0) return null;
          return (
            <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {category}
              </h2>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: 'var(--space-4)' 
                }}
              >
                {tools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.id);
                  const isFav = favourites.includes(tool.id);
                  return (
                    <div 
                      key={tool.id}
                      className="glass-panel glass-card"
                      onClick={() => {
                        (window as any).playFeedbackSound?.('click');
                        onSelectTool(tool.id);
                      }}
                      style={{
                        padding: 'var(--space-4)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 'var(--space-3)',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div 
                            style={{ 
                              padding: 'var(--space-2)', 
                              borderRadius: 'var(--radius-md)', 
                              background: 'var(--accent-glow)',
                              color: 'var(--accent-primary)',
                              display: 'inline-flex'
                            }}
                          >
                            <ToolIcon size={18} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tool.name}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            (window as any).playFeedbackSound?.('click');
                            toggleFavourite(tool.id, e);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isFav ? 'var(--accent-primary)' : 'var(--text-muted)',
                            opacity: isFav ? 1 : 0.25,
                            transition: 'opacity var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => { if (!isFav) e.currentTarget.style.opacity = '0.25'; }}
                        >
                          <Star size={14} style={{ fill: isFav ? 'var(--accent-primary)' : 'none' }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>
                        {tool.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-2)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>Click to launch</span>
                        <ArrowRight size={10} style={{ color: 'var(--accent-primary)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { history, clipboardPermission, requestPermission, checkClipboardText } = useClipboard();

  // Platform Detection (Mac Command/Option vs Windows Ctrl/Alt)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  const [audioMuted, setAudioMuted] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem('devtools_audio_muted');
      return cached !== null ? cached === 'true' : true;
    }
    return true;
  });

  const [bgTheme, setBgTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('devtools_bg_theme') || 'neon-aurora';
    }
    return 'neon-aurora';
  });

  useEffect(() => {
    localStorage.setItem('devtools_bg_theme', bgTheme);
  }, [bgTheme]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('devtools_audio_muted', audioMuted ? 'true' : 'false');
    }
    audioMutedGlobal = audioMuted;
  }, [audioMuted]);

  // Navigation states
  const [activeToolId, setActiveToolId] = useState('dashboard-hub');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clipboardDrawerOpen, setClipboardDrawerOpen] = useState(false);

  // Favourites state
  const [favourites, setFavourites] = useState<string[]>(() => {
    const cached = localStorage.getItem('devtools_favourites');
    if (cached !== null) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return ensureFeedbackHubAtBottom(parsed);
        }
      } catch {
        // Fallback
      }
    }
    return ['base64-converter', 'uuid-generator', 'comment-stripper', 'xml-formatter', 'password-generator', 'timezone-converter', 'feedback-hub'];
  });

  const toggleFavourite = (toolId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavourites((prev) => {
      const next = toggleFavouriteArray(prev, toolId);
      const cleaned = ensureFeedbackHubAtBottom(next);
      localStorage.setItem('devtools_favourites', JSON.stringify(cleaned));
      return cleaned;
    });
  };

  const moveFavourite = (toolId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).playFeedbackSound?.('click');
    setFavourites((prev) => {
      const next = reorderFavourites(prev, toolId, direction);
      localStorage.setItem('devtools_favourites', JSON.stringify(next));
      return next;
    });
  };

  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return localStorage.getItem('devtools_onboarding_seen') === null;
  });

  // Update checker and changelog states
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [newVersionAvailable, setNewVersionAvailable] = useState<{ version: string; url: string } | null>(null);

  // Opt-in prompt dialog visibility
  const [showOptInPrompt, setShowOptInPrompt] = useState(() => {
    return localStorage.getItem('devtools_clip_opt_in') === null;
  });

  // Search/Command palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Smart recommendation states
  const [smartDetectedTool, setSmartDetectedTool] = useState<ToolEntry | null>(null);
  const [detectedText, setDetectedText] = useState('');

  // High-performance custom cursor follower states
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovering, setCursorHovering] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!showCursor) setShowCursor(true);
    };
    const handleMouseLeaveWindow = () => {
      setShowCursor(false);
    };
    const handleMouseEnterWindow = () => {
      setShowCursor(true);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('glass-button') ||
        target.closest('button') ||
        target.closest('a')
      )) {
        setCursorHovering(true);
      } else {
        setCursorHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [showCursor]);

  // First Start / Upgrade Changelog check
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const onboardingSeen = localStorage.getItem('devtools_onboarding_seen') === 'true';
      const lastInstalledVersion = localStorage.getItem('devtools_version');

      // We only show the changelog to upgrading users (onboarding seen) to avoid double modals
      if (onboardingSeen) {
        if (lastInstalledVersion !== CURRENT_VERSION) {
          // Returning user upgrading to a new version!
          setChangelogOpen(true);
        }
      }
      // Store/update version in localStorage
      localStorage.setItem('devtools_version', CURRENT_VERSION);
    }
  }, []);

  // Background GitHub Release Sync
  useEffect(() => {
    // Only check if system is online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }

    const runUpdateCheck = async () => {
      const schedule = evaluateUpdateCheckSchedule();
      
      // If cached for 12 hours
      if (!schedule.shouldCheck) {
        if (schedule.cachedLatestVersion && schedule.cachedReleaseUrl) {
          if (isNewerVersion(CURRENT_VERSION, schedule.cachedLatestVersion)) {
            setNewVersionAvailable({
              version: schedule.cachedLatestVersion,
              url: schedule.cachedReleaseUrl
            });
          }
        }
        return;
      }

      // Check online repository release
      try {
        const response = await fetch('https://api.github.com/repos/SuhaasNandeesh/devtools/releases/latest');
        if (!response.ok) {
          throw new Error(`GitHub API response error: ${response.status}`);
        }
        const data = await response.json();
        const latestTag = data.tag_name;
        const htmlUrl = data.html_url;

        if (latestTag && htmlUrl) {
          saveUpdateCheckCache(latestTag, htmlUrl);

          if (isNewerVersion(CURRENT_VERSION, latestTag)) {
            setNewVersionAvailable({
              version: latestTag,
              url: htmlUrl
            });
          }
        }
      } catch (err) {
        console.error('Failed to run update check:', err);
      }
    };

    // Delay checking by 3 seconds to ensure instant initial UI mounting
    const timer = setTimeout(runUpdateCheck, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // active tool reference
  const activeTool = TOOLS_CATALOG.find((t) => t.id === activeToolId) || TOOLS_CATALOG[3];

  // Listener for keyboard global shortcuts (Cmd+K for search, Alt+V for clipboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.altKey && e.code === 'KeyV') {
        e.preventDefault();
        setClipboardDrawerOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set focus automatically when command palette opens
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [commandPaletteOpen]);

  // Run the Smart Clipboard Scanner when window focuses
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
    // Run scanner on focus
    window.addEventListener('focus', runSmartClipboardScanner);
    runSmartClipboardScanner(); // initial trigger
    return () => window.removeEventListener('focus', runSmartClipboardScanner);
  }, [clipboardPermission, activeToolId]);

  // Handle opt-in prompt decisions
  const handleOptInPrompt = async (allow: boolean) => {
    if (allow) {
      await requestPermission();
    } else {
      localStorage.setItem('devtools_clip_opt_in', 'denied');
    }
    setShowOptInPrompt(false);
  };

  // Group tools by categories
  const groupedTools = TOOLS_CATALOG.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolEntry[]>);

  // Filter tools for Command Palette search
  const filteredSearchTools = searchQuery
    ? TOOLS_CATALOG.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TOOLS_CATALOG;

  // Insert snippet callback
  const handleInsertSnippetIntoActiveTool = (text: string) => {
    // Dynamically insert snippet using custom events or clipboard copies
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied clip snippet. Paste it into the active input field!');
      setClipboardDrawerOpen(false);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-base)',
        position: 'relative'
      }}
    >
      {/* Dynamic Glowing Background Blob Canvas */}
      {bgTheme !== 'minimalist-slate' && (() => {
        const colors = getBgThemeColors(bgTheme);
        const opacityStyle = theme === 'light' ? 0.22 : 0.28;
        return (
          <>
            <div 
              className="glow-blob" 
              style={{ 
                top: '-10%', 
                left: '-10%', 
                width: '450px', 
                height: '450px', 
                background: colors.color1, 
                opacity: opacityStyle
              }} 
            />
            <div 
              className="glow-blob" 
              style={{ 
                bottom: '-15%', 
                right: '-15%', 
                width: '550px', 
                height: '550px', 
                background: colors.color2, 
                opacity: opacityStyle,
                animationDelay: '-5s'
              }} 
            />
            <div 
              className="glow-blob" 
              style={{ 
                top: '35%', 
                left: '45%', 
                width: '380px', 
                height: '380px', 
                background: colors.color3, 
                opacity: opacityStyle,
                animationDelay: '-12s'
              }} 
            />
          </>
        );
      })()}

      {/* Lag-free Custom Interactive Cursor Follower Halo */}
      {!isTouchDevice && showCursor && (
        <div
          style={{
            position: 'fixed',
            top: mousePos.y,
            left: mousePos.x,
            width: cursorHovering ? '36px' : '18px',
            height: cursorHovering ? '36px' : '18px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            opacity: cursorHovering ? 0.22 : 0.14,
            filter: 'blur(5px)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, background-color 0.3s ease',
            zIndex: 999999
          }}
        />
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <div
        className="glass-panel"
        style={{
          width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          height: '100vh',
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all var(--transition-normal)',
          zIndex: 10
        }}
      >
        {/* Sidebar Brand Logo Header */}
        <div
          className="flex items-center justify-between w-full"
          style={{
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            height: '64px'
          }}
        >
          {!sidebarCollapsed && (
            <div 
              className="flex items-center gap-2 animate-fade"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                (window as any).playFeedbackSound?.('click');
                setActiveToolId('dashboard-hub');
              }}
              title="Go to Dashboard Home"
            >
              <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(45deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DevTools
              </span>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="glass-button glass-button-secondary"
            style={{ padding: 'var(--space-1)', borderRadius: 'var(--radius-full)' }}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Categories / Navigation items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}
        >
          {/* Favourites Section (Dynamic) */}
          {favourites.length > 0 && (
            <div className="flex flex-col gap-1" style={{ marginBottom: 'var(--space-2)' }}>
              {!sidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', paddingLeft: 'var(--space-2)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                  <Star size={10} style={{ fill: 'var(--accent-primary)' }} />
                  <span>Favourites</span>
                </div>
              )}
              {favourites.map((favId) => {
                const tool = TOOLS_CATALOG.find((t) => t.id === favId);
                if (!tool) return null;
                const isActive = tool.id === activeToolId;
                const ToolIcon = getToolIcon(tool.id);
                return (
                  <button
                    key={`fav-${tool.id}`}
                    onClick={() => {
                      (window as any).playFeedbackSound?.('click');
                      setActiveToolId(tool.id);
                    }}
                    className="glass-button w-full"
                    style={{
                      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                      padding: 'var(--space-2) var(--space-3)',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textAlign: 'left'
                    }}
                    title={sidebarCollapsed ? tool.name : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flex: 1, textAlign: 'left' }}>
                      <ToolIcon size={14} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                      {!sidebarCollapsed && <span style={{ fontSize: '0.8rem', fontWeight: 600, wordBreak: 'break-word', whiteSpace: 'normal' }} className="animate-fade">{tool.name}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          marginLeft: 'var(--space-2)',
                          flexShrink: 0
                        }}
                      >
                        {tool.id !== 'feedback-hub' && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button
                              onClick={(e) => moveFavourite(tool.id, 'up', e)}
                              disabled={favourites.indexOf(tool.id) === 0}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '2px',
                                cursor: favourites.indexOf(tool.id) === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: favourites.indexOf(tool.id) === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                opacity: favourites.indexOf(tool.id) === 0 ? 0.3 : 0.7,
                                transition: 'opacity 0.2s, color 0.2s'
                              }}
                              title="Move Up"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              onClick={(e) => moveFavourite(tool.id, 'down', e)}
                              disabled={
                                favourites.indexOf(tool.id) === favourites.length - 1 ||
                                favourites[favourites.indexOf(tool.id) + 1] === 'feedback-hub'
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '2px',
                                cursor: (favourites.indexOf(tool.id) === favourites.length - 1 || favourites[favourites.indexOf(tool.id) + 1] === 'feedback-hub') ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: (favourites.indexOf(tool.id) === favourites.length - 1 || favourites[favourites.indexOf(tool.id) + 1] === 'feedback-hub') ? 'var(--text-muted)' : 'var(--text-secondary)',
                                opacity: (favourites.indexOf(tool.id) === favourites.length - 1 || favourites[favourites.indexOf(tool.id) + 1] === 'feedback-hub') ? 0.3 : 0.7,
                                transition: 'opacity 0.2s, color 0.2s'
                              }}
                              title="Move Down"
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={(e) => toggleFavourite(tool.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-primary)',
                            opacity: 0.9
                          }}
                          title="Remove from Favourites"
                        >
                          <Star size={12} style={{ fill: 'var(--accent-primary)' }} />
                        </button>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: 'var(--space-2)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                  {category}
                </div>
              )}
              {tools.map((tool) => {
                const isActive = tool.id === activeToolId;
                const isFav = favourites.includes(tool.id);
                const ToolIcon = getToolIcon(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      (window as any).playFeedbackSound?.('click');
                      setActiveToolId(tool.id);
                    }}
                    className="glass-button w-full"
                    style={{
                      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                      padding: 'var(--space-2) var(--space-3)',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textAlign: 'left'
                    }}
                    title={sidebarCollapsed ? tool.name : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flex: 1, textAlign: 'left' }}>
                      <ToolIcon size={14} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                      {!sidebarCollapsed && <span style={{ fontSize: '0.8rem', fontWeight: 500, wordBreak: 'break-word', whiteSpace: 'normal' }} className="animate-fade">{tool.name}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <button
                        onClick={(e) => toggleFavourite(tool.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isFav ? 'var(--accent-primary)' : 'var(--text-muted)',
                          opacity: isFav ? 1 : 0.25,
                          transition: 'opacity var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          if (!isFav) e.currentTarget.style.opacity = '0.25';
                        }}
                      >
                        <Star size={12} style={{ fill: isFav ? 'var(--accent-primary)' : 'none' }} />
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Platform Preferences Control (Startup Customizer) */}
          {!sidebarCollapsed && (
            <div 
              className="glass-panel" 
              style={{ 
                margin: 'var(--space-2) var(--space-3)', 
                padding: 'var(--space-3)', 
                background: 'rgba(255,255,255,0.02)',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Theme & Audio Canvas</span>
              </div>
              
              {/* Audio feedback toggle */}
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Audio Feedback</span>
                <button
                  onClick={() => {
                    const nextMuted = !audioMuted;
                    setAudioMuted(nextMuted);
                    // Play dynamic confirmation sound when unmuting!
                    if (!nextMuted) {
                      setTimeout(() => {
                        (window as any).playFeedbackSound?.('success');
                      }, 50);
                    } else {
                      (window as any).playFeedbackSound?.('click');
                    }
                  }}
                  className="glass-button glass-button-secondary"
                  style={{ 
                    padding: '2px 8px', 
                    fontSize: '0.7rem', 
                    borderRadius: 'var(--radius-sm)',
                    borderColor: audioMuted ? 'var(--border-primary)' : 'var(--accent-primary)',
                    background: audioMuted ? 'transparent' : 'var(--accent-glow)',
                    color: audioMuted ? 'var(--text-muted)' : 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={audioMuted ? "Enable sound feedback" : "Mute sounds"}
                >
                  {audioMuted ? "Muted" : "Active"}
                </button>
              </div>

              {/* Canvas Theme Selector */}
              <div className="flex flex-col gap-1">
                <span style={{ color: 'var(--text-secondary)' }}>Background Canvas</span>
                <select
                  value={bgTheme}
                  onChange={(e) => {
                    setBgTheme(e.target.value);
                    setTimeout(() => {
                      (window as any).playFeedbackSound?.('click');
                    }, 20);
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                  }}
                >
                  <option value="neon-aurora">Neon Aurora</option>
                  <option value="cosmic-nebula">Cosmic Nebula</option>
                  <option value="zenith-mint">Zenith Mint</option>
                  <option value="minimalist-slate">Minimalist Slate (Clean)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Global Keyboard Help Footer */}
        {!sidebarCollapsed && (
          <div
            className="flex flex-col font-mono animate-fade"
            style={{
              padding: 'var(--space-3)',
              borderTop: '1px solid var(--border-primary)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              gap: '4px'
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                {isMac ? (
                  <>
                    <Command size={10} />
                    <span>+K Search</span>
                  </>
                ) : (
                  <span>Ctrl+K Search</span>
                )}
              </div>
              <div>{isMac ? '⌥+V Clips' : 'Alt+V Clips'}</div>
            </div>
            <div 
              style={{ 
                fontSize: '0.6rem', 
                color: 'var(--text-muted)', 
                opacity: 0.6,
                textAlign: 'center', 
                marginTop: '2px',
                letterSpacing: '0.05em'
              }}
            >
              DEVTOOLS v{CURRENT_VERSION}
            </div>
          </div>
        )}
      </div>

      {/* 2. MAIN DISPLAY WINDOW (HEADER + WORKSPACE VIEWPORT) */}
      <div
        className="flex flex-col h-full"
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {/* Main Header bar */}
        <header
          className="flex justify-between items-center w-full"
          style={{
            height: '64px',
            padding: '0 var(--space-6)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(var(--glass-blur))'
          }}
        >
          {/* Breadcrumb / Search Launch button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="glass-button glass-button-secondary"
              style={{
                gap: 'var(--space-4)',
                padding: 'var(--space-1) var(--space-4)',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Search tools...</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {isMac ? (
                  <>
                    <Command size={8} />
                    <span>K</span>
                  </>
                ) : (
                  <span>Ctrl+K</span>
                )}
              </div>
            </button>

            <div className="flex items-center gap-2 animate-fade" style={{ marginLeft: 'var(--space-1)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeTool.name}</span>
              <button
                onClick={(e) => toggleFavourite(activeTool.id, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 'var(--space-1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: favourites.includes(activeTool.id) ? 'var(--accent-primary)' : 'var(--text-muted)',
                  transition: 'transform var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title={favourites.includes(activeTool.id) ? 'Remove from Favourites' : 'Add to Favourites'}
              >
                <Star size={14} style={{ fill: favourites.includes(activeTool.id) ? 'var(--accent-primary)' : 'none' }} />
              </button>
            </div>
          </div>

          {/* Quick Header toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOnboardingOpen(true)}
              className="glass-button glass-button-secondary"
              style={{ padding: 'var(--space-2)' }}
              title="Open Welcome Guide & Help Docs"
            >
              <HelpCircle size={14} />
            </button>

            <button
              onClick={() => setClipboardDrawerOpen(true)}
              className="glass-button glass-button-secondary"
              style={{ position: 'relative', padding: 'var(--space-2)' }}
              title="Open Clipboard history (Alt+V)"
            >
              <Clipboard size={14} />
              {history.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    width: '14px',
                    height: '14px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {history.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                const nextMuted = !audioMuted;
                setAudioMuted(nextMuted);
                if (!nextMuted) {
                  setTimeout(() => {
                    (window as any).playFeedbackSound?.('success');
                  }, 50);
                } else {
                  (window as any).playFeedbackSound?.('click');
                }
              }}
              className="glass-button glass-button-secondary"
              style={{ 
                padding: 'var(--space-2)',
                borderColor: audioMuted ? 'var(--border-primary)' : 'var(--accent-primary)',
                color: audioMuted ? 'var(--text-muted)' : 'var(--accent-primary)'
              }}
              title={audioMuted ? "Unmute sound feedback" : "Mute sound feedback"}
            >
              {audioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              onClick={toggleTheme}
              className="glass-button glass-button-secondary"
              style={{ padding: 'var(--space-2)' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* Dynamic Tool Workspace Router Viewport */}
        <main style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {activeToolId === 'dashboard-hub' ? (
            <DashboardHub 
              onSelectTool={setActiveToolId}
              favourites={favourites}
              toggleFavourite={toggleFavourite}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              clipboardScrapsCount={history.length}
            />
          ) : (
            <activeTool.component />
          )}
        </main>
      </div>

      {/* 3. CLIPBOARD PANEL OVERLAY */}
      <ClipboardPanel
        isOpen={clipboardDrawerOpen}
        onClose={() => setClipboardDrawerOpen(false)}
        onInsertSnippet={handleInsertSnippetIntoActiveTool}
      />

      {/* Onboarding Welcome Guide Overlay */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => {
          localStorage.setItem('devtools_onboarding_seen', 'true');
          setOnboardingOpen(false);
        }}
      />

      {/* Changelog Update Modal Overlay */}
      <ChangelogModal
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        version={CURRENT_VERSION}
      />

      {/* Floating Update Notification Toast */}
      {newVersionAvailable && (
        <UpdateNotification
          version={newVersionAvailable.version}
          releaseUrl={newVersionAvailable.url}
          onDismiss={() => setNewVersionAvailable(null)}
        />
      )}

      {/* 4. CMD+K COMMAND PALETTE SEARCH MODAL OVERLAY */}
      {commandPaletteOpen && (
        <div
          onClick={() => setCommandPaletteOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 12, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel animate-scale"
            style={{
              width: '520px',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '420px',
              overflow: 'hidden'
            }}
          >
            {/* Search Input header */}
            <div
              style={{
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}
            >
              <Search size={18} style={{ color: 'var(--accent-primary)' }} />
              <input
                ref={commandInputRef}
                type="text"
                placeholder="Search tools, categories, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  flex: 1
                }}
              />
            </div>

            {/* List search items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-2)' }}>
              {filteredSearchTools.length === 0 ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tools found matching your query.
                </div>
              ) : (
                filteredSearchTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveToolId(tool.id);
                      setCommandPaletteOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="flex flex-col items-start gap-1" style={{ maxWidth: '85%' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tool.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{tool.description}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {tool.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. FIRST-LOAD OPT-IN PROMPT OVERLAY DIALOG */}
      {showOptInPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 12, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            className="glass-panel animate-scale"
            style={{
              width: '420px',
              maxWidth: '90vw',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)'
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={24} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enable Smart Capabilities?</h2>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enable clipboard history indexing and background auto-detect utilities. 
              This allows DevTools to:
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Monitor clipboard text and recommend appropriate formatting tools on focus.</li>
              <li>Maintain a list of the last 30 outputs you generated for fast re-use.</li>
              <li style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100% secure, offline, sandboxed on your machine.</li>
            </ul>

            <div className="flex items-center justify-end gap-3" style={{ marginTop: 'var(--space-2)' }}>
              <button
                onClick={() => handleOptInPrompt(false)}
                className="glass-button glass-button-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                No, Opt-Out
              </button>
              <button
                onClick={() => handleOptInPrompt(true)}
                className="glass-button"
                style={{ fontSize: '0.8rem' }}
              >
                Yes, Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SMART RECOMMENDER SLIDING TOAST */}
      {smartDetectedTool && smartDetectedTool.id !== activeToolId && (
        <div
          className="glass-panel animate-fade"
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: 'var(--space-3) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            border: '1px solid var(--accent-primary)',
            background: 'rgba(15, 20, 35, 0.95)',
            boxShadow: '0 8px 32px 0 hsla(250, 85%, 65%, 0.15)'
          }}
        >
          <Sparkles size={16} className="animate-pulse" style={{ color: 'var(--accent-primary)' }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            Detected matching string format for <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{smartDetectedTool.name}</span> in clipboard!
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveToolId(smartDetectedTool.id);
                setSmartDetectedTool(null);
                
                // Write code trigger: search if there are textareas to auto-inject in 100ms
                setTimeout(() => {
                  const ta = document.querySelector('textarea');
                  if (ta) {
                    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                    nativeTextareaValueSetter?.call(ta, detectedText);
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }, 100);

              }}
              className="glass-button"
              style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', gap: '4px' }}
            >
              <span>Load Tool</span>
              <ArrowRight size={12} />
            </button>
            <button
              onClick={() => setSmartDetectedTool(null)}
              className="glass-button glass-button-secondary"
              style={{ padding: 'var(--space-1)', borderRadius: 'var(--radius-full)' }}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
