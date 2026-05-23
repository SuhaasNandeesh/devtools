import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { formatSql } from '../../utils/engines';

export const SqlFormatter: React.FC = () => {
  const [inputText, setInputText] = useState("select id, name, email from users join roles on users.role_id = roles.id where users.active = true and roles.name = 'Admin' order by users.created_at desc limit 10;");
  const [outputText, setOutputText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText || !inputText.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }

    try {
      const res = formatSql(inputText);
      setErrorMsg(null);
      setOutputText(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Error formatting SQL statement');
      setOutputText('');
    }
  }, [inputText]);

  return (
    <ToolLayout
      title="SQL Query Beautifier"
      description="Standardize and clean database queries offline. Auto-uppercases SQL keywords, aligns columns, and formats main clauses on fresh lines."
      category="Formatters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Input Configuration Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>SQL Input</h2>
          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your unformatted SQL query here..."
            label="Raw SQL Statement"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Beautified SQL Query</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label="Standardized SQL Output"
            fileName="formatted.sql"
            sourceTool="SQL Formatter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
