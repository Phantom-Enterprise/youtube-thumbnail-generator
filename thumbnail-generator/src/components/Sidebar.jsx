import React, { useState } from 'react';
import { Image, Type, Download, Youtube, Upload, Settings, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import clsx from 'clsx';
import './Sidebar.css';

export default function Sidebar({
  settings,
  updateSettings,
  onImageUpload,
  onYoutubeFetch,
  onDownload
}) {
  const [activeTab, setActiveTab] = useState('image');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleYoutubeSubmit = (e) => {
    e.preventDefault();
    onYoutubeFetch(youtubeUrl);
  };

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2>Custom YouTube Thumbnail Generator</h2>
      </div>

      <div className="sidebar-tabs">
        <button
          className={clsx('tab-btn', activeTab === 'image' && 'active')}
          onClick={() => setActiveTab('image')}
        >
          <Image size={18} />
          <span>Image</span>
        </button>
        <button
          className={clsx('tab-btn', activeTab === 'text' && 'active')}
          onClick={() => setActiveTab('text')}
        >
          <Type size={18} />
          <span>Text</span>
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'image' && (
          <div className="tool-section">
            <div className="input-group">
              <label>YouTube Link</label>
              <form onSubmit={handleYoutubeSubmit} className="url-form">
                <div className="icon-input">
                  <Youtube size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Paste Video URL..."
                    className="input-field"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary full-width">
                  Fetch Thumbnail
                </button>
              </form>
            </div>

            <div className="divider"><span>OR</span></div>

            <div className="input-group">
              <label>Upload Custom</label>
              <label className="file-upload-btn btn-secondary">
                <Upload size={16} />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  hidden
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="tool-section">
            <div className="input-group">
              <label>Overlay Text</label>
              <textarea
                className="input-field"
                rows={3}
                value={settings.text}
                onChange={(e) => updateSettings({ text: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Font Size ({settings.fontSize}px)</label>
              <input
                type="range"
                min="20"
                max="200"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                className="slider"
              />
            </div>

            <div className="input-group">
              <label>Text Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSettings({ color: e.target.value })}
                  className="color-input"
                />
                <span>{settings.color}</span>
              </div>
            </div>

            <div className="input-group">
              <label>Font Family</label>
              <select
                className="input-field"
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              >
                <option value="Inter">Inter (Sans)</option>
                <option value="Roboto">Roboto (Clean)</option>
                <option value="Oswald">Oswald (Bold)</option>
                <option value="Anton">Anton (Impact)</option>
                <option value="Lobster">Lobster (Script)</option>
                <option value="Playfair Display">Playfair (Serif)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Alignment</label>
              <div className="btn-group">
                <button
                  className={clsx('icon-btn', settings.textAlign === 'left' && 'active')}
                  onClick={() => updateSettings({ textAlign: 'left' })}
                >
                  <AlignLeft size={18} />
                </button>
                <button
                  className={clsx('icon-btn', settings.textAlign === 'center' && 'active')}
                  onClick={() => updateSettings({ textAlign: 'center' })}
                >
                  <AlignCenter size={18} />
                </button>
                <button
                  className={clsx('icon-btn', settings.textAlign === 'right' && 'active')}
                  onClick={() => updateSettings({ textAlign: 'right' })}
                >
                  <AlignRight size={18} />
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Text Background</label>
              <div className="checkbox-stack">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.hasBackground}
                    onChange={(e) => updateSettings({ hasBackground: e.target.checked })}
                  />
                  <span>Box Background</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.isFullOverlay}
                    onChange={(e) => updateSettings({ isFullOverlay: e.target.checked })}
                  />
                  <span>Full Screen Overlay</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-primary export-btn" onClick={onDownload}>
          <Download size={18} />
          <span>Export Thumbnail</span>
        </button>
      </div>
    </div>
  );
}
