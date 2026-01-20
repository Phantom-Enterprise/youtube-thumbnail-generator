import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';

function App() {
  const canvasRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textSettings, setTextSettings] = useState({
    text: 'YOUR TITLE HERE',
    fontSize: 80,
    color: '#ffffff',
    hasBackground: true,
    isFullOverlay: false,
    fontFamily: 'Inter',
    textAlign: 'center'
  });

  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleYoutubeFetch = (url) => {
    const id = extractYoutubeId(url);
    if (id) {
      // Use a proxy or high res link
      setBackgroundImage(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
    } else {
      alert('Invalid YouTube URL');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [scale, setScale] = useState(1);
  const containerRef = useRef(null); // Reference to the wrapper div

  // Auto-scale canvas
  React.useEffect(() => {
    const handleResize = () => {
      // 320px is sidebar width, 64px is padding
      const availableWidth = window.innerWidth - 320 - 64;
      const availableHeight = window.innerHeight - 64;

      const scaleX = availableWidth / 1280;
      const scaleY = availableHeight / 720;

      // Fit containment
      const newScale = Math.min(scaleX, scaleY, 1); // Never scale up > 1 for UI (optional)
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      // Create a temporary clone to export without scale transform
      // But html-to-image handles style props well.
      // Easiest is to ask toPng for width/height 1280x720
      // AND explicitly force the transform to 'none' in the style block

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        width: 1280,
        height: 720,
        style: {
          transform: 'none', // Reset scale for export
          transformOrigin: 'top left'
        }
      });
      const link = document.createElement('a');
      link.download = 'thumbnail-generated.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Could not export image. Try uploading a local image instead.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar
        settings={textSettings}
        updateSettings={(newSettings) => setTextSettings({ ...textSettings, ...newSettings })}
        onImageUpload={handleImageUpload}
        onYoutubeFetch={handleYoutubeFetch}
        onDownload={handleDownload}
      />
      <Canvas
        ref={canvasRef}
        image={backgroundImage}
        textSettings={textSettings}
        scale={scale}
      />
    </div>
  );
}

export default App;
