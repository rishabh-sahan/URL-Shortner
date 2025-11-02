import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  BarChart3,
  Clock,
  Copy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  TrendingUp
} from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:8001';

function App() {
  // State management
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [analyticsId, setAnalyticsId] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load recent URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentUrls');
    if (saved) {
      setRecentUrls(JSON.parse(saved));
    }
  }, []);

  // Show alert
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Show toast
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Handle URL shortening
  const handleShorten = async (e) => {
    e.preventDefault();

    if (!isValidUrl(longUrl)) {
      showAlert('Please enter a valid URL starting with http:// or https://', 'error');
      return;
    }

    setLoading(true);
    setShortUrl('');

    try {
      const response = await fetch(`${API_BASE}/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl })
      });

      const data = await response.json();

      if (response.ok) {
        const newShortUrl = `${API_BASE}/${data.id}`;
        setShortUrl(newShortUrl);
        showAlert('Short URL created successfully!', 'success');

        // Add to recent URLs
        const urlData = {
          shortId: data.id,
          originalUrl: longUrl,
          shortUrl: newShortUrl,
          createdAt: Date.now()
        };

        const updated = [urlData, ...recentUrls].slice(0, 10);
        setRecentUrls(updated);
        localStorage.setItem('recentUrls', JSON.stringify(updated));

        setLongUrl('');
      } else {
        showAlert(data.error || 'Failed to create short URL', 'error');
      }
    } catch (error) {
      showAlert('Network error. Please make sure the backend server is running on port 8001.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle analytics fetch
  const handleAnalytics = async (e) => {
    e.preventDefault();

    if (!analyticsId) {
      showToast('Please enter a short ID');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/url/analytics/${analyticsId}`);
      const data = await response.json();

      if (response.ok) {
        setAnalyticsData(data);
      } else {
        showToast('Short ID not found');
        setAnalyticsData(null);
      }
    } catch (error) {
      showToast('Failed to fetch analytics. Make sure the backend is running.');
      setAnalyticsData(null);
    }
  };

  // View analytics for a specific URL
  const viewAnalytics = (shortId) => {
    setAnalyticsId(shortId);
    // Trigger analytics fetch
    setTimeout(() => {
      fetch(`${API_BASE}/url/analytics/${shortId}`)
        .then(res => res.json())
        .then(data => setAnalyticsData(data))
        .catch(() => showToast('Failed to fetch analytics'));
    }, 100);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copied to clipboard!'))
      .catch(() => showToast('Failed to copy'));
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>✨ URL Shortener</h1>
          <p>Transform your links into elegant, shareable URLs with powerful analytics</p>
        </motion.header>

        {/* Main Grid */}
        <div className="main-grid">
          {/* URL Shortening Card */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="card-header">
              <div className="icon-wrapper">
                <Scissors size={24} color="white" />
              </div>
              <h2>Shorten URL</h2>
            </div>

            <AnimatePresence>
              {alert.show && (
                <motion.div
                  className={`alert alert-${alert.type}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  {alert.message}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleShorten}>
              <div className="form-group">
                <label htmlFor="longUrl" className="form-label">Enter your long URL</label>
                <input
                  type="url"
                  id="longUrl"
                  className="form-input"
                  placeholder="https://example.com/your-very-long-url-here"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Shorten URL
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {shortUrl && (
                <motion.div
                  className="result-box"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="result-label">Your Short URL</div>
                  <div className="result-content">
                    <div className="short-url">{shortUrl}</div>
                    <button className="btn btn-secondary" onClick={() => copyToClipboard(shortUrl)}>
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-header">
              <div className="icon-wrapper">
                <BarChart3 size={24} color="white" />
              </div>
              <h2>Analytics</h2>
            </div>

            <form onSubmit={handleAnalytics}>
              <div className="form-group">
                <label htmlFor="analyticsId" className="form-label">Enter Short ID</label>
                <input
                  type="text"
                  id="analyticsId"
                  className="form-input"
                  placeholder="e.g., aBc123XyZ"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <TrendingUp size={20} />
                View Analytics
              </button>
            </form>

            <AnimatePresence>
              {analyticsData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="stats-grid">
                    <motion.div
                      className="stat-card"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="stat-number">{analyticsData.totalClicks || 0}</div>
                      <div className="stat-label">Total Clicks</div>
                    </motion.div>
                    <motion.div
                      className="stat-card"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="stat-number">{analyticsData.analytics?.length || 0}</div>
                      <div className="stat-label">Total Visits</div>
                    </motion.div>
                  </div>

                  <div className="history-section">
                    <h3 className="history-header">
                      <Clock size={20} />
                      Visit History
                    </h3>
                    <div className="history-list">
                      {analyticsData.analytics && analyticsData.analytics.length > 0 ? (
                        [...analyticsData.analytics].reverse().map((visit, index) => (
                          <motion.div
                            key={index}
                            className="history-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <span className="visit-number">Visit #{analyticsData.analytics.length - index}</span>
                            <span className="timestamp">{formatDate(visit.timestamp)}</span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <div className="empty-icon">📭</div>
                          <div className="empty-text">No visits yet</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Recent URLs Card */}
          <motion.div
            className="glass-card card-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card-header">
              <div className="icon-wrapper">
                <Clock size={24} color="white" />
              </div>
              <h2>Recent URLs</h2>
            </div>

            <div className="url-list">
              {recentUrls.length > 0 ? (
                recentUrls.map((url, index) => (
                  <motion.div
                    key={url.shortId}
                    className="url-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => copyToClipboard(url.shortUrl)}
                  >
                    <div className="url-short-display">{url.shortUrl}</div>
                    <div className="url-original">{url.originalUrl}</div>
                    <div className="url-meta">
                      <span className="url-meta-item">
                        <Calendar size={14} />
                        {formatDate(url.createdAt)}
                      </span>
                      <span
                        className="url-meta-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewAnalytics(url.shortId);
                        }}
                      >
                        <BarChart3 size={14} />
                        View Analytics
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔗</div>
                  <div className="empty-text">No URLs shortened yet. Create your first short link above!</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 100 }}
          >
            <CheckCircle size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
