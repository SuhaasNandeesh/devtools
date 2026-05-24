import React from 'react';

// Tool Components
import { EpochConverter } from '../tools/converters/EpochConverter';
import { RadixConverter } from '../tools/converters/RadixConverter';
import { Base64Converter } from '../tools/converters/Base64Converter';
import { TimeZoneConverter } from '../tools/converters/TimeZoneConverter';
import { JSONFormatter } from '../tools/formatters/JSONFormatter';
import { XmlFormatter } from '../tools/formatters/XmlFormatter';
import { HtmlFormatter } from '../tools/formatters/HtmlFormatter';
import { CssFormatter } from '../tools/formatters/CssFormatter';
import { SqlFormatter } from '../tools/formatters/SqlFormatter';
import { MarkdownPreviewer } from '../tools/formatters/MarkdownPreviewer';
import { JsMinifier } from '../tools/formatters/JsMinifier';
import { UUIDGenerator } from '../tools/generators/UUIDGenerator';
import { PasswordGenerator } from '../tools/generators/PasswordGenerator';
import { LoremIpsumGenerator } from '../tools/generators/LoremIpsumGenerator';
import { HashGenerator } from '../tools/generators/HashGenerator';
import { HmacGenerator } from '../tools/generators/HmacGenerator';
import { QrCodeGenerator } from '../tools/generators/QrCodeGenerator';
import { BarcodeGenerator } from '../tools/generators/BarcodeGenerator';
import { RsaGenerator } from '../tools/generators/RsaGenerator';
import { FakeDataGenerator } from '../tools/generators/FakeDataGenerator';
import { CronDescriptor } from '../tools/generators/CronDescriptor';
import { RegexTester } from '../tools/text/RegexTester';
import { CaseConverter } from '../tools/text/CaseConverter';
import { TextDiff } from '../tools/text/TextDiff';
import { LineSorter } from '../tools/text/LineSorter';
import { LineSplitter } from '../tools/text/LineSplitter';
import { WordCounter } from '../tools/text/WordCounter';
import { CommentStripper } from '../tools/text/CommentStripper';
import { StringEscaper } from '../tools/text/StringEscaper';
import { FindReplace } from '../tools/text/FindReplace';
import { SlugGenerator } from '../tools/text/SlugGenerator';

// Category E: Network & API Debugging Tools
import { JWTDebugger } from '../tools/network/JWTDebugger';
import { CurlBuilder } from '../tools/network/CurlBuilder';
import { HttpStatusLookup } from '../tools/network/HttpStatusLookup';
import { SubnetCalculator } from '../tools/network/SubnetCalculator';
import { UserAgentInspector } from '../tools/network/UserAgentInspector';
import { LinkExtractor } from '../tools/network/LinkExtractor';
import { MimeLookup } from '../tools/network/MimeLookup';

// Category F: Web Design & CSS Playgrounds
import { CSSShadowBorder } from '../tools/frontend/CSSShadowBorder';
import { CSSLayoutSandbox } from '../tools/frontend/CSSLayoutSandbox';
import { HtmlAccents } from '../tools/frontend/HtmlAccents';
import { KeyboardMonitor } from '../tools/frontend/KeyboardMonitor';
import { AspectRatioCalc } from '../tools/frontend/AspectRatioCalc';
import { SvgOptimizer } from '../tools/frontend/SvgOptimizer';
import { WebFontStacks } from '../tools/frontend/WebFontStacks';
import { GlassmorphismStyler } from '../tools/frontend/GlassmorphismStyler';
import { FeedbackHub } from '../tools/feedback/FeedbackHub';

export interface ToolEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.FC;
}

export const TOOLS_CATALOG: ToolEntry[] = [
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
