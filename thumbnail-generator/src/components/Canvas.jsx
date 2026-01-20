import React, { forwardRef, useRef } from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import './Canvas.css';

const Canvas = forwardRef(({ image, textSettings, scale = 1 }, ref) => {
    const textRef = useRef(null);

    return (
        <div className="canvas-wrapper">
            <div
                className="canvas-container"
                id="thumbnail-canvas"
                ref={ref}
                style={{ transform: `scale(${scale})` }}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Thumbnail Background"
                        className="canvas-bg"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <p>Ready to Design</p>
                            <span>Upload an image or fetch from YouTube to start</span>
                        </div>
                    </div>
                )}

                {textSettings.isFullOverlay && (
                    <div className="full-screen-overlay" />
                )}

                {textSettings.text && (
                    <Draggable nodeRef={textRef} bounds="parent" defaultPosition={{ x: 64, y: 300 }} scale={scale}>
                        <div
                            ref={textRef}
                            className={clsx("text-layer", { 'has-bg': textSettings.hasBackground })}
                            style={{
                                color: textSettings.color,
                                fontSize: `${textSettings.fontSize}px`,
                                fontFamily: textSettings.fontFamily,
                                textAlign: textSettings.textAlign,
                            }}
                        >
                            {textSettings.text}
                        </div>
                    </Draggable>
                )}
            </div>
        </div>
    );
});

export default Canvas;
