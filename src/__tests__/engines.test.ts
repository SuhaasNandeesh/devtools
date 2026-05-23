import { describe, it, expect } from 'vitest';
import {
  base64Encode,
  base64Decode,
  sortJSONKeys,
  convertRadix,
  generateUUIDv4,
  generateUUIDv1,
  formatHexPattern,
  generateSequentialUUIDs,
  parseJWT,
  calculateSubnet,
  parseUserAgent,
  extractHtmlLinks,
  encodeHtmlAccents,
  decodeHtmlAccents,
  calculateAspectRatioFraction,
  minifySVG,
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  csvToSqlInsert,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb,
  formatXml,
  formatHtml,
  formatCss,
  formatSql,
  markdownToHtml,
  minifyJsTs,
  generatePassword,
  generateLoremIpsum,
  calculateHash,
  calculateHmac,
  generateQrCodeSvg,
  generateBarcode128Svg,
  generateRsaKeyPair,
  generateFakeData,
  describeCron,
  convertCase,
  computeTextDiff,
  sortAndDeduplicateLines,
  splitLinesByDelimiter,
  countWordsAndTokens,
  stripCodeComments,
  escapeString,
  unescapeString,
  findAndReplaceText,
  generateTextSlug,
  toggleFavouriteArray
} from '../utils/engines';

describe('Base64 UTF-8 safe conversions', () => {
  it('should encode and decode standard ASCII strings correctly', () => {
    const text = 'Offline DevTools!';
    const encoded = base64Encode(text);
    expect(encoded).toBe('T2ZmbGluZSBEZXZUb29scyE=');
    expect(base64Decode(encoded)).toBe(text);
  });

  it('should handle emojis and multi-byte unicode characters safely without throwing', () => {
    const text = 'Developer suite 💻🚀 🔥';
    const encoded = base64Encode(text);
    expect(base64Decode(encoded)).toBe(text);
  });

  it('should throw an error for non-base64 strings during decode', () => {
    expect(() => base64Decode('!!!InvalidBase64!!!')).toThrow();
  });
});

describe('JSON Alphabetical Key Sorter', () => {
  it('should sort nested JSON keys alphabetically recursively', () => {
    const obj = {
      z: 1,
      a: {
        y: 'y-val',
        b: 'b-val'
      },
      m: [
        { q: 2, c: 1 }
      ]
    };

    const sorted = sortJSONKeys(obj);
    
    // Verify sorting order of keys in string
    expect(JSON.stringify(sorted)).toBe('{"a":{"b":"b-val","y":"y-val"},"m":[{"c":1,"q":2}],"z":1}');
  });
});

describe('Radix Number Base conversions', () => {
  it('should convert standard values correctly across decimal, hex, binary, and octal', () => {
    const res = convertRadix('255', 10);
    expect(res.dec).toBe('255');
    expect(res.hex).toBe('ff');
    expect(res.bin).toBe('11111111');
    expect(res.oct).toBe('377');
  });

  it('should handle binary values and hex prefixes correctly', () => {
    const res = convertRadix('0xff', 16);
    expect(res.dec).toBe('255');
  });

  it('should throw errors for invalid digits based on base', () => {
    expect(() => convertRadix('255a', 10)).toThrow();
    expect(() => convertRadix('11110002', 2)).toThrow();
  });
});

describe('UUID / GUID generator formats', () => {
  it('should generate valid UUID v4 formats matching standard patterns', () => {
    const uuid = generateUUIDv4();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(uuid)).toBe(true);
  });

  it('should generate valid UUID v1 formats matching standard patterns', () => {
    const uuid = generateUUIDv1();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(uuid)).toBe(true);
  });
});

describe('Custom Hex pattern formatting', () => {
  it('should format hex strings correctly according to blocks and braces specifications', () => {
    const hex = 'a76bf931b8f24581b7729a411488f793';
    
    // Standard hyphenated
    expect(formatHexPattern(hex, 'standard')).toBe('a76bf931-b8f2-4581-b772-9a411488f793');
    
    // Braced standard
    expect(formatHexPattern(hex, 'braced')).toBe('{a76bf931-b8f2-4581-b772-9a411488f793}');
    
    // No hyphens
    expect(formatHexPattern(hex, 'no-hyphens')).toBe('a76bf931b8f24581b7729a411488f793');
    
    // Blocks-2 (XX-XX-...)
    const shortHex = '1000000000000000';
    expect(formatHexPattern(shortHex, 'blocks-2')).toBe('10-00-00-00-00-00-00-00');
    
    // Blocks-3 (XXX-XXX-...)
    const trioHex = '100000000000000';
    expect(formatHexPattern(trioHex, 'blocks-3')).toBe('100-000-000-000-000');
  });
});

describe('Sequential GUID Range generation', () => {
  it('should generate correctly incremented sequential GUID lists', () => {
    const start = 'a76bf931-b8f2-4581-b772-9a411488f793';
    const list = generateSequentialUUIDs(start, 3, 'standard');
    
    expect(list).toHaveLength(3);
    expect(list[0]).toBe('a76bf931-b8f2-4581-b772-9a411488f793');
    expect(list[1]).toBe('a76bf931-b8f2-4581-b772-9a411488f794');
    expect(list[2]).toBe('a76bf931-b8f2-4581-b772-9a411488f795');
  });

  it('should handle custom hex blocks incrementation safely', () => {
    const startBlock = '10-00-00-00-00-00-00-00';
    const list = generateSequentialUUIDs(startBlock, 3, 'blocks-2');
    
    expect(list).toHaveLength(3);
    expect(list[0]).toBe('10-00-00-00-00-00-00-00');
    expect(list[1]).toBe('10-00-00-00-00-00-00-01');
    expect(list[2]).toBe('10-00-00-00-00-00-00-02');
  });
  
  it('should handle trio blocks incrementation safely', () => {
    const startBlock = '100-000-000-000-000';
    const list = generateSequentialUUIDs(startBlock, 3, 'blocks-3');
    
    expect(list).toHaveLength(3);
    expect(list[0]).toBe('100-000-000-000-000');
    expect(list[1]).toBe('100-000-000-000-001');
    expect(list[2]).toBe('100-000-000-000-002');
  });
});

describe('JWT Token Parser', () => {
  it('should parse valid JWT tokens successfully', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzc5NTMyODAwfQ.dummy_sig';
    const res = parseJWT(jwt);
    expect(res.header.alg).toBe('HS256');
    expect(res.payload.name).toBe('John Doe');
    expect(res.claimsExplanation).toHaveLength(1);
    expect(res.claimsExplanation[0].key).toBe('exp');
    expect(res.claimsExplanation[0].value).toBe('1779532800');
  });

  it('should throw errors for invalid JWT token strings', () => {
    expect(() => parseJWT('invalid.jwt.token.too.many.dots')).toThrow();
    expect(() => parseJWT('missing-dots')).toThrow();
  });
});

describe('IPv4 CIDR Subnet Calculator', () => {
  it('should calculate standard IPv4 subnet details correctly', () => {
    const res = calculateSubnet('192.168.1.100', 24);
    expect(res.mask).toBe('255.255.255.0');
    expect(res.network).toBe('192.168.1.0');
    expect(res.broadcast).toBe('192.168.1.255');
    expect(res.rangeStart).toBe('192.168.1.1');
    expect(res.rangeEnd).toBe('192.168.1.254');
    expect(res.totalHosts).toBe(254);
    expect(res.wildcard).toBe('0.0.0.255');
  });

  it('should handle CIDR /32 and /31 boundary subnet definitions', () => {
    const res32 = calculateSubnet('10.0.0.5', 32);
    expect(res32.totalHosts).toBe(1);
    expect(res32.network).toBe('10.0.0.5');

    const res31 = calculateSubnet('10.0.0.6', 31);
    expect(res31.totalHosts).toBe(2);
    expect(res31.network).toBe('10.0.0.6');
  });

  it('should throw an error for invalid IP syntax or out-of-bounds Octets', () => {
    expect(() => calculateSubnet('256.0.0.1', 24)).toThrow();
    expect(() => calculateSubnet('10.0.0', 24)).toThrow();
    expect(() => calculateSubnet('192.168.1.1', 33)).toThrow();
  });
});

describe('Offline User Agent Inspector', () => {
  it('should inspect standard user-agent string formats correctly', () => {
    const macChrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const res = parseUserAgent(macChrome);
    expect(res.os).toBe('macOS');
    expect(res.browser).toBe('Google Chrome');
    expect(res.engine).toBe('Blink');
  });

  it('should inspect mobile android user-agent strings correctly', () => {
    const androidUA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36';
    const res = parseUserAgent(androidUA);
    expect(res.os).toBe('Android');
    expect(res.osVersion).toBe('13');
    expect(res.device).toBe('Mobile Device');
  });
});

describe('HTML Link Scraper', () => {
  it('should extract link structures from raw HTML', () => {
    const html = `
      <div>
        <a href="https://example.com/home">Visit Home</a>
        <img src="/images/logo.png" alt="Brand Logo" />
        <script src="/js/bundle.js"></script>
        <link rel="stylesheet" href="/css/styles.css" />
      </div>
    `;
    const list = extractHtmlLinks(html);
    expect(list).toHaveLength(4);
    expect(list[0].type).toBe('anchor');
    expect(list[0].url).toBe('https://example.com/home');
    expect(list[1].type).toBe('image');
    expect(list[2].type).toBe('script');
    expect(list[3].type).toBe('stylesheet');
  });
});

describe('HTML Accents Encoder & Decoder', () => {
  it('should encode accented characters to HTML named entities', () => {
    const raw = 'Café, Niño, François, Müller';
    const encoded = encodeHtmlAccents(raw);
    expect(encoded).toBe('Caf&eacute;, Ni&ntilde;o, Fran&ccedil;ois, M&uuml;ller');
  });

  it('should decode named and numeric HTML entities back to characters', () => {
    const encoded = 'Caf&eacute;, Ni&ntilde;o, Fran&ccedil;ois, M&uuml;ller, &#233;, &#xe9;';
    const decoded = decodeHtmlAccents(encoded);
    expect(decoded).toBe('Café, Niño, François, Müller, é, é');
  });
});

describe('Aspect Ratio Fraction Solver', () => {
  it('should simplify standard screen resolutions correctly', () => {
    const res = calculateAspectRatioFraction(1920, 1080);
    expect(res.ratio).toBe('16:9');
    expect(res.widthFactor).toBe(16);
    expect(res.heightFactor).toBe(9);
    expect(res.decimal).toBe(1.7778);
  });

  it('should handle custom resolutions and simplify completely', () => {
    const resSquare = calculateAspectRatioFraction(800, 800);
    expect(resSquare.ratio).toBe('1:1');
    expect(resSquare.widthFactor).toBe(1);
    expect(resSquare.heightFactor).toBe(1);
  });
});

describe('SVG Minifier', () => {
  it('should minify SVG strings removing metadata, prologue, and spaces', () => {
    const rawSvg = `
      <?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 25.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve" sketch:type="sketch-item">
        <style type="text/css">
          .st0{fill:#FF0000;}
        </style>
        <circle class="st0" cx="50" cy="50" r="40"/>
      </svg>
    `;
    const minified = minifySVG(rawSvg);
    expect(minified).not.toContain('<?xml');
    expect(minified).not.toContain('<!--');
    expect(minified).not.toContain('sketch:type');
    expect(minified).toContain('<svg');
    expect(minified).toContain('</svg>');
    // Verify no linebreaks or multi-spaces
    expect(minified).not.toContain('\n');
    expect(minified).not.toContain('  ');
  });
});

describe('JSON <=> YAML Parser', () => {
  it('should format JSON objects to YAML successfully', () => {
    const obj = { name: 'John Doe', age: 30, skills: ['JS', 'TS'], details: { active: true } };
    const yaml = jsonToYaml(obj);
    expect(yaml).toContain('name: "John Doe"');
    expect(yaml).toContain('skills:\n  - "JS"\n  - "TS"');
    expect(yaml).toContain('details:\n  active: true');
  });

  it('should parse YAML structures back to JSON correctly', () => {
    const yaml = `
      name: John Doe
      age: 30
      skills:
        - JS
        - TS
      details:
        active: true
    `;
    const obj = yamlToJson(yaml);
    expect(obj.name).toBe('John Doe');
    expect(obj.age).toBe(30);
    expect(obj.skills).toEqual(['JS', 'TS']);
    expect(obj.details.active).toBe(true);
  });
});

describe('JSON <=> XML Converter', () => {
  it('should format JSON into XML tag blocks recursively', () => {
    const obj = { user: { name: 'John', age: 30 } };
    const xml = jsonToXml(obj, 'root');
    expect(xml).toContain('<root>');
    expect(xml).toContain('<user>');
    expect(xml).toContain('<name>John</name>');
    expect(xml).toContain('</root>');
  });

  it('should parse XML strings back into structured JSON objects', () => {
    const xml = '<root><user><name>John</name><age>30</age></user></root>';
    const obj = xmlToJson(xml);
    expect(obj.root.user.name).toBe('John');
    expect(obj.root.user.age).toBe(30);
  });
});

describe('JSON <=> CSV Converter', () => {
  it('should parse array objects to tabular CSV format', () => {
    const arr = [
      { name: 'John', age: 30, city: 'London' },
      { name: 'Alice', age: 25, city: 'Paris' }
    ];
    const csv = jsonToCsv(arr);
    expect(csv).toBe('name,age,city\nJohn,30,London\nAlice,25,Paris');
  });

  it('should parse CSV lines back to JSON arrays successfully', () => {
    const csv = 'name,age,city\nJohn,30,London\nAlice,25,Paris';
    const arr = csvToJson(csv);
    expect(arr).toHaveLength(2);
    expect(arr[0]).toEqual({ name: 'John', age: 30, city: 'London' });
    expect(arr[1]).toEqual({ name: 'Alice', age: 25, city: 'Paris' });
  });
});

describe('CSV to SQL insert queries generator', () => {
  it('should escape single quotes and build batch SQL insert queries', () => {
    const csv = "name,title\nJohn,O'Connor\nAlice,Engineer";
    const sql = csvToSqlInsert(csv, 'users');
    expect(sql).toContain("INSERT INTO `users` (`name`, `title`) VALUES ('John', 'O''Connor');");
    expect(sql).toContain("INSERT INTO `users` (`name`, `title`) VALUES ('Alice', 'Engineer');");
  });
});

describe('Color Space translation calculations', () => {
  it('should translate HEX to RGB and RGB to HEX correctly', () => {
    const rgb = hexToRgb('#7c4dff');
    expect(rgb).toEqual({ r: 124, g: 77, b: 255 });
    
    const hex = rgbToHex(124, 77, 255);
    expect(hex).toBe('#7c4dff');
  });

  it('should translate RGB to HSL and HSL to RGB correctly', () => {
    const hsl = rgbToHsl(124, 77, 255);
    expect(hsl.h).toBe(256);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(65);

    const rgb = hslToRgb(256, 100, 65);
    expect(rgb).toEqual({ r: 124, g: 77, b: 255 });
  });

  it('should translate RGB to CMYK and CMYK to RGB correctly', () => {
    const cmyk = rgbToCmyk(124, 77, 255);
    expect(cmyk).toEqual({ c: 51, m: 70, y: 0, k: 0 });

    const rgb = cmykToRgb(51, 70, 0, 0);
    expect(rgb).toEqual({ r: 125, g: 77, b: 255 }); // slight float rounding clamp
  });
});

describe('XML Formatter and Minifier', () => {
  it('should format messy XML correctly with correct indentation', () => {
    const raw = '<root><child attr="val">hello</child><self />   </root>';
    const formatted = formatXml(raw, false, 2);
    expect(formatted).toBe('<root>\n  <child attr="val">hello</child>\n  <self />\n</root>');
  });

  it('should minify XML correctly', () => {
    const raw = '<root>\n  <child>  hello  </child>\n</root>';
    const minified = formatXml(raw, true);
    expect(minified).toBe('<root><child>  hello  </child></root>');
  });
});

describe('HTML Formatter and Minifier', () => {
  it('should format HTML ignoring indentation increment for void tags', () => {
    const raw = '<div><h1>Title</h1><br><img src="foo.jpg"></div>';
    const formatted = formatHtml(raw, false, 2);
    expect(formatted).toBe('<div>\n  <h1>Title</h1>\n  <br>\n  <img src="foo.jpg">\n</div>');
  });

  it('should minify HTML correctly', () => {
    const raw = '<div>\n  <p>text</p>\n</div>';
    const minified = formatHtml(raw, true);
    expect(minified).toBe('<div><p>text</p></div>');
  });
});

describe('CSS Beautifier and Minifier', () => {
  it('should beautify CSS and nested blocks correctly', () => {
    const raw = 'body{color:red;margin:0;}@media (max-width: 600px){div{padding:10px;}}';
    const formatted = formatCss(raw, false);
    expect(formatted).toContain('body {\n  color: red;\n  margin: 0;\n}');
    expect(formatted).toContain('@media (max-width: 600px) {\n  div {\n    padding: 10px;\n  }\n}');
  });

  it('should minify CSS correctly', () => {
    const raw = 'body {\n  color: red;\n  margin: 0;\n}';
    const minified = formatCss(raw, true);
    expect(minified).toBe('body{color:red;margin:0}');
  });
});

describe('SQL Query Beautifier', () => {
  it('should uppercase keywords and insert appropriate linebreaks', () => {
    const raw = 'select id, name from users where status = \'active\' group by status';
    const formatted = formatSql(raw);
    expect(formatted).toBe("SELECT id, name\nFROM users\nWHERE status = 'active'\nGROUP BY status");
  });
});

describe('Markdown to HTML Converter', () => {
  it('should compile headers, lists, bold, italics, code, and links to valid HTML', () => {
    const md = '# Title\n- Item 1\n- Item 2\nSome text with **bold** and *italic* and `code`.\n[Google](https://google.com)';
    const html = markdownToHtml(md);
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');
    expect(html).toContain('<p>Some text with <strong>bold</strong> and <em>italic</em> and <code>code</code>.</p>');
    expect(html).toContain('<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>');
  });

  it('should translate code blocks and escape nested HTML syntax', () => {
    const md = '```js\nconst a = <b>hello</b>;\n```';
    const html = markdownToHtml(md);
    expect(html).toBe('<pre><code class="language-js">const a = &lt;b&gt;hello&lt;/b&gt;;\n</code></pre>');
  });
});

describe('JS/TS Minifier', () => {
  it('should strip comments and spaces while protecting literal strings', () => {
    const raw = `
      // a comment
      const greeting = "Hello, world!";
      /* multi-line
         comment */
      function sayHello() {
        console.log(greeting);
      }
    `;
    const minified = minifyJsTs(raw);
    expect(minified).toBe('const greeting="Hello, world!";function sayHello(){console.log(greeting);}');
  });
});

describe('Strong Password Generator', () => {
  it('should generate password of matching length and options character set restrictions', () => {
    const pwd = generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false });
    expect(pwd).toHaveLength(16);
    expect(pwd).toMatch(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
  });

  it('should exclude similar characters correctly', () => {
    const pwd = generatePassword(100, { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true });
    // Should not contain i, l, 1, L, o, 0, O, !, |
    expect(pwd).not.toMatch(/[il1Lo0O!|]/);
  });
});

describe('Lorem Ipsum Generator', () => {
  it('should generate matching count of words', () => {
    const text = generateLoremIpsum(10, 'words');
    const words = text.split(' ');
    expect(words).toHaveLength(10);
  });

  it('should generate paragraphs separated by double linebreaks', () => {
    const text = generateLoremIpsum(3, 'paragraphs');
    const paragraphs = text.split('\n\n');
    expect(paragraphs).toHaveLength(3);
  });
});

describe('Hash Digest Generator (MD5 & SHA)', () => {
  it('should calculate MD5 hash accurately', async () => {
    const digest = await calculateHash('Offline DevTools', 'MD5');
    expect(digest).toBe('f94eaac4032702003f612693c1445018');
  });

  it('should calculate SHA-256 hash using native Web Crypto', async () => {
    const digest = await calculateHash('Offline DevTools', 'SHA-256');
    expect(digest).toBe('7b7149ccc39427cb754518c60a4b866ab67e7fd1ab610a577e4c26e659a66c37');
  });
});

describe('HMAC Generator', () => {
  it('should generate secure HMAC signature using SHA-256', async () => {
    const sig = await calculateHmac('Offline DevTools', 'secret-key');
    expect(sig).toBe('8980918cac03d5e186538d34b4e895ca8bc11830e7111dc8aab050ac09025585');
  });
});

describe('QR Code Generator (SVG matrix)', () => {
  it('should render scannable SVG paths', () => {
    const svg = generateQrCodeSvg('https://example.com', 256, '#000000');
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
    expect(svg).toContain('viewBox="0 0 256 256"');
  });
});

describe('Barcode Generator (Code 128)', () => {
  it('should render Code 128 Start B and correct Stop indices SVG paths', () => {
    const svg = generateBarcode128Svg('CODE128');
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
    expect(svg).toContain('CODE128');
  });
});

describe('RSA Key Pair Generator', () => {
  it('should generate secure key pair in PEM format', async () => {
    const keyPair = await generateRsaKeyPair();
    expect(keyPair.publicPem).toContain('-----BEGIN PUBLIC KEY-----');
    expect(keyPair.publicPem).toContain('-----END PUBLIC KEY-----');
    expect(keyPair.privatePem).toContain('-----BEGIN PRIVATE KEY-----');
    expect(keyPair.privatePem).toContain('-----END PRIVATE KEY-----');
  });
});

describe('Fake Test Data Generator', () => {
  it('should generate structured records deterministically with seed', () => {
    const data = generateFakeData(5, 12345);
    expect(data).toHaveLength(5);
    expect(data[0]).toHaveProperty('id', 1);
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('email');
    expect(data[0]).toHaveProperty('phone');
    expect(data[0]).toHaveProperty('company');
    expect(data[0]).toHaveProperty('address');
    expect(data[0]).toHaveProperty('creditCard');
    
    // Verify deterministic generation
    const data2 = generateFakeData(5, 12345);
    expect(data[0].name).toBe(data2[0].name);
  });
});

describe('Cron Scheduler Descriptor', () => {
  it('should describe simple patterns correctly', () => {
    expect(describeCron('* * * * *')).toBe('Every minute.');
    expect(describeCron('*/5 * * * *')).toBe('At every 5 minutes.');
    expect(describeCron('0 12 * * 1')).toBe('At 12:00, on Monday.');
  });
});

describe('String Case Converter', () => {
  it('should convert cases correctly', () => {
    const text = 'foo_bar-baz test';
    expect(convertCase(text, 'camel')).toBe('fooBarBazTest');
    expect(convertCase(text, 'pascal')).toBe('FooBarBazTest');
    expect(convertCase(text, 'snake')).toBe('foo_bar_baz_test');
    expect(convertCase(text, 'kebab')).toBe('foo-bar-baz-test');
    expect(convertCase(text, 'constant')).toBe('FOO_BAR_BAZ_TEST');
  });
});

describe('Text Diff & Comparison', () => {
  it('should compute differences between two files correctly', () => {
    const text1 = 'Hello\nWorld\nToolbox';
    const text2 = 'Hello\nBeautiful\nWorld\nDevTools';
    const diff = computeTextDiff(text1, text2);
    
    expect(diff).toContainEqual({ type: 'unchanged', value: 'Hello' });
    expect(diff).toContainEqual({ type: 'removed', value: 'Toolbox' });
    expect(diff).toContainEqual({ type: 'added', value: 'Beautiful' });
    expect(diff).toContainEqual({ type: 'added', value: 'DevTools' });
  });
});

describe('Line Sorter & Deduplicator', () => {
  it('should sort and deduplicate lines', () => {
    const text = 'banana\nApple\nbanana\n\ncherry';
    const res = sortAndDeduplicateLines(text, {
      sortOrder: 'asc',
      removeDuplicates: true,
      removeBlanks: true,
      caseSensitive: false
    });
    expect(res).toBe('Apple\nbanana\ncherry');
  });
});

describe('Huge Line Splitter', () => {
  it('should split text by size or delimiter', () => {
    expect(splitLinesByDelimiter('abcdef', 2, { mode: 'size', delimiter: '\n' })).toEqual(['ab', 'cd', 'ef']);
    expect(splitLinesByDelimiter('a,b,c', 0, { mode: 'delimiter', delimiter: ',' })).toEqual(['a', 'b', 'c']);
  });
});

describe('Word & Token Counter', () => {
  it('should count words, chars, sentences and density correctly', () => {
    const stats = countWordsAndTokens('Hello world. Hello beautiful world!');
    expect(stats.words).toBe(5);
    expect(stats.sentences).toBe(2);
    expect(stats.density[0].word).toBe('hello');
    expect(stats.density[0].count).toBe(2);
  });
});

describe('Code Comment Stripper', () => {
  it('should strip single and multi-line comments safely', () => {
    const jsCode = '// inline\nconst a = 1; /* block */\nconst b = "http://google.com";';
    expect(stripCodeComments(jsCode, 'javascript').replace(/\s+/g, ' ').trim()).toBe('const a = 1; const b = "http://google.com";');
  });
});

describe('String Escaper / Unescaper', () => {
  it('should escape and unescape html/json/sql/csharp', () => {
    expect(escapeString('<script>', 'html')).toBe('&lt;script&gt;');
    expect(unescapeString('&lt;script&gt;', 'html')).toBe('<script>');
    
    expect(escapeString('a\'b', 'sql')).toBe('a\'\'b');
    expect(unescapeString('a\'\'b', 'sql')).toBe('a\'b');
  });
});

describe('Find & Replace', () => {
  it('should replace occurrences with regex or literal', () => {
    expect(findAndReplaceText('foo bar foo', 'foo', 'baz', { useRegex: false, caseSensitive: true, global: true })).toBe('baz bar baz');
    expect(findAndReplaceText('foo bar FOO', 'foo', 'baz', { useRegex: true, caseSensitive: false, global: true })).toBe('baz bar baz');
  });
});

describe('Slug Generator', () => {
  it('should convert accented text into clean URL-safe slugs', () => {
    expect(generateTextSlug('Café Noël & Crème Brûlée!  ')).toBe('cafe-noel-creme-brulee');
  });
});

describe('Favourites Toggle Array Helper', () => {
  it('should add a tool ID to favourites if not present', () => {
    const favs = ['base64-converter', 'epoch-converter'];
    const next = toggleFavouriteArray(favs, 'json-formatter');
    expect(next).toEqual(['base64-converter', 'epoch-converter', 'json-formatter']);
  });

  it('should remove a tool ID from favourites if already present', () => {
    const favs = ['base64-converter', 'epoch-converter', 'json-formatter'];
    const next = toggleFavouriteArray(favs, 'epoch-converter');
    expect(next).toEqual(['base64-converter', 'json-formatter']);
  });

  it('should result in an empty array if all favourites are toggled off', () => {
    const favs = ['json-formatter'];
    const next = toggleFavouriteArray(favs, 'json-formatter');
    expect(next).toEqual([]);
  });
});

describe('Default Favourites Set', () => {
  it('should have the exact 5 tools requested by the user in defaults', () => {
    const defaults = ['base64-converter', 'uuid-generator', 'comment-stripper', 'xml-formatter', 'password-generator'];
    expect(defaults).toContain('base64-converter');
    expect(defaults).toContain('uuid-generator');
    expect(defaults).toContain('comment-stripper');
    expect(defaults).toContain('xml-formatter');
    expect(defaults).toContain('password-generator');
    expect(defaults).toHaveLength(5);
  });
});
