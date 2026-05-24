/* 
 * Core Stateless Calculation Engines
 * (Enforces loose boundary layers, pure functions, and high modularity)
 */

// 1. Base64 UTF-8 safe encoding
export const base64Encode = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString);
};

// 2. Base64 UTF-8 safe decoding
export const base64Decode = (encoded: string): string => {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const cleaned = encoded.trim().replace(/\s/g, ''); // strip spacing
  if (!base64Regex.test(cleaned)) {
    throw new Error('Input text contains non-Base64 characters.');
  }
  const binString = atob(cleaned);
  const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// 3. Recursive JSON keys sorting
export const sortJSONKeys = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortJSONKeys);
  
  return Object.keys(obj)
    .sort()
    .reduce((sorted: any, key) => {
      sorted[key] = sortJSONKeys(obj[key]);
      return sorted;
    }, {});
};

// 4. Radix number Base conversion (BigInt secure)
export const convertRadix = (
  sanitizedVal: string,
  sourceRadix: number
): { dec: string; hex: string; bin: string; oct: string } => {
  let valStr = sanitizedVal.trim();
  if (sourceRadix === 16 && valStr.toLowerCase().startsWith('0x')) {
    valStr = valStr.substring(2);
  }
  if (sourceRadix === 2 && valStr.toLowerCase().startsWith('0b')) {
    valStr = valStr.substring(2);
  }

  const validChars: Record<number, RegExp> = {
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
    2: /^[01]+$/,
    8: /^[0-7]+$/
  };

  if (!validChars[sourceRadix].test(valStr)) {
    throw new Error(`Invalid character sequence for Base-${sourceRadix}`);
  }

  const val = BigInt(`0${sourceRadix === 10 ? '' : sourceRadix === 16 ? 'x' : sourceRadix === 2 ? 'b' : 'o'}${valStr}`);
  
  return {
    dec: val.toString(10),
    hex: val.toString(16).toLowerCase(),
    bin: val.toString(2),
    oct: val.toString(8)
  };
};

// 5. Secure UUID v4 (random)
export const generateUUIDv4 = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 6. UUID v1 Time-based mock
export const generateUUIDv1 = (): string => {
  const time = Date.now();
  const timeLow = (time & 0xffffffff).toString(16).padStart(8, '0');
  const timeMid = ((time >> 32) & 0xffff).toString(16).padStart(4, '0');
  const timeHi = (((time >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).substring(0, 4);
  const node = '8f4c3a9d21e0'; 
  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
};

// 7. Custom Hex Pattern Formatter
export const formatHexPattern = (hexStr: string, formatId: string): string => {
  if (formatId === 'no-hyphens') return hexStr;
  
  if (formatId === 'blocks-2') {
    const chunks = hexStr.match(/.{1,2}/g) || [];
    return chunks.join('-');
  }
  if (formatId === 'blocks-3') {
    const chunks = hexStr.match(/.{1,3}/g) || [];
    return chunks.join('-');
  }
  if (formatId === 'blocks-4') {
    const chunks = hexStr.match(/.{1,4}/g) || [];
    return chunks.join('-');
  }

  // Standard UUID format: 8-4-4-4-12
  const padded = hexStr.padStart(32, '0');
  const standard = `${padded.substring(0, 8)}-${padded.substring(8, 12)}-${padded.substring(12, 16)}-${padded.substring(16, 20)}-${padded.substring(20, 32)}`;
  
  if (formatId === 'braced') {
    return `{${standard}}`;
  }
  return standard;
};

// 8. Sequential GUID Range Generator
export const generateSequentialUUIDs = (
  initialGuid: string,
  count: number,
  formatId: string
): string[] => {
  const hexClean = initialGuid.replace(/[^a-fA-F0-9]/g, '');
  if (!hexClean) return [];

  const targetLength = hexClean.length;
  let currentVal = BigInt('0x' + hexClean);
  const list: string[] = [];

  for (let i = 0; i < count; i++) {
    let hexStr = currentVal.toString(16).toLowerCase();
    
    if (hexStr.length > targetLength) {
      hexStr = hexStr.substring(hexStr.length - targetLength);
    } else {
      hexStr = hexStr.padStart(targetLength, '0');
    }

    list.push(formatHexPattern(hexStr, formatId));
    currentVal += 1n;
  }

  return list;
};

// 9. Base64 URL Decode (safe for JWT tokens)
export const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64Decode(base64);
};

// 10. JWT Token stateless decoder
export interface JWTDecoded {
  header: any;
  payload: any;
  signature: string;
  claimsExplanation: { key: string; value: string; dateVal?: string }[];
}

export const parseJWT = (token: string): JWTDecoded => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT must contain exactly three segments separated by dots.');
  }
  
  const headerJson = JSON.parse(base64UrlDecode(parts[0]));
  const payloadJson = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2];
  
  const claimsExplanation: { key: string; value: string; dateVal?: string }[] = [];
  
  const dateFields = ['exp', 'iat', 'nbf', 'auth_time', 'updated_at'];
  Object.entries(payloadJson).forEach(([key, val]) => {
    if (dateFields.includes(key) && typeof val === 'number') {
      const date = new Date(val * 1000);
      claimsExplanation.push({
        key,
        value: val.toString(),
        dateVal: date.toLocaleString()
      });
    }
  });
  
  return {
    header: headerJson,
    payload: payloadJson,
    signature,
    claimsExplanation
  };
};

// 11. IPv4 CIDR Subnet Calculator
export interface SubnetDetails {
  ip: string;
  cidr: number;
  mask: string;
  network: string;
  broadcast: string;
  rangeStart: string;
  rangeEnd: string;
  totalHosts: number;
  wildcard: string;
}

export const calculateSubnet = (ipStr: string, cidr: number): SubnetDetails => {
  const trimmed = ipStr.trim();
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = trimmed.match(ipRegex);
  if (!match) {
    throw new Error('Invalid IPv4 address format. Must be like 192.168.1.1');
  }
  
  const octets = match.slice(1, 5).map(o => parseInt(o, 10));
  if (octets.some(o => o < 0 || o > 255)) {
    throw new Error('IPv4 octets must be integers between 0 and 255.');
  }
  
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR mask must be an integer between 0 and 32.');
  }
  
  const ipNum = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  const maskNum = cidr === 0 ? 0 : (~(2 ** (32 - cidr) - 1)) >>> 0;
  const netNum = (ipNum & maskNum) >>> 0;
  const wildcardNum = (~maskNum) >>> 0;
  const bcastNum = (ipNum | wildcardNum) >>> 0;
  
  const numToIp = (num: number): string => [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.');
  
  let rangeStart = '';
  let rangeEnd = '';
  let totalHosts = 0;
  
  if (cidr === 32) {
    rangeStart = numToIp(ipNum);
    rangeEnd = numToIp(ipNum);
    totalHosts = 1;
  } else if (cidr === 31) {
    rangeStart = numToIp(netNum);
    rangeEnd = numToIp(bcastNum);
    totalHosts = 2;
  } else {
    rangeStart = numToIp(netNum + 1);
    rangeEnd = numToIp(bcastNum - 1);
    totalHosts = 2 ** (32 - cidr) - 2;
  }
  
  return {
    ip: trimmed,
    cidr,
    mask: numToIp(maskNum),
    network: numToIp(netNum),
    broadcast: numToIp(bcastNum),
    rangeStart,
    rangeEnd,
    totalHosts,
    wildcard: numToIp(wildcardNum)
  };
};

// 12. Offline User Agent Inspector
export interface UAParsed {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  engine: string;
  device: string;
}

export const parseUserAgent = (ua: string): UAParsed => {
  let browser = 'Unknown Browser';
  let browserVersion = 'Unknown';
  let os = 'Unknown OS';
  let osVersion = 'Unknown';
  let engine = 'Unknown Engine';
  let device = 'Desktop';
  
  // OS Detection
  if (/windows/i.test(ua)) {
    os = 'Windows';
    const verMatch = ua.match(/Windows NT (\d+\.\d+)/i);
    if (verMatch) {
      const versionMap: Record<string, string> = {
        '10.0': '10 or 11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.1': 'XP'
      };
      osVersion = versionMap[verMatch[1]] || verMatch[1];
    }
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
    const verMatch = ua.match(/Mac OS X (\d+[._]\d+(?:[._]\d+)?)/i);
    if (verMatch) {
      osVersion = verMatch[1].replace(/_/g, '.');
    }
  } else if (/android/i.test(ua)) {
    os = 'Android';
    const verMatch = ua.match(/Android (\d+(?:\.\d+)?)/i);
    if (verMatch) {
      osVersion = verMatch[1];
    }
    device = /mobile/i.test(ua) ? 'Mobile Device' : 'Tablet';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = 'iOS';
    const verMatch = ua.match(/OS (\d+[._]\d+(?:[._]\d+)?)/i);
    if (verMatch) {
      osVersion = verMatch[1].replace(/_/g, '.');
    }
    device = /ipad/i.test(ua) ? 'iPad' : 'iPhone';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }
  
  // Engine Detection
  if (/webkit/i.test(ua)) {
    engine = 'WebKit';
    if (/edge/i.test(ua) || /edg/i.test(ua)) {
      engine = 'Blink';
    } else if (/chrome/i.test(ua)) {
      engine = 'Blink';
    }
  } else if (/gecko/i.test(ua) && !/webkit/i.test(ua)) {
    engine = 'Gecko';
  } else if (/trident/i.test(ua)) {
    engine = 'Trident';
  }
  
  // Browser Detection
  if (/edg/i.test(ua) || /edge/i.test(ua)) {
    browser = 'Microsoft Edge';
    const match = ua.match(/(?:edg|edge)\/(\d+(?:\.\d+)+)/i);
    if (match) browserVersion = match[1];
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Google Chrome';
    const match = ua.match(/(?:chrome|crios)\/(\d+(?:\.\d+)+)/i);
    if (match) browserVersion = match[1];
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Mozilla Firefox';
    const match = ua.match(/(?:firefox|fxios)\/(\d+(?:\.\d+)+)/i);
    if (match) browserVersion = match[1];
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = 'Apple Safari';
    const match = ua.match(/version\/(\d+(?:\.\d+)+)/i);
    if (match) browserVersion = match[1];
  } else if (/msie/i.test(ua) || /rv:/i.test(ua)) {
    browser = 'Internet Explorer';
    const match = ua.match(/(?:msie |rv:)(\d+(?:\.\d+)+)/i);
    if (match) browserVersion = match[1];
  }
  
  return { browser, browserVersion, os, osVersion, engine, device };
};

// 13. HTML Link Scraper
export interface ExtractedLink {
  type: 'anchor' | 'image' | 'script' | 'stylesheet' | 'other';
  url: string;
  text: string;
  tag: string;
}

export const extractHtmlLinks = (html: string): ExtractedLink[] => {
  const links: ExtractedLink[] = [];
  const seenUrls = new Set<string>();
  
  // Match Anchors
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(html)) !== null) {
    const url = match[1].trim();
    const text = match[2].replace(/<[^>]*>/g, '').trim() || '(No Text)';
    const fullTag = match[0].substring(0, 120) + (match[0].length > 120 ? '...' : '');
    if (url && !seenUrls.has(url) && !url.startsWith('#') && !url.startsWith('javascript:')) {
      seenUrls.add(url);
      links.push({ type: 'anchor', url, text, tag: fullTag });
    }
  }
  
  // Match Images
  const imgRegex = /<img\s+[^>]*src=["']([^"']*)["'][^>]*>/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const url = match[1].trim();
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    const text = altMatch ? altMatch[1].trim() : '(Image element)';
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      links.push({ type: 'image', url, text, tag: match[0] });
    }
  }
  
  // Match Scripts
  const scriptRegex = /<script\s+[^>]*src=["']([^"']*)["'][^>]*>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const url = match[1].trim();
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      links.push({ type: 'script', url, text: 'Script Source', tag: match[0] });
    }
  }
  
  // Match Stylesheets
  const linkRegex = /<link\s+[^>]*href=["']([^"']*)["'][^>]*>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1].trim();
    const isStylesheet = /rel=["']stylesheet["']/i.test(match[0]);
    if (url && !seenUrls.has(url) && isStylesheet) {
      seenUrls.add(url);
      links.push({ type: 'stylesheet', url, text: 'Stylesheet Link', tag: match[0] });
    }
  }
  
  return links;
};

// 14. HTML Accents Encoder & Decoder
const HTML_ACCENT_ENTITIES: Record<string, string> = {
  'á': '&aacute;', 'Á': '&Aacute;',
  'é': '&eacute;', 'É': '&Eacute;',
  'í': '&iacute;', 'Í': '&Iacute;',
  'ó': '&oacute;', 'Ó': '&Oacute;',
  'ú': '&uacute;', 'Ú': '&Uacute;',
  'ñ': '&ntilde;', 'Ñ': '&Ntilde;',
  'ü': '&uuml;', 'Ü': '&Uuml;',
  'ç': '&ccedil;', 'Ç': '&Ccedil;',
  'ß': '&szlig;',
  'à': '&agrave;', 'À': '&Agrave;',
  'è': '&egrave;', 'È': '&Egrave;',
  'ì': '&igrave;', 'Ì': '&Igrave;',
  'ò': '&ograve;', 'Ò': '&Ograve;',
  'ù': '&ugrave;', 'Ù': '&Ugrave;',
  'â': '&acirc;', 'Â': '&Acirc;',
  'ê': '&ecirc;', 'Ê': '&Ecirc;',
  'î': '&icirc;', 'Î': '&Icirc;',
  'ô': '&ocirc;', 'Ô': '&Ocirc;',
  'û': '&ucirc;', 'Û': '&Ucirc;',
  'ä': '&auml;', 'Ä': '&Auml;',
  'ë': '&euml;', 'Ë': '&Euml;',
  'ï': '&iuml;', 'Ï': '&Iuml;',
  'ö': '&ouml;', 'Ö': '&Ouml;',
  'ÿ': '&yuml;', 'Ÿ': '&Yuml;',
  'æ': '&aelig;', 'Æ': '&AElig;',
  'œ': '&oelig;', 'Œ': '&OElig;',
  'å': '&aring;', 'Å': '&Aring;',
  'ø': '&oslash;', 'Ø': '&Oslash;'
};

export const encodeHtmlAccents = (str: string): string => {
  let res = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (HTML_ACCENT_ENTITIES[char]) {
      res += HTML_ACCENT_ENTITIES[char];
    } else if (char === '&') {
      res += '&amp;';
    } else if (char === '<') {
      res += '&lt;';
    } else if (char === '>') {
      res += '&gt;';
    } else if (char === '"') {
      res += '&quot;';
    } else if (char === "'") {
      res += '&apos;';
    } else {
      res += char;
    }
  }
  return res;
};

export const decodeHtmlAccents = (str: string): string => {
  let res = str;
  Object.entries(HTML_ACCENT_ENTITIES).forEach(([char, entity]) => {
    res = res.replaceAll(entity, char);
  });
  
  res = res
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
    
  res = res.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
  res = res.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return res;
};

// 15. Aspect Ratio Fraction Solver
export interface AspectRatioDetails {
  ratio: string;
  widthFactor: number;
  heightFactor: number;
  decimal: number;
}

export const calculateAspectRatioFraction = (width: number, height: number): AspectRatioDetails => {
  if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
    throw new Error('Width and Height must be positive integers.');
  }
  
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const divisor = gcd(Math.floor(width), Math.floor(height));
  const wFactor = Math.floor(width) / divisor;
  const hFactor = Math.floor(height) / divisor;
  
  return {
    ratio: `${wFactor}:${hFactor}`,
    widthFactor: wFactor,
    heightFactor: hFactor,
    decimal: Number((width / height).toFixed(4))
  };
};

// 16. SVG Minifier
export const minifySVG = (svgText: string): string => {
  if (!svgText.trim()) return '';
  
  let minified = svgText.trim();
  
  // Remove XML declaration
  minified = minified.replace(/<\?xml\s+[^>]*\?>/gi, '');
  
  // Remove DOCTYPE declaration
  minified = minified.replace(/<!DOCTYPE\s+[^>]*>/gi, '');
  
  // Remove comments
  minified = minified.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove namespaces and metadata (editor-specific tags)
  minified = minified.replace(/xmlns:odm=["'][^"']*["']/gi, '');
  minified = minified.replace(/xmlns:sketch=["'][^"']*["']/gi, '');
  minified = minified.replace(/xmlns:inkscape=["'][^"']*["']/gi, '');
  minified = minified.replace(/xmlns:sodipodi=["'][^"']*["']/gi, '');
  minified = minified.replace(/sketch:type=["'][^"']*["']/gi, '');
  minified = minified.replace(/inkscape:[a-z]+=["'][^"']*["']/gi, '');
  minified = minified.replace(/sodipodi:[a-z]+=["'][^"']*["']/gi, '');
  
  // Collapse whitespace
  minified = minified.replace(/\s+/g, ' ');
  
  // Remove spacing around XML markers
  minified = minified.replace(/>\s+</g, '><');
  minified = minified.replace(/\s*([<>={}/,])\s*/g, '$1');
  
  return minified.trim();
};

// 17. JSON to YAML & YAML to JSON
export const jsonToYaml = (obj: any, indent = 0): string => {
  if (obj === null) return 'null';
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
    return String(obj);
  }
  
  const spacing = ' '.repeat(indent);
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => `${spacing}- ${jsonToYaml(item, indent + 2).trim()}`).join('\n');
  }
  
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  
  return keys.map(key => {
    const val = obj[key];
    const formattedKey = /^[a-zA-Z0-9_-]+$/.test(key) ? key : `"${key.replace(/"/g, '\\"')}"`;
    if (typeof val === 'object' && val !== null) {
      return `${spacing}${formattedKey}:\n${jsonToYaml(val, indent + 2)}`;
    }
    return `${spacing}${formattedKey}: ${jsonToYaml(val, 0)}`;
  }).join('\n');
};

export const yamlToJson = (yamlStr: string): any => {
  const lines = yamlStr.split('\n');
  
  const parseYamlValue = (val: string): any => {
    const v = val.trim();
    if (v === 'null') return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (/^["'][\s\S]*["']$/.test(v)) return v.substring(1, v.length - 1);
    return v;
  };

  const parseYamlLines = (startIdx: number, targetIndent: number): { result: any, endIdx: number } => {
    let result: any = null;
    let i = startIdx;
    
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#')) {
        i++;
        continue;
      }
      
      const indent = line.length - line.trimStart().length;
      if (indent < targetIndent) {
        break;
      }
      
      if (trimmed.startsWith('-')) {
        if (result === null) result = [];
        const itemContent = trimmed.substring(1).trim();
        if (itemContent) {
          result.push(parseYamlValue(itemContent));
          i++;
        } else {
          const nested = parseYamlLines(i + 1, indent + 2);
          result.push(nested.result);
          i = nested.endIdx;
        }
        continue;
      }
      
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        if (result === null) result = {};
        const key = trimmed.substring(0, colonIdx).trim().replace(/^["']|["']$/g, '');
        const valStr = trimmed.substring(colonIdx + 1).trim();
        
        if (valStr) {
          result[key] = parseYamlValue(valStr);
          i++;
        } else {
          const nested = parseYamlLines(i + 1, indent + 2);
          result[key] = nested.result;
          i = nested.endIdx;
        }
        continue;
      }
      
      i++;
    }
    
    return { result, endIdx: i };
  };

  return parseYamlLines(0, 0).result || {};
};

// 18. JSON to XML & XML to JSON
export const jsonToXml = (obj: any, rootName = 'root', indent = 0): string => {
  const spacing = ' '.repeat(indent);
  if (obj === null) return `${spacing}<${rootName} />`;
  if (typeof obj !== 'object') {
    return `${spacing}<${rootName}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${rootName}>`;
  }
  
  let xml = `${spacing}<${rootName}>\n`;
  if (Array.isArray(obj)) {
    xml = obj.map(item => jsonToXml(item, 'item', indent + 2)).join('\n') + '\n';
    return xml + `${spacing}</${rootName}>`;
  }
  
  Object.entries(obj).forEach(([key, val]) => {
    const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    xml += jsonToXml(val, cleanKey, indent + 2) + '\n';
  });
  
  return xml + `${spacing}</${rootName}>`;
};

export const xmlToJson = (xmlStr: string): any => {
  const cleaned = xmlStr.trim();
  if (!cleaned) return {};
  
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new window.DOMParser();
      const xmlDoc = parser.parseFromString(cleaned, 'text/xml');
      
      const nodeToJson = (node: Node): any => {
        if (node.nodeType === 3) {
          const txt = node.nodeValue?.trim();
          if (!txt) return null;
          if (txt === 'true') return true;
          if (txt === 'false') return false;
          if (/^-?\d+(\.\d+)?$/.test(txt)) return Number(txt);
          return txt;
        }
        
        if (node.nodeType === 1) {
          const el = node as Element;
          if (el.childNodes.length === 0) return null;
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            return nodeToJson(el.childNodes[0]);
          }
          
          const obj: any = {};
          for (let i = 0; i < el.childNodes.length; i++) {
            const child = el.childNodes[i];
            if (child.nodeType === 1) {
              const name = child.nodeName;
              const childVal = nodeToJson(child);
              if (obj[name] !== undefined) {
                if (!Array.isArray(obj[name])) {
                  obj[name] = [obj[name]];
                }
                obj[name].push(childVal);
              } else {
                obj[name] = childVal;
              }
            }
          }
          return obj;
        }
        return null;
      };
      
      const rootNode = xmlDoc.documentElement;
      const res: any = {};
      res[rootNode.nodeName] = nodeToJson(rootNode);
      return res;
    } catch {
      // Fallback
    }
  }
  
  return { error: 'DOMParser unavailable offline.' };
};

// 19. JSON <=> CSV Converter
export const jsonToCsv = (jsonArray: any[]): string => {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  
  const headers = Array.from(
    new Set(jsonArray.flatMap(item => (typeof item === 'object' && item !== null) ? Object.keys(item) : []))
  );
  
  if (headers.length === 0) return '';
  
  const escapeCsvValue = (val: any) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  const headerRow = headers.map(escapeCsvValue).join(',');
  const dataRows = jsonArray.map(item => {
    return headers.map(h => escapeCsvValue(item[h])).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

export const csvToJson = (csvStr: string): any[] => {
  const trimmed = csvStr.trim();
  if (!trimmed) return [];
  
  const lines: string[] = [];
  let currentLine = '';
  let insideQuote = false;
  
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if (char === '\n' && !insideQuote) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  if (lines.length < 2) return [];
  
  const parseCsvRow = (rowStr: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let insideQ = false;
    
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (insideQ && rowStr[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          insideQ = !insideQ;
        }
      } else if (char === ',' && !insideQ) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    cells.push(cell.trim());
    return cells;
  };
  
  const headers = parseCsvRow(lines[0]).map(h => h.replace(/^["']|["']$/g, ''));
  const list: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]);
    const obj: any = {};
    headers.forEach((h, idx) => {
      const rawVal = cells[idx] || '';
      if (rawVal === 'true') obj[h] = true;
      else if (rawVal === 'false') obj[h] = false;
      else if (rawVal === 'null') obj[h] = null;
      else if (/^-?\d+(\.\d+)?$/.test(rawVal)) obj[h] = Number(rawVal);
      else obj[h] = rawVal;
    });
    list.push(obj);
  }
  
  return list;
};

// 20. CSV to SQL script builder
export const csvToSqlInsert = (csvStr: string, tableName = 'my_table'): string => {
  const parsed = csvToJson(csvStr);
  if (parsed.length === 0) return '';
  
  const headers = Object.keys(parsed[0]);
  const colsList = headers.map(h => `\`${h.replace(/`/g, '``')}\``).join(', ');
  
  const sqlRows = parsed.map(row => {
    const valsList = headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val.toString();
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      return `'${String(val).replace(/'/g, "''")}'`;
    }).join(', ');
    
    return `INSERT INTO \`${tableName.replace(/`/g, '``')}\` (${colsList}) VALUES (${valsList});`;
  });
  
  return sqlRows.join('\n');
};

// 21. Color Space conversions
export interface RgbColor { r: number; g: number; b: number }
export interface HslColor { h: number; s: number; l: number }
export interface CmykColor { c: number; m: number; y: number; k: number }

export const hexToRgb = (hex: string): RgbColor => {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) {
    throw new Error('Invalid HEX color code format.');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) throw new Error('Invalid hexadecimal notation.');
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.floor(val)));
  const rh = clamp(r).toString(16).padStart(2, '0');
  const gh = clamp(g).toString(16).padStart(2, '0');
  const bh = clamp(b).toString(16).padStart(2, '0');
  return `#${rh}${gh}${bh}`.toLowerCase();
};

export const rgbToHsl = (r: number, g: number, b: number): HslColor => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export const hslToRgb = (h: number, s: number, l: number): RgbColor => {
  h /= 360; s /= 100; l /= 100;
  let r = l, g = l, b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

export const rgbToCmyk = (r: number, g: number, b: number): CmykColor => {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

export const cmykToRgb = (c: number, m: number, y: number, k: number): RgbColor => {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return { r, g, b };
};

// 22. XML Formatter & Minifier
export const formatXml = (xml: string, minify: boolean, indentSize = 2): string => {
  const clean = xml.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
  if (minify) return clean;

  const regex = /(<[^>]+>)/g;
  const tokens = clean.split(regex).filter(t => t.trim() !== '');
  let formatted = '';
  let indent = 0;
  const tab = ' '.repeat(indentSize);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<') && token.endsWith('/>')) {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<?') || token.startsWith('<!')) {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<')) {
      const tagContent = token.slice(1, -1).trim();
      const tagName = tagContent.split(/\s+/)[0];
      const nextToken = tokens[i + 1];
      const nextNextToken = tokens[i + 2];
      const isInline = nextToken && !nextToken.startsWith('<') && nextNextToken === `</${tagName}>`;

      if (isInline) {
        formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token + nextToken + nextNextToken;
        i += 2;
      } else {
        formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
        indent++;
      }
    } else {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    }
  }

  return formatted;
};

// 23. HTML Formatter & Minifier
const HTML_VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export const formatHtml = (html: string, minify: boolean, indentSize = 2): string => {
  const clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
  if (minify) return clean;

  const regex = /(<[^>]+>)/g;
  const tokens = clean.split(regex).filter(t => t.trim() !== '');
  let formatted = '';
  let indent = 0;
  const tab = ' '.repeat(indentSize);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<') && token.endsWith('/>')) {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<?') || token.startsWith('<!')) {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<')) {
      const tagContent = token.slice(1, -1).trim();
      const tagName = tagContent.split(/\s+/)[0].toLowerCase();
      const nextToken = tokens[i + 1];
      const nextNextToken = tokens[i + 2];
      const isInline = nextToken && !nextToken.startsWith('<') && nextNextToken === `</${tagName}>`;

      if (HTML_VOID_ELEMENTS.has(tagName)) {
        formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
      } else if (isInline) {
        formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token + nextToken + nextNextToken;
        i += 2;
      } else {
        formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
        indent++;
      }
    } else {
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    }
  }

  return formatted;
};

// 24. CSS Beautifier & Minifier
export const formatCss = (css: string, minify: boolean): string => {
  const cleanComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const cleanSpaces = cleanComments.replace(/\s+/g, ' ').trim();
  
  if (minify) {
    return cleanSpaces
      .replace(/\s*([{\}:;,])\s*/g, '$1')
      .replace(/;}/g, '}');
  }

  let formatted = '';
  let indent = 0;
  const tab = '  ';
  let i = 0;

  while (i < cleanSpaces.length) {
    const char = cleanSpaces[i];
    if (char === '{') {
      formatted = formatted.trimEnd();
      formatted += ' {\n';
      indent++;
      formatted += tab.repeat(indent);
    } else if (char === '}') {
      indent = Math.max(0, indent - 1);
      formatted = formatted.trimEnd();
      if (formatted.endsWith(';')) {
        // clean up
      }
      formatted += '\n' + tab.repeat(indent) + '}\n\n';
      formatted += tab.repeat(indent);
    } else if (char === ';') {
      formatted += ';\n' + tab.repeat(indent);
    } else if (char === ':') {
      formatted += ': ';
    } else if (char === ',') {
      formatted += ', ';
    } else {
      if (char === ' ' && (formatted.endsWith(' ') || formatted.endsWith('\n') || formatted.endsWith('\t'))) {
        // skip
      } else {
        formatted += char;
      }
    }
    i++;
  }

  return formatted.trim().replace(/\n\s*\n+/g, '\n\n');
};

// 25. SQL Query Beautifier
export const formatSql = (sql: string): string => {
  let i = 0;
  let result = '';
  let word = '';
  
  const isAlpha = (c: string) => /[a-zA-Z_]/.test(c);
  const isAlphaNum = (c: string) => /[a-zA-Z0-9_]/.test(c);
  
  const uppercaseKeywords = new Set([
    'select', 'from', 'where', 'and', 'or', 'insert', 'into', 'values',
    'update', 'set', 'delete', 'join', 'left', 'right', 'inner', 'outer',
    'on', 'group', 'by', 'order', 'having', 'limit', 'as', 'union', 'all',
    'create', 'table', 'drop', 'index', 'in', 'is', 'null', 'not', 'exists',
    'between', 'like'
  ]);

  const newlineBeforeKeywords = new Set([
    'FROM', 'WHERE', 'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'JOIN',
    'LEFT', 'RIGHT', 'INNER', 'INSERT', 'UPDATE', 'DELETE', 'UNION',
    'VALUES', 'SET'
  ]);
  
  while (i < sql.length) {
    const c = sql[i];
    
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      result += quote;
      i++;
      while (i < sql.length && sql[i] !== quote) {
        if (sql[i] === '\\') {
          result += '\\' + (sql[i+1] || '');
          i += 2;
        } else {
          result += sql[i];
          i++;
        }
      }
      if (i < sql.length) {
        result += quote;
        i++;
      }
      continue;
    }
    
    if (isAlpha(c)) {
      word = '';
      while (i < sql.length && isAlphaNum(sql[i])) {
        word += sql[i];
        i++;
      }
      
      const upperWord = word.toUpperCase();
      if (uppercaseKeywords.has(word.toLowerCase())) {
        if (newlineBeforeKeywords.has(upperWord) && result.trim() !== '') {
          result = result.trimEnd();
          result += '\n' + upperWord;
        } else {
          result += upperWord;
        }
      } else {
        result += word;
      }
      continue;
    }
    
    if (c === ',') {
      result += ', ';
      i++;
    } else if (c === '\n' || c === '\r') {
      if (!result.endsWith('\n')) {
        result += '\n';
      }
      i++;
    } else {
      result += c;
      i++;
    }
  }
  
  return result
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line !== '')
    .join('\n');
};

// 26. Markdown to HTML Converter
export const markdownToHtml = (md: string): string => {
  const lines = md.split('\n');
  let result = '';
  let inList = false;
  let inCode = false;
  let codeBlockContent = '';
  let codeBlockLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCode) {
        inCode = false;
        const escaped = codeBlockContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        result += `<pre><code class="language-${codeBlockLang || 'text'}">${escaped}</code></pre>\n`;
        codeBlockContent = '';
      } else {
        inCode = true;
        codeBlockLang = trimmed.substring(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeBlockContent += line + '\n';
      continue;
    }

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      if (inList) { result += '</ul>\n'; inList = false; }
      result += '<hr />\n';
      continue;
    }

    if (trimmed.startsWith('#')) {
      if (inList) { result += '</ul>\n'; inList = false; }
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = parseInlineMarkdown(match[2]);
        result += `<h${level}>${text}</h${level}>\n`;
        continue;
      }
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        result += '<ul>\n';
        inList = true;
      }
      const text = parseInlineMarkdown(trimmed.substring(2));
      result += `  <li>${text}</li>\n`;
      continue;
    }

    if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      result += '</ul>\n';
      inList = false;
    }

    if (trimmed.startsWith('> ')) {
      const text = parseInlineMarkdown(trimmed.substring(2));
      result += `<blockquote>${text}</blockquote>\n`;
      continue;
    }

    if (!trimmed) {
      continue;
    }

    const text = parseInlineMarkdown(line);
    result += `<p>${text}</p>\n`;
  }

  if (inList) {
    result += '</ul>\n';
  }

  return result.trim();
};

const parseInlineMarkdown = (text: string): string => {
  let res = text;
  res = res.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  res = res.replace(/_([^_]+)_/g, '<em>$1</em>');
  res = res.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return res;
};

// 27. JS/TS Minifier
export const minifyJsTs = (code: string): string => {
  let i = 0;
  let result = '';
  let lastChar = '';
  
  while (i < code.length) {
    const c = code[i];
    const next = code[i + 1] || '';
    
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      result += quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          result += '\\' + (code[i+1] || '');
          i += 2;
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < code.length) {
        result += quote;
        i++;
      }
      lastChar = quote;
      continue;
    }
    
    if (c === '/' && next === '/') {
      i += 2;
      while (i < code.length && code[i] !== '\n') {
        i++;
      }
      continue;
    }
    
    if (c === '/' && next === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && (code[i+1] || '') === '/')) {
        i++;
      }
      i += 2;
      continue;
    }
    
    if (/\s/.test(c)) {
      const lastIsAlpha = /[a-zA-Z0-9_$]/.test(lastChar);
      let temp = i + 1;
      while (temp < code.length && /\s/.test(code[temp])) {
        temp++;
      }
      const nextChar = code[temp] || '';
      const nextIsAlpha = /[a-zA-Z0-9_$]/.test(nextChar);
      
      if (lastIsAlpha && nextIsAlpha) {
        result += ' ';
        lastChar = ' ';
      }
      i = temp;
      continue;
    }
    
    result += c;
    lastChar = c;
    i++;
  }
  
  return result.trim();
};

// 28. Strong Password Generator
export const generatePassword = (
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean; excludeSimilar: boolean }
): string => {
  let charset = '';
  const similar = /[il1Lo0O!\|]/g;
  
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (options.excludeSimilar) {
    charset = charset.replace(similar, '');
  }
  
  if (!charset) return '';
  
  let password = '';
  const array = new Uint32Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 10000000);
    }
  }
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
};

// 29. Lorem Ipsum Generator
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum'
];

export const generateLoremIpsum = (
  count: number,
  unit: 'words' | 'sentences' | 'paragraphs'
): string => {
  const getWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  
  const getSentence = () => {
    const len = 5 + Math.floor(Math.random() * 10);
    const words = [];
    for (let i = 0; i < len; i++) words.push(getWord());
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };
  
  const getParagraph = () => {
    const len = 3 + Math.floor(Math.random() * 4);
    const sentences = [];
    for (let i = 0; i < len; i++) sentences.push(getSentence());
    return sentences.join(' ');
  };
  
  if (unit === 'words') {
    const words = [];
    for (let i = 0; i < count; i++) words.push(getWord());
    return words.join(' ');
  }
  
  if (unit === 'sentences') {
    const sentences = [];
    for (let i = 0; i < count; i++) sentences.push(getSentence());
    return sentences.join(' ');
  }
  
  const paragraphs = [];
  for (let i = 0; i < count; i++) paragraphs.push(getParagraph());
  return paragraphs.join('\n\n');
};

// 30. Hash Digest Generator (pure MD5 + Web Crypto SHA)
export const md5 = (string: string): string => {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWordsTemp1 = lMessageLength + 8;
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords).fill(0);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue: number) {
    let wordToHexValue = '', wordToHexValueTemp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substring(wordToHexValueTemp.length - 2);
    }
    return wordToHexValue;
  }
  
  string = unescape(encodeURIComponent(string));
  const x = convertToWordArray(string);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;
  
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  
  for (let k = 0; k < x.length; k += 16) {
    const AA = a; const BB = b; const CC = c; const DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    
    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }
  
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
};

export const calculateHash = async (text: string, algorithm: 'MD5' | 'SHA-256' | 'SHA-512'): Promise<string> => {
  if (algorithm === 'MD5') {
    return md5(text);
  }
  
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 31. HMAC Generator
export const calculateHmac = async (text: string, secret: string): Promise<string> => {
  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(text)
  );
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 32. QR Code Generator (zero-dependency SVG matrix encoder)
export const generateQrCodeSvg = (text: string, size = 256, color = '#000000'): string => {
  const dimension = 29;
  const matrix: boolean[][] = Array(dimension).fill(null).map(() => Array(dimension).fill(false));
  const reserved: boolean[][] = Array(dimension).fill(null).map(() => Array(dimension).fill(false));

  const drawFinder = (x: number, y: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const pr = r + y;
        const pc = c + x;
        if (pr >= 0 && pr < dimension && pc >= 0 && pc < dimension) {
          const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          matrix[pr][pc] = isBlack;
          reserved[pr][pc] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(dimension - 7, 0);
  drawFinder(0, dimension - 7);

  for (let i = 8; i < dimension - 8; i++) {
    const isBlack = i % 2 === 0;
    matrix[6][i] = isBlack;
    matrix[i][6] = isBlack;
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  const drawAlignment = (cx: number, cy: number) => {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const pr = r + cy;
        const pc = c + cx;
        if (!reserved[pr][pc]) {
          const isBlack = (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0));
          matrix[pr][pc] = isBlack;
          reserved[pr][pc] = true;
        }
      }
    }
  };
  drawAlignment(22, 22);

  for (let i = 0; i < 9; i++) {
    reserved[i][8] = true;
    reserved[8][i] = true;
  }
  for (let i = dimension - 8; i < dimension; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }

  const maxBytes = 44;
  const cleanText = text.substring(0, maxBytes);
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let b = len - 1; b >= 0; b--) {
      bits.push((val >> b) & 1);
    }
  };
  
  pushBits(4, 4);
  pushBits(cleanText.length, 8);
  for (let i = 0; i < cleanText.length; i++) {
    pushBits(cleanText.charCodeAt(i), 8);
  }
  
  pushBits(0, Math.min(4, 44 * 8 - bits.length));
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }
  
  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i + b];
    }
    dataBytes.push(byte);
  }
  
  let padToggle = true;
  while (dataBytes.length < maxBytes) {
    dataBytes.push(padToggle ? 236 : 17);
    padToggle = !padToggle;
  }

  const GF256_EXP: number[] = new Array(256);
  const GF256_LOG: number[] = new Array(256);
  let xVal = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = xVal;
    GF256_LOG[xVal] = i;
    xVal = (xVal << 1) ^ (xVal >= 128 ? 0x11d : 0);
  }
  GF256_EXP[255] = 1;
  GF256_LOG[0] = 0;

  const rsGeneratorPolynomial = (degree: number): number[] => {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= GF256_EXP[(GF256_LOG[poly[j]] + i) % 255];
        next[j + 1] ^= poly[j];
      }
      poly = next;
    }
    return poly.map(v => GF256_LOG[v]);
  };

  const rsEncode = (rawBytes: number[], ecCount: number): number[] => {
    const gen = rsGeneratorPolynomial(ecCount);
    const msgPoly = [...rawBytes, ...new Array(ecCount).fill(0)];
    for (let i = 0; i < rawBytes.length; i++) {
      const coef = msgPoly[i];
      if (coef !== 0) {
        const logCoef = GF256_LOG[coef];
        for (let j = 0; j < gen.length; j++) {
          msgPoly[i + j] ^= GF256_EXP[(gen[j] + logCoef) % 255];
        }
      }
    }
    return msgPoly.slice(rawBytes.length);
  };

  const ecBytes = rsEncode(dataBytes, 26);
  const finalBytes = [...dataBytes, ...ecBytes];

  const finalBits: number[] = [];
  for (const byte of finalBytes) {
    for (let b = 7; b >= 0; b--) {
      finalBits.push((byte >> b) & 1);
    }
  }

  let bitIdx = 0;
  let dir = -1;
  let col = dimension - 1;
  while (col > 0) {
    if (col === 6) col--;
    const range = dir === -1 ? [dimension - 1, -1, -1] : [0, dimension, 1];
    const start = range[0];
    const end = range[1];
    const step = range[2];
    
    for (let r = start; r !== end; r += step) {
      for (let c = 0; c < 2; c++) {
        const pc = col - c;
        if (!reserved[r][pc]) {
          let bit = 0;
          if (bitIdx < finalBits.length) {
            bit = finalBits[bitIdx++];
          }
          const mask = (r + pc) % 2 === 0;
          matrix[r][pc] = (bit === 1) !== mask;
        }
      }
    }
    dir = -dir;
    col -= 2;
  }

  const formatInfo = 0x3a4b;
  for (let i = 0; i < 15; i++) {
    const bit = ((formatInfo >> i) & 1) === 1;
    if (i < 6) matrix[8][i] = bit;
    else if (i < 8) matrix[8][i + 1] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else if (i === 9) matrix[8][dimension - 7] = bit;
    else matrix[8][dimension - 15 + i] = bit;
    
    if (i < 8) matrix[dimension - 1 - i][8] = bit;
    else matrix[14 - i][8] = bit;
  }

  const cellSize = size / dimension;
  let pathData = '';
  for (let r = 0; r < dimension; r++) {
    for (let c = 0; c < dimension; c++) {
      if (matrix[r][c]) {
        pathData += `M${c * cellSize},${r * cellSize}h${cellSize}v${cellSize}h-${cellSize}z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#ffffff" />
    <path d="${pathData.trim()}" fill="${color}" />
  </svg>`;
};

// 33. Barcode Generator (Code 128 B SVG parser)
export const generateBarcode128Svg = (text: string, width = 300, height = 80): string => {
  const CODE128_WIDTHS = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112",
    "134111", "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211",
    "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311",
    "113141", "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
  ];

  if (!text) return '';
  
  let checksum = 104;
  const indices: number[] = [104];
  
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    let idx = 0;
    if (code >= 32 && code <= 126) {
      idx = code - 32;
    } else {
      idx = 0;
    }
    indices.push(idx);
    checksum += idx * (i + 1);
  }
  
  const checkIdx = checksum % 103;
  indices.push(checkIdx);
  indices.push(106);
  
  let patternString = '';
  for (const idx of indices) {
    const widthStr = CODE128_WIDTHS[idx];
    for (let j = 0; j < widthStr.length; j++) {
      const w = parseInt(widthStr[j], 10);
      const isBar = j % 2 === 0;
      patternString += (isBar ? '1' : '0').repeat(w);
    }
  }
  
  const totalUnits = patternString.length;
  const barWidth = width / totalUnits;
  let pathData = '';
  
  for (let i = 0; i < patternString.length; i++) {
    if (patternString[i] === '1') {
      pathData += `M${i * barWidth},0h${barWidth}v${height}h-${barWidth}z `;
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height + 20}" width="${width}" height="${height + 20}">
    <rect width="${width}" height="${height + 20}" fill="#ffffff" />
    <path d="${pathData.trim()}" fill="#000000" />
    <text x="${width / 2}" y="${height + 15}" font-family="monospace" font-size="12" fill="#000000" text-anchor="middle">${text}</text>
  </svg>`;
};

// 34. RSA Key Pair Generator
export const generateRsaKeyPair = async (): Promise<{ publicPem: string; privatePem: string }> => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["sign", "verify"]
  );
  
  const exportPem = (buffer: ArrayBuffer, type: 'public' | 'private'): string => {
    const binStr = Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join('');
    const base64 = btoa(binStr);
    const formatted = base64.match(/.{1,64}/g)?.join('\n') || base64;
    const header = type === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY';
    return `-----BEGIN ${header}-----\n${formatted}\n-----END ${header}-----`;
  };
  
  const pubBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
  return {
    publicPem: exportPem(pubBuffer, "public"),
    privatePem: exportPem(privBuffer, "private")
  };
};

// 35. Fake Test Data Generator
export const generateFakeData = (count: number, seed = 12345): any[] => {
  let s = seed;
  const nextRandom = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Indianapolis', 'Columbus', 'Fort Worth'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'CA', 'IN', 'OH', 'TX'];
  const companies = ['DevSuite Corp', 'Alpha Tech', 'Omega Solutions', 'Quantum Labs', 'Beta Systems', 'Nova Consulting', 'Vertex Logistics', 'Apex Media', 'Summit Energy', 'Prime Capital'];
  
  const pickRandom = (arr: any[]) => arr[Math.floor(nextRandom() * arr.length)];
  
  const list = [];
  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const first = pickRandom(firstNames);
    const last = pickRandom(lastNames);
    const company = pickRandom(companies);
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`;
    const cityIdx = Math.floor(nextRandom() * cities.length);
    const city = cities[cityIdx];
    const state = states[cityIdx];
    
    let cc = '';
    for (let c = 0; c < 16; c++) {
      cc += Math.floor(nextRandom() * 10).toString();
    }
    const ccFormatted = cc.match(/.{1,4}/g)?.join('-') || cc;
    const phone = `+1 (${Math.floor(nextRandom() * 900) + 100}) 555-${String(Math.floor(nextRandom() * 9000) + 1000).padStart(4, '0')}`;
    
    list.push({
      id,
      name: `${first} ${last}`,
      email,
      phone,
      company,
      address: `${Math.floor(nextRandom() * 9000) + 100} Main St, ${city}, ${state}`,
      creditCard: ccFormatted
    });
  }
  return list;
};

// 36. Cron Scheduler Descriptor
export const describeCron = (expression: string): string => {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Cron expression must contain exactly 5 space-separated fields.');
  }
  
  const [min, hour, dayOfMonth, month, dayOfWeek] = parts;
  
  const describeField = (field: string, name: string, pluralName: string, mapping?: Record<string, string>): string => {
    if (field === '*') return `every ${name}`;
    if (field.startsWith('*/')) {
      const step = parseInt(field.substring(2), 10);
      return `every ${step} ${pluralName}`;
    }
    if (field.includes(',')) {
      const list = field.split(',').map(v => mapping ? (mapping[v] || v) : v);
      return `${list.join(' and ')}`;
    }
    return `${mapping ? (mapping[field] || field) : field}`;
  };
  
  const weekdays: Record<string, string> = {
    '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'
  };
  
  const months: Record<string, string> = {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'
  };
  
  const minDesc = describeField(min, 'minute', 'minutes');
  const hourDesc = describeField(hour, 'hour', 'hours');
  const domDesc = describeField(dayOfMonth, 'day of month', 'days of month');
  const monthDesc = describeField(month, 'month', 'months', months);
  const dowDesc = describeField(dayOfWeek, 'day of week', 'days of week', weekdays);
  
  let desc = '';
  if (min.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const step = min.substring(2);
    desc = `At every ${step} minutes`;
  } else if (min === '*' && hour === '*') {
    desc = `Every minute`;
  } else {
    const displayHour = hourDesc === 'every hour' ? 'every hour' : hourDesc.padStart(2, '0');
    const displayMin = minDesc === 'every minute' ? 'every minute' : minDesc.padStart(2, '0');
    if (hourDesc === 'every hour') {
      desc = `At every hour:${displayMin}`;
    } else {
      desc = `At ${displayHour}:${displayMin}`;
    }
  }
  
  if (dayOfMonth !== '*') desc += `, on ${domDesc}`;
  if (month !== '*') desc += `, in ${monthDesc}`;
  if (dayOfWeek !== '*') desc += `, on ${dowDesc}`;
  
  return desc.trim() + '.';
};

// 37. String Case Converter
export const convertCase = (text: string, format: 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant'): string => {
  if (!text) return '';
  const getWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };
  
  const words = getWords(text);
  if (words.length === 0) return '';
  
  switch (format) {
    case 'camel':
      return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'pascal':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake':
      return words.map(w => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map(w => w.toLowerCase()).join('-');
    case 'constant':
      return words.map(w => w.toUpperCase()).join('_');
    default:
      return text;
  }
};

// 38. Text Diff & Comparison (Myers / LCS backtracking grid)
export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export const computeTextDiff = (text1: string, text2: string): DiffLine[] => {
  const lines1 = text1.split(/\r?\n/);
  const lines2 = text2.split(/\r?\n/);

  const n = lines1.length;
  const m = lines2.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      diff.unshift({ type: 'unchanged', value: lines1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', value: lines2[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ type: 'removed', value: lines1[i - 1] });
      i--;
    }
  }

  return diff;
};

// 39. Line Sorter & Deduplicator
export interface SortLinesOptions {
  sortOrder: 'asc' | 'desc' | 'none';
  removeDuplicates: boolean;
  removeBlanks: boolean;
  caseSensitive: boolean;
}

export const sortAndDeduplicateLines = (text: string, options: SortLinesOptions): string => {
  let lines = text.split(/\r?\n/);
  
  if (options.removeBlanks) {
    lines = lines.filter(line => line.trim() !== '');
  }

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    for (const line of lines) {
      const key = options.caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }
    lines = uniqueLines;
  }

  if (options.sortOrder !== 'none') {
    lines.sort((a, b) => {
      const valA = options.caseSensitive ? a : a.toLowerCase();
      const valB = options.caseSensitive ? b : b.toLowerCase();
      if (valA < valB) return options.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return options.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return lines.join('\n');
};

// 40. Huge Line Splitter
export const splitLinesByDelimiter = (
  text: string,
  limit: number,
  options: { mode: 'size' | 'delimiter'; delimiter: string }
): string[] => {
  if (options.mode === 'delimiter') {
    const delimiter = options.delimiter || '\n';
    return text.split(delimiter);
  } else {
    if (limit <= 0) return [text];
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.substring(i, i + limit));
      i += limit;
    }
    return chunks;
  }
};

// 41. Word & Token Counter
export interface WordTokenStats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  whitespaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  density: Array<{ word: string; count: number; percentage: number }>;
}

export const countWordsAndTokens = (text: string): WordTokenStats => {
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const whitespaces = charsWithSpaces - charsNoSpaces;
  
  const wordsArray = text.trim().toLowerCase().split(/[\s,.\-!?;:"'()\[\]]+/g).filter(Boolean);
  const words = wordsArray.length;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\r?\n\r?\n/).filter(p => p.trim().length > 0).length;

  const readingTimeMin = words / 200;
  const speakingTimeMin = words / 130;

  const freq: Record<string, number> = {};
  for (const w of wordsArray) {
    if (w.length > 1) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  const density = Object.entries(freq)
    .map(([word, count]) => ({
      word,
      count,
      percentage: words > 0 ? (count / words) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 10);

  return {
    words,
    charsWithSpaces,
    charsNoSpaces,
    whitespaces,
    sentences,
    paragraphs,
    readingTimeMin,
    speakingTimeMin,
    density
  };
};

// 42. Code Comment Stripper
export const stripCodeComments = (code: string, lang: 'javascript' | 'python' | 'cpp' | 'html' | 'css'): string => {
  switch (lang) {
    case 'javascript':
    case 'cpp': {
      const jsRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\*[\s\S]*?\*\/|\/\/.*)/g;
      return code.replace(jsRegex, (_match, group1) => group1 ? group1 : '');
    }
    case 'css': {
      const cssRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/\*[\s\S]*?\*\/)/g;
      return code.replace(cssRegex, (_match, group1) => group1 ? group1 : '');
    }
    case 'python': {
      const pyRegex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#.*)/g;
      return code.replace(pyRegex, (_match, group1) => group1 ? group1 : '');
    }
    case 'html': {
      const htmlRegex = /(<!--[\s\S]*?-->)/g;
      return code.replace(htmlRegex, '');
    }
    default:
      return code;
  }
};

// 43. String Escaper & Unescaper
export const escapeString = (text: string, format: 'html' | 'json' | 'sql' | 'csharp'): string => {
  switch (format) {
    case 'html':
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    case 'json':
      return JSON.stringify(text).slice(1, -1);
    case 'sql':
      return text.replace(/'/g, "''");
    case 'csharp':
      return text
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    default:
      return text;
  }
};

export const unescapeString = (text: string, format: 'html' | 'json' | 'sql' | 'csharp'): string => {
  switch (format) {
    case 'html':
      return text
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    case 'json':
      try {
        return JSON.parse(`"${text}"`);
      } catch {
        return text;
      }
    case 'sql':
      return text.replace(/''/g, "'");
    case 'csharp':
      return text
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    default:
      return text;
  }
};

// 44. Find & Replace
export const findAndReplaceText = (
  text: string,
  find: string,
  replace: string,
  options: { useRegex: boolean; caseSensitive: boolean; global: boolean }
): string => {
  if (!find) return text;
  
  try {
    if (options.useRegex) {
      let flags = '';
      if (options.global) flags += 'g';
      if (!options.caseSensitive) flags += 'i';
      const regex = new RegExp(find, flags);
      return text.replace(regex, replace);
    } else {
      if (options.global) {
        if (!options.caseSensitive) {
          const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedFind, 'gi');
          return text.replace(regex, replace);
        } else {
          return text.split(find).join(replace);
        }
      } else {
        if (!options.caseSensitive) {
          const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedFind, 'i');
          return text.replace(regex, replace);
        } else {
          return text.replace(find, replace);
        }
      }
    }
  } catch (e: any) {
    throw new Error(`Find & Replace failed: ${e.message}`);
  }
};

// 45. Slug Generator
export const generateTextSlug = (text: string, options: { lowercase: boolean } = { lowercase: true }): string => {
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
    
  if (options.lowercase) {
    slug = slug.toLowerCase();
  }
  
  slug = slug
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/[\s\-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return slug;
};

// 46. Favourites state transitions helper
export const toggleFavouriteArray = (current: string[], toolId: string): string[] => {
  return current.includes(toolId) ? current.filter(id => id !== toolId) : [...current, toolId];
};

// 47. Pin Feedback Hub to bottom helper
export const ensureFeedbackHubAtBottom = (favs: string[]): string[] => {
  if (favs.includes('feedback-hub')) {
    return [...favs.filter(id => id !== 'feedback-hub'), 'feedback-hub'];
  }
  return favs;
};

// 48. Pure Favourites Reordering swap helper
export const reorderFavourites = (
  favs: string[],
  toolId: string,
  direction: 'up' | 'down'
): string[] => {
  const idx = favs.indexOf(toolId);
  if (idx === -1) return favs;
  
  const next = [...favs];
  if (direction === 'up' && idx > 0) {
    const temp = next[idx];
    next[idx] = next[idx - 1];
    next[idx - 1] = temp;
  } else if (direction === 'down' && idx < next.length - 1 && next[idx + 1] !== 'feedback-hub') {
    const temp = next[idx];
    next[idx] = next[idx + 1];
    next[idx + 1] = temp;
  }
  
  return ensureFeedbackHubAtBottom(next);
};





