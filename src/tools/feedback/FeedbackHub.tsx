import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { CURRENT_VERSION } from '../../assets/changelogContent';
import { parseUserAgent } from '../../utils/engines';
import {
  Save,
  Download,
  Globe,
  Trash2,
  Plus,
  MessageSquare,
  Sparkles,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface FeedbackDraft {
  id: string;
  title: string;
  type: 'bug' | 'feature' | 'enhancement';
  description: string;
  timestamp: number;
}

export const FeedbackHub: React.FC = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'bug' | 'feature' | 'enhancement'>('bug');
  const [description, setDescription] = useState('');
  const [drafts, setDrafts] = useState<FeedbackDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parse User Agent metadata
  const userAgentString = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const systemMetadata = parseUserAgent(userAgentString);

  // Load drafts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('devtools_feedback_drafts');
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load feedback drafts:', e);
    }
  }, []);

  // Show a disappearing success notification
  const triggerSuccessNotification = (msg: string) => {
    (window as any).playFeedbackSound?.('success');
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // Save drafts helper
  const handleSaveDraft = () => {
    if (!title.trim() && !description.trim()) {
      (window as any).playFeedbackSound?.('click');
      alert('Please fill in a title or description before saving a draft.');
      return;
    }

    let updatedDrafts: FeedbackDraft[];
    if (activeDraftId) {
      // Edit existing draft
      updatedDrafts = drafts.map((d) =>
        d.id === activeDraftId
          ? {
              ...d,
              title: title.trim(),
              type,
              description: description.trim(),
              timestamp: Date.now()
            }
          : d
      );
      triggerSuccessNotification('Draft updated successfully!');
    } else {
      // Create new draft
      const newDraft: FeedbackDraft = {
        id: `draft_${Date.now()}`,
        title: title.trim() || 'Untitled Feedback Draft',
        type,
        description: description.trim(),
        timestamp: Date.now()
      };
      updatedDrafts = [newDraft, ...drafts];
      setActiveDraftId(newDraft.id);
      triggerSuccessNotification('Draft saved successfully!');
    }

    setDrafts(updatedDrafts);
    localStorage.setItem('devtools_feedback_drafts', JSON.stringify(updatedDrafts));
  };

  // Load draft into fields
  const handleSelectDraft = (draft: FeedbackDraft) => {
    (window as any).playFeedbackSound?.('click');
    setTitle(draft.title === 'Untitled Feedback Draft' ? '' : draft.title);
    setType(draft.type);
    setDescription(draft.description);
    setActiveDraftId(draft.id);
  };

  // Delete a draft
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent loading the draft
    (window as any).playFeedbackSound?.('click');
    if (!confirm('Are you sure you want to delete this draft?')) return;

    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem('devtools_feedback_drafts', JSON.stringify(updated));

    if (activeDraftId === id) {
      handleResetForm();
    }
    triggerSuccessNotification('Draft deleted.');
  };

  // Start fresh
  const handleResetForm = () => {
    (window as any).playFeedbackSound?.('click');
    setTitle('');
    setType('bug');
    setDescription('');
    setActiveDraftId(null);
  };

  // Compile Markdown report
  const compileMarkdownReport = (): string => {
    const typeLabel =
      type === 'bug'
        ? '🐞 Bug Report'
        : type === 'feature'
        ? '🚀 Feature Request'
        : '✨ Enhancement';

    return `# ${typeLabel}: ${title.trim() || 'Untitled Feedback'}

## Description
${description.trim() || '_No description provided._'}

---

## System Diagnostics
- **DevTools Suite Version**: \`v${CURRENT_VERSION}\`
- **Operating System**: \`${systemMetadata.os} ${systemMetadata.osVersion}\`
- **Browser/Engine**: \`${systemMetadata.browser} v${systemMetadata.browserVersion} (${systemMetadata.engine})\`
- **Device Profile**: \`${systemMetadata.device}\`
- **Submission Timestamp**: \`${new Date().toUTCString()}\`
- **Offline Integrity**: Verified (Compiled Client-Side)
`;
  };

  // Export report to a static markdown file
  const handleExportMarkdown = () => {
    if (!title.trim() && !description.trim()) {
      (window as any).playFeedbackSound?.('click');
      alert('Please fill out the feedback before exporting.');
      return;
    }

    (window as any).playFeedbackSound?.('click');
    const md = compileMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devtools-feedback-${type}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerSuccessNotification('Markdown report downloaded successfully!');
  };

  // Publish to GitHub Issue
  const handlePublishToGitHub = () => {
    if (!title.trim()) {
      (window as any).playFeedbackSound?.('click');
      alert('Please provide an issue title before publishing.');
      return;
    }

    (window as any).playFeedbackSound?.('click');
    const mdBody = compileMarkdownReport();

    // Map labels based on types
    const labels = type === 'bug' ? 'bug' : type === 'feature' ? 'enhancement' : 'enhancement';

    const githubNewIssueUrl = `https://github.com/SuhaasNandeesh/devtools/issues/new?title=${encodeURIComponent(
      `[Offline Feedback] ${title.trim()}`
    )}&body=${encodeURIComponent(mdBody)}&labels=${encodeURIComponent(labels)}`;

    window.open(githubNewIssueUrl, '_blank');
    triggerSuccessNotification('GitHub Issue page launched!');
  };

  return (
    <ToolLayout
      title="Offline Feedback & Issue Hub"
      description="Report bugs, request new utilities, or propose dashboard enhancements. Formulate your reports safely in complete offline confidentiality; drafts are stored in your secure client-side storage until you choose to download or export them to GitHub."
      category="Support"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'stretch',
          width: '100%'
        }}
      >
        {/* Left Form Card */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full flex-wrap gap-2">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Create Report
            </h2>
            {activeDraftId && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  background: 'hsla(250, 85%, 65%, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsla(250, 85%, 65%, 0.2)'
                }}
              >
                Editing Draft
              </span>
            )}
          </div>

          {/* Form input: Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em'
              }}
            >
              Feedback Category
            </label>
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {(['bug', 'feature', 'enhancement'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    (window as any).playFeedbackSound?.('click');
                    setType(t);
                  }}
                  className="glass-button"
                  style={{
                    flex: 1,
                    padding: 'var(--space-2) var(--space-3)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: type === t ? 'var(--accent-primary)' : 'transparent',
                    color: type === t ? 'white' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {t === 'bug' ? '🐞 Bug' : t === 'feature' ? '🚀 Feature' : '✨ Enhancement'}
                </button>
              ))}
            </div>
          </div>

          {/* Form input: Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
            <label
              htmlFor="feedback-title"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em'
              }}
            >
              Title / Summary
            </label>
            <input
              id="feedback-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue or feature request..."
              className="text-input w-full"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Form input: Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)', flex: 1 }}>
            <label
              htmlFor="feedback-desc"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em'
              }}
            >
              Detailed Details
            </label>
            <textarea
              id="feedback-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'bug'
                  ? 'Steps to reproduce:\n1. Open X\n2. Do Y\n3. Observe Z\n\nExpected behavior vs actual behavior:'
                  : type === 'feature'
                  ? 'Describe the new tool or feature utility:\n- What would it do?\n- Why is it helpful offline?\n- Any reference websites/packages?'
                  : 'Describe the proposed enhancements:\n- Which tool/UI component needs polishing?\n- How should it look/behave?'
              }
              className="text-input w-full"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                outline: 'none',
                minHeight: '220px',
                fontFamily: 'inherit',
                resize: 'vertical',
                flex: 1
              }}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="glass-button flex items-center justify-center gap-2"
              style={{
                flex: 2,
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-glass-heavy)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <Save size={16} />
              {activeDraftId ? 'Update Draft' : 'Save Offline Draft'}
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="glass-button flex items-center justify-center gap-2"
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                background: 'transparent',
                border: '1px solid hsla(0, 80%, 60%, 0.2)',
                color: 'var(--accent-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
              Clear
            </button>
          </div>
        </GlassCard>

        {/* Right side: Action Bridge & Draft locker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Export & Push Card */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Export & Submit Report
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Ready to submit your feedback? Select one of the options below. Both options will automatically inject diagnostic details safely.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Option A: Download Markdown */}
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="glass-button flex items-center justify-between w-full"
                style={{
                  padding: 'var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-primary)',
                  textAlign: 'left',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <Download size={20} style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Download Markdown File
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Keep 100% offline. Save file locally.
                    </div>
                  </div>
                </div>
                <FileText size={16} style={{ color: 'var(--text-muted)' }} />
              </button>

              {/* Option B: Publish on GitHub */}
              <button
                type="button"
                onClick={handlePublishToGitHub}
                className="glass-button flex items-center justify-between w-full"
                style={{
                  padding: 'var(--space-4)',
                  background: 'linear-gradient(135deg, hsla(250, 85%, 65%, 0.15) 0%, hsla(250, 85%, 65%, 0.03) 100%)',
                  border: '1px solid hsla(250, 85%, 65%, 0.25)',
                  textAlign: 'left',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      background: 'hsla(250, 85%, 65%, 0.2)',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid hsla(250, 85%, 65%, 0.3)'
                    }}
                  >
                    <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Submit on GitHub Issues
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Launches browser tab with compiled form details.
                    </div>
                  </div>
                </div>
                <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              </button>
            </div>

            {/* Diagnostics HUD snippet */}
            <div
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={12} /> Auto-Injected Metadata
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                DevTools: v{CURRENT_VERSION}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                System OS: {systemMetadata.os} {systemMetadata.osVersion}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Browser: {systemMetadata.browser} v{systemMetadata.browserVersion}
              </div>
            </div>
          </GlassCard>

          {/* Offline Draft Locker */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
              Offline Drafts Locker
            </h2>

            {drafts.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6) 0',
                  gap: 'var(--space-2)',
                  color: 'var(--text-muted)'
                }}
              >
                <FileText size={32} style={{ opacity: 0.3 }} />
                <span style={{ fontSize: '0.8rem' }}>No offline drafts saved yet.</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}
              >
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDraft(d)}
                    className="glass-panel"
                    style={{
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: activeDraftId === d.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                      background: activeDraftId === d.id ? 'hsla(250, 85%, 65%, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            textTransform: 'uppercase',
                            background: d.type === 'bug' ? 'rgba(230, 80, 80, 0.15)' : d.type === 'feature' ? 'rgba(80, 180, 230, 0.15)' : 'rgba(80, 230, 180, 0.15)',
                            color: d.type === 'bug' ? '#ff6b6b' : d.type === 'feature' ? '#4dabf7' : '#38d9a9',
                            border: d.type === 'bug' ? '1px solid rgba(230, 80, 80, 0.2)' : d.type === 'feature' ? '1px solid rgba(80, 180, 230, 0.2)' : '1px solid rgba(80, 230, 180, 0.2)'
                          }}
                        >
                          {d.type === 'bug' ? 'Bug' : d.type === 'feature' ? 'Feature' : 'Enhance'}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '140px'
                          }}
                        >
                          {d.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Saved: {new Date(d.timestamp).toLocaleDateString()} at {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteDraft(d.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="hover:text-red-400 hover:bg-white/5 transition-all"
                      title="Delete Draft"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Floating Success HUD notification toast */}
      {successMsg && (
        <div
          className="animate-fade"
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            right: 'var(--space-6)',
            background: 'rgba(20, 20, 25, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid hsla(250, 85%, 65%, 0.3)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px hsla(250, 85%, 65%, 0.15)',
            padding: 'var(--space-3) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            color: 'var(--text-primary)',
            zIndex: 9999,
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <div
            style={{
              background: 'hsla(250, 85%, 65%, 0.2)',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <span>{successMsg}</span>
        </div>
      )}
    </ToolLayout>
  );
};
