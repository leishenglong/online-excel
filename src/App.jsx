import React, { useState, useEffect, useRef } from 'react';
import { LocaleType, mergeLocales, Univer, UniverInstanceType } from '@univerjs/core';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverUIPlugin } from '@univerjs/ui';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';

import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';

function UniverSheet({ workbook, onClose }) {
  const containerRef = useRef(null);
  const univerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const univer = new Univer({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: mergeLocales(),
      },
    });

    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
    });
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);

    univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
      id: workbook.id,
      name: workbook.name,
      sheets: workbook.sheets,
    });

    univerRef.current = univer;

    return () => {
      if (univerRef.current) {
        univerRef.current.dispose();
        univerRef.current = null;
      }
    };
  }, [workbook]);

  const handleSave = async () => {
    try {
      await fetch(`/api/workbooks/${workbook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workbook),
      });
      alert('Workbook saved!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '12px 16px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', gap: '8px' }}>
        <button onClick={handleSave} style={buttonStyle}>Save</button>
        <button onClick={onClose} style={buttonStyle}>Close</button>
      </div>
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  background: '#1890ff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

function WorkbookCard({ workbook, onSelect }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        background: '#fff',
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => onSelect(workbook)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{workbook.name}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
        {workbook.sheets?.length || 0} sheet(s)
      </p>
    </div>
  );
}

function App() {
  const [workbooks, setWorkbooks] = useState([]);
  const [selectedWorkbook, setSelectedWorkbook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkbooks();
  }, []);

  const fetchWorkbooks = async () => {
    try {
      const res = await fetch('/api/workbooks');
      const data = await res.json();
      setWorkbooks(data);
    } catch (err) {
      console.error('Failed to fetch workbooks:', err);
    }
  };

  const handleCreateWorkbook = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Workbook ${workbooks.length + 1}`,
          sheets: [{ id: 'sheet-1', name: 'Sheet1', data: {} }],
        }),
      });
      const newWorkbook = await res.json();
      setWorkbooks(prev => [...prev, newWorkbook]);
      setSelectedWorkbook(newWorkbook);
    } catch (err) {
      console.error('Failed to create workbook:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkbook = (workbook) => {
    setSelectedWorkbook(workbook);
  };

  const handleCloseWorkbook = () => {
    setSelectedWorkbook(null);
  };

  const headerStyle = {
    padding: '16px 24px',
    background: '#001529',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Online Excel</h1>
        {!selectedWorkbook && (
          <button
            onClick={handleCreateWorkbook}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating...' : '新建表格'}
          </button>
        )}
      </header>

      <main style={{ flex: 1, padding: '24px', overflow: 'auto', background: '#f0f2f5' }}>
        {selectedWorkbook ? (
          <UniverSheet workbook={selectedWorkbook} onClose={handleCloseWorkbook} />
        ) : (
          <div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Workbooks</h2>
            {workbooks.length === 0 ? (
              <p style={{ color: '#666' }}>No workbooks yet. Click "新建表格" to create one.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {workbooks.map(wb => (
                  <WorkbookCard key={wb.id} workbook={wb} onSelect={handleSelectWorkbook} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
