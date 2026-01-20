# Implementation Plan - High-Fidelity YouTube Thumbnail Generator

We will build a modern, premium React application for creating YouTube thumbnails. The app will feature a sleek, "dark mode" aesthetic with glassmorphism elements, ensuring a high-fidelity user experience.

## User Requirements
- **Core Tech**: React (Vite)
- **Input Methods**:
    - Upload custom image
    - Use YouTube Video URL (auto-fetch thumbnail)
- **Overlay**:
    - Stylized text
    - 75% Black Background (behind text)
    - Draggable and Resizable text
- **Aesthetic**: High-fidelity, premium custom design.

## Proposed Architecture

### 1. Project Structure
- **Framework**: Vite + React
- **Styling**: Vanilla CSS (CSS Variables + Scoped Modules for performance and clean architecture).
- **Icons**: `lucide-react`
- **Utils**: `clsx` (for class toggling), `html-to-image` (for export), `react-draggable` (for interaction).

### 2. Core Components
- **`Layout`**: Main responsive container with dark theme background.
- **`Workspace`**: The central canvas area (1280x720 aspect ratio locked).
- **`Sidebar`**: Controls for:
    - Image Source (Tabbed: Upload / URL)
    - Text Controls (Content, Size, Color, Bg toggle)
    - Export Button
- **`Canvas`**: The rendering surface.
    - layers: `Background Image` -> `Overlay Dim` (optional) -> `Text Layer` (Draggable).

### 3. Key Features Implementation
- **YouTube Fetch**: Extract video ID from URL -> Construct `maxresdefault` URL.
    - *Note*: We will handle CORS for export by using a proxy strategy or `crossOrigin="anonymous"` where supported.
- **Draggable Text**: Use `react-draggable` to allow free movement of the text block over the preview.
- **Styling**:
    - **Glassmorphism**: Backdrop-filter blur, semi-transparent whites/blacks.
    - **Typography**: `Inter` or `Outfit` (Google Fonts).

## Step-by-Step Implementation

### Phase 1: Setup & Foundation
- [ ] Initialize Vite React project in `thumbnail-generator`.
- [ ] Install dependencies (`lucide-react`, `react-draggable`, `html-to-image`).
- [ ] Set up global CSS (Colors, Typography, Reset).

### Phase 2: Core UI (Non-Functional)
- [ ] Create `Sidebar` with high-fidelity glass styling.
- [ ] Create `Canvas` container with 16:9 aspect ratio preservation.
- [ ] Implement responsive layout.

### Phase 3: Functionality
- [ ] **Image Handling**: Implement File Reader for uploads and URL parser for YouTube.
- [ ] **Text State**: Manage text content, position, and style (Video Title style).
- [ ] **Interactivity**: Integrate `react-draggable` for the text layer.

### Phase 4: Polish & Export
- [ ] Add "Download" functionality using `html-to-image`.
- [ ] Add micro-interactions (hover states, transitions).
- [ ] Final Design Review (Spacing, Colors).

## File Structure
```
thumbnail-generator/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Canvas.jsx
│   │   ├── Controls.jsx
│   │   └── ui/ (Button, Input, Slider)
│   ├── hooks/
│   │   └── useImageLoader.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css (Global Variables)
```
