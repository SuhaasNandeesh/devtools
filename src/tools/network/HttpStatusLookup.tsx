import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { Search } from 'lucide-react';

interface StatusCodeInfo {
  code: number;
  phrase: string;
  category: 'informational' | 'success' | 'redirection' | 'client-error' | 'server-error';
  description: string;
}

const HTTP_STATUS_DATABASE: StatusCodeInfo[] = [
  // 1xx
  { code: 100, phrase: 'Continue', category: 'informational', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, phrase: 'Switching Protocols', category: 'informational', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  // 2xx
  { code: 200, phrase: 'OK', category: 'success', description: 'Standard response for successful HTTP requests. The actual response will depend on the request method used.' },
  { code: 201, phrase: 'Created', category: 'success', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, phrase: 'Accepted', category: 'success', description: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, phrase: 'No Content', category: 'success', description: 'The server successfully processed the request, and is not returning any content.' },
  { code: 206, phrase: 'Partial Content', category: 'success', description: 'The server is delivering only part of the resource (range transmission) due to a Range header sent by the client.' },
  // 3xx
  { code: 301, phrase: 'Moved Permanently', category: 'redirection', description: 'This and all future requests should be directed to the given URI.' },
  { code: 302, phrase: 'Found (Moved Temporarily)', category: 'redirection', description: 'Tells the client to look at another (temporary) URL. The original method should still be used.' },
  { code: 304, phrase: 'Not Modified', category: 'redirection', description: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.' },
  { code: 307, phrase: 'Temporary Redirect', category: 'redirection', description: 'The request should be repeated with another URI; however, future requests should still use the original URI.' },
  { code: 308, phrase: 'Permanent Redirect', category: 'redirection', description: 'The request and all future requests should be repeated using another URI.' },
  // 4xx
  { code: 400, phrase: 'Bad Request', category: 'client-error', description: 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax).' },
  { code: 401, phrase: 'Unauthorized', category: 'client-error', description: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 403, phrase: 'Forbidden', category: 'client-error', description: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.' },
  { code: 404, phrase: 'Not Found', category: 'client-error', description: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.' },
  { code: 405, phrase: 'Method Not Allowed', category: 'client-error', description: 'A request method is not supported for the requested resource (e.g., GET on a form that requires POST).' },
  { code: 406, phrase: 'Not Acceptable', category: 'client-error', description: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.' },
  { code: 408, phrase: 'Request Timeout', category: 'client-error', description: 'The server timed out waiting for the request from the client.' },
  { code: 409, phrase: 'Conflict', category: 'client-error', description: 'Indicates that the request could not be processed because of conflict in the current state of the resource.' },
  { code: 415, phrase: 'Unsupported Media Type', category: 'client-error', description: 'The request entity has a media type which the server or resource does not support.' },
  { code: 418, phrase: "I'm a teapot", category: 'client-error', description: 'Any attempt to brew coffee with a teapot should result in this status code, defined in RFC 2324.' },
  { code: 422, phrase: 'Unprocessable Entity', category: 'client-error', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 429, phrase: 'Too Many Requests', category: 'client-error', description: 'The user has sent too many requests in a given amount of time ("rate limiting").' },
  // 5xx
  { code: 500, phrase: 'Internal Server Error', category: 'server-error', description: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 501, phrase: 'Not Implemented', category: 'server-error', description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
  { code: 502, phrase: 'Bad Gateway', category: 'server-error', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, phrase: 'Service Unavailable', category: 'server-error', description: 'The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.' },
  { code: 504, phrase: 'Gateway Timeout', category: 'server-error', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' }
];

export const HttpStatusLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCodes = HTTP_STATUS_DATABASE.filter((item) => {
    const matchesSearch =
      item.code.toString().includes(searchQuery) ||
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getBadgeColors = (cat: StatusCodeInfo['category']) => {
    switch (cat) {
      case 'informational':
        return { bg: 'rgba(56, 142, 60, 0.1)', color: 'var(--color-success)', text: '1xx Info' };
      case 'success':
        return { bg: 'rgba(56, 142, 60, 0.15)', color: '#388e3c', text: '2xx Success' };
      case 'redirection':
        return { bg: 'rgba(245, 124, 0, 0.1)', color: '#f57c00', text: '3xx Redirect' };
      case 'client-error':
        return { bg: 'rgba(211, 47, 47, 0.1)', color: 'var(--color-danger)', text: '4xx Client Err' };
      case 'server-error':
        return { bg: 'rgba(211, 47, 47, 0.2)', color: '#d32f2f', text: '5xx Server Err' };
    }
  };

  return (
    <ToolLayout
      title="HTTP Status Codes Lookup Directory"
      description="An interactive cheat sheet reference guide to find and inspect standard RFC HTTP status codes, complete with category groupings and concise technical specifications."
      category="Network Utilities"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%' }}>
        {/* Search and Filters panel */}
        <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-4)' }}>
          <div className="flex gap-4 items-center w-full" style={{ flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search by code (e.g. 404), keyword, or phrase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: 'var(--space-8)' }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>

            {/* Selector group */}
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {['all', 'informational', 'success', 'redirection', 'client-error', 'server-error'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="glass-button glass-button-secondary"
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    fontSize: '0.74rem',
                    background: activeCategory === cat ? 'var(--accent-glow)' : 'transparent',
                    borderColor: activeCategory === cat ? 'var(--accent-primary)' : 'var(--border-primary)',
                    color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {cat.toUpperCase().replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Database List layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            width: '100%'
          }}
        >
          {filteredCodes.map((item) => {
            const badge = getBadgeColors(item.category);
            return (
              <GlassCard
                key={item.code}
                style={{
                  padding: 'var(--space-4)',
                  gap: 'var(--space-2)',
                  borderColor: `rgba(${item.category === 'client-error' || item.category === 'server-error' ? '211, 47, 47' : '255, 255, 255'}, 0.08)`
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: badge.color }}>
                    {item.code}
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      background: badge.bg,
                      color: badge.color,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {badge.text}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.phrase}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </GlassCard>
            );
          })}
          {filteredCodes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No status codes found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
