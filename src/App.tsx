import { useState, useEffect } from 'react'
import './App.css'

interface PageStats {
  metadata: {
    url: string;
    title: string;
    domain: string;
    timestamp: string;
  };
  htmlTags: Array<{ tag: string; count: number }>;
  jsFunctions: string[];
  totalElements: number;
  totalScripts: number;
}

function App() {
  const [stats, setStats] = useState<PageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentTabStats' });
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to analyze page');
      }
    } catch (err) {
      setError('Failed to communicate with extension. Make sure you are on a valid web page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-analyze when popup opens
    analyzePage();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Baseline Feature Checker</h1>
        <p>Analyze HTML tags and JavaScript functions on web pages</p>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing page...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <button onClick={analyzePage} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {stats && !loading && (
          <div className="stats-container">
            <div className="page-info">
              <h2>📄 Page Information</h2>
              <div className="info-grid">
                <div><strong>Title:</strong> {stats.metadata.title}</div>
                <div><strong>Domain:</strong> {stats.metadata.domain}</div>
                <div><strong>Total Elements:</strong> {stats.totalElements.toLocaleString()}</div>
                <div><strong>Script Tags:</strong> {stats.totalScripts}</div>
              </div>
            </div>

            <div className="html-stats">
              <h2>🏷️ HTML Tags ({stats.htmlTags.length} unique)</h2>
              <div className="tag-list">
                {stats.htmlTags.slice(0, 20).map(({ tag, count }) => (
                  <div key={tag} className="tag-item">
                    <span className="tag-name">&lt;{tag}&gt;</span>
                    <span className="tag-count">{count.toLocaleString()}</span>
                  </div>
                ))}
                {stats.htmlTags.length > 20 && (
                  <div className="more-tags">
                    ... and {stats.htmlTags.length - 20} more tags
                  </div>
                )}
              </div>
            </div>

            <div className="js-stats">
              <h2>⚡ JavaScript Functions ({stats.jsFunctions.length} found)</h2>
              <div className="function-list">
                {stats.jsFunctions.slice(0, 15).map((func) => (
                  <div key={func} className="function-item">
                    <code>{func}()</code>
                  </div>
                ))}
                {stats.jsFunctions.length > 15 && (
                  <div className="more-functions">
                    ... and {stats.jsFunctions.length - 15} more functions
                  </div>
                )}
              </div>
            </div>

            <button onClick={analyzePage} className="refresh-btn">
              🔄 Refresh Analysis
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
