import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './context/ThemeContext';
import { useClipboard } from './context/ClipboardContext';
import { ClipboardPanel } from './components/ClipboardPanel';
import { OnboardingModal } from './components/OnboardingModal';
import { ChangelogModal } from './components/ChangelogModal';
import { UpdateNotification } from './components/UpdateNotification';
import { DashboardHub } from './components/DashboardHub';

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
  Star,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

import {
  toggleFavouriteArray,
  ensureFeedbackHubAtBottom,
  reorderFavourites
} from './utils/engines';

import { TOOLS_CATALOG } from './utils/toolsCatalog';
import type { ToolEntry } from './utils/toolsCatalog';
import { getToolIcon } from './utils/iconHelper';
import { playFeedbackSound, setAudioMutedGlobal } from './utils/audioFeedback';
import { CURRENT_VERSION } from './assets/changelogContent';

// Custom Hooks
import { useCursorFollower } from './hooks/useCursorFollower';
import { useSmartClipboard } from './hooks/useSmartClipboard';
import { useUpdateChecker } from './hooks/useUpdateChecker';
import { useGlobalHotkeys } from './hooks/useGlobalHotkeys';

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
    setAudioMutedGlobal(audioMuted);
  }, [audioMuted]);

  // Navigation states
  const [activeToolId, setActiveToolId] = useState('dashboard-hub');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clipboardDrawerOpen, setClipboardDrawerOpen] = useState(false);

  // Favourites state
  const [favourites, setFavourites] = useState<string[]>(() => {
    // One-time migration for v1.5.4 defaults integration
    if (typeof localStorage !== 'undefined') {
      const migrationKey = 'devtools_favourites_migration_v154';
      const hasMigrated = localStorage.getItem(migrationKey);
      if (!hasMigrated) {
        const cached = localStorage.getItem('devtools_favourites');
        if (cached !== null) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              let updated = [...parsed];
              if (!updated.includes('timezone-converter')) {
                updated.push('timezone-converter');
              }
              if (!updated.includes('feedback-hub')) {
                updated.push('feedback-hub');
              }
              const cleaned = ensureFeedbackHubAtBottom(updated);
              localStorage.setItem('devtools_favourites', JSON.stringify(cleaned));
            }
          } catch {
            // Safe fallback
          }
        }
        localStorage.setItem(migrationKey, 'true');
      }
    }

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
    playFeedbackSound('click');
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

  // Opt-in prompt dialog visibility
  const [showOptInPrompt, setShowOptInPrompt] = useState(() => {
    return localStorage.getItem('devtools_clip_opt_in') === null;
  });

  // Search/Command palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks integrations
  const { mousePos, cursorHovering, showCursor } = useCursorFollower();
  const { smartDetectedTool, detectedText, setSmartDetectedTool } = useSmartClipboard(
    clipboardPermission,
    checkClipboardText,
    activeToolId
  );
  const { newVersionAvailable, setNewVersionAvailable } = useUpdateChecker();
  useGlobalHotkeys(setCommandPaletteOpen, setClipboardDrawerOpen);

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

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Active tool reference
  const activeTool = TOOLS_CATALOG.find((t) => t.id === activeToolId) || TOOLS_CATALOG[3];

  // Set focus automatically when command palette opens
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [commandPaletteOpen]);

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
                playFeedbackSound('click');
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
                      playFeedbackSound('click');
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
                      playFeedbackSound('click');
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
                    if (!nextMuted) {
                      setTimeout(() => {
                        playFeedbackSound('success');
                      }, 50);
                    } else {
                      playFeedbackSound('click');
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
                      playFeedbackSound('click');
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
                    playFeedbackSound('success');
                  }, 50);
                } else {
                  playFeedbackSound('click');
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
          isHotfix={newVersionAvailable.isHotfix}
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
