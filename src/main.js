const THUMB_WIDTH = 1280;
const THUMB_HEIGHT = 720;

const imageUpload = document.getElementById("imageUpload");
const youtubeUrl = document.getElementById("youtubeUrl");
const fetchButton = document.getElementById("fetchButton");
const previewImage = document.getElementById("previewImage");
const renderCanvas = document.getElementById("renderCanvas");
const downloadButton = document.getElementById("downloadButton");
const errorMessage = document.getElementById("errorMessage");
const status = document.getElementById("status");
const overlayText = document.getElementById("overlayText");

const ctx = renderCanvas.getContext("2d");
let currentImage = null;

const setStatus = (message) => {
  status.textContent = message;
};

const setError = (message) => {
  errorMessage.textContent = message;
  if (message) {
    errorMessage.classList.add("error--visible");
  } else {
    errorMessage.classList.remove("error--visible");
  }
};

const setPreview = (dataUrl) => {
  previewImage.src = dataUrl;
  downloadButton.disabled = false;
};

const clearPreview = () => {
  previewImage.removeAttribute("src");
  downloadButton.disabled = true;
  currentImage = null;
};

const extractVideoId = (urlString) => {
  try {
    const url = new URL(urlString);
    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "");
    }

    if (url.hostname.includes("youtube.com")) {
      const idFromQuery = url.searchParams.get("v");
      if (idFromQuery) {
        return idFromQuery;
      }

      const pathMatch = url.pathname.match(/\/embed\/(.+)$/);
      if (pathMatch) {
        return pathMatch[1];
      }
    }
  } catch (error) {
    return null;
  }

  return null;
};

const drawCoverImage = (image) => {
  ctx.clearRect(0, 0, THUMB_WIDTH, THUMB_HEIGHT);

  const imageRatio = image.width / image.height;
  const thumbRatio = THUMB_WIDTH / THUMB_HEIGHT;

  let drawWidth = THUMB_WIDTH;
  let drawHeight = THUMB_HEIGHT;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > thumbRatio) {
    drawHeight = THUMB_HEIGHT;
    drawWidth = drawHeight * imageRatio;
    offsetX = (THUMB_WIDTH - drawWidth) / 2;
  } else {
    drawWidth = THUMB_WIDTH;
    drawHeight = drawWidth / imageRatio;
    offsetY = (THUMB_HEIGHT - drawHeight) / 2;
  }

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};

const drawTextOverlay = (text) => {
  if (!text) {
    return;
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return;
  }

  const maxWidth = THUMB_WIDTH * 0.9;
  let fontSize = 96;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(15, 23, 42, 0.85)";
  ctx.lineWidth = 6;

  const longestLine = lines.reduce((longest, line) =>
    line.length > longest.length ? line : longest,
  "");

  while (fontSize > 36) {
    ctx.font = `700 ${fontSize}px \"Inter\", sans-serif`;
    if (ctx.measureText(longestLine).width <= maxWidth) {
      break;
    }
    fontSize -= 4;
  }

  const lineHeight = fontSize * 1.15;
  const totalHeight = lineHeight * lines.length;
  const startY = THUMB_HEIGHT / 2 - totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.strokeText(line, THUMB_WIDTH / 2, y);
    ctx.fillText(line, THUMB_WIDTH / 2, y);
  });
};

const renderThumbnail = (message = "Preview ready.") => {
  if (!currentImage) {
    return;
  }

  drawCoverImage(currentImage);
  drawTextOverlay(overlayText.value);
  const dataUrl = renderCanvas.toDataURL("image/jpeg", 0.92);
  setPreview(dataUrl);
  setStatus(message);
  setError("");
};

const updateFromImage = (image) => {
  currentImage = image;
  renderThumbnail();
};

const loadImageFromSource = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image failed to load."));
    image.src = src;
  });

const handleUpload = async (file) => {
  if (!file) {
    setError("Please select an image file.");
    setStatus("Waiting for input…");
    clearPreview();
    return;
  }

  setStatus("Processing image…");

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const image = await loadImageFromSource(event.target.result);
      updateFromImage(image);
    } catch (error) {
      setError("Unable to process that image.");
      setStatus("Waiting for input…");
      clearPreview();
    }
  };
  reader.readAsDataURL(file);
};

const fetchThumbnail = async () => {
  const urlValue = youtubeUrl.value.trim();
  const videoId = extractVideoId(urlValue);

  if (!videoId) {
    setError("Enter a valid YouTube URL.");
    setStatus("Waiting for input…");
    clearPreview();
    return;
  }

  setStatus("Fetching YouTube thumbnail…");
  setError("");

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    const image = await loadImageFromSource(thumbnailUrl);
    updateFromImage(image);
  } catch (error) {
    setError("Thumbnail could not be loaded. Try a different video URL.");
    setStatus("Waiting for input…");
    clearPreview();
  }
};

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    youtubeUrl.value = "";
  }
  handleUpload(file);
});

fetchButton.addEventListener("click", () => {
  if (youtubeUrl.value.trim()) {
    imageUpload.value = "";
  }
  fetchThumbnail();
});

overlayText.addEventListener("input", () => {
  if (currentImage) {
    renderThumbnail("Preview updated.");
  }
});

youtubeUrl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchThumbnail();
  }
});

downloadButton.addEventListener("click", () => {
  const dataUrl = renderCanvas.toDataURL("image/jpeg", 0.92);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "youtube-thumbnail.jpg";
  link.click();
});
