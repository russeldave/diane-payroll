<template>
  <div class="flex justify-start items-center gap-2">
    <button
      @click="scaleUp"
      class="bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      title="Scale Up"
      aria-label="Scale Up"
    >
      <i class="fas fa-search-plus"></i>
    </button>
    <button
      @click="scaleDown"
      class="bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      title="Scale Down"
      aria-label="Scale Down"
    >
      <i class="fas fa-search-minus"></i>
    </button>
    <button
      @click="resetScale"
      class="bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      title="Reset Scale"
      aria-label="Reset Scale"
    >
      <i class="fas fa-undo"></i>
    </button>
    <button
      @click="toggleFullscreen"
      class="bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
      :aria-label="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
    >
      <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
    </button>
    <div class="bg-white text-gray-800 px-2 py-1 rounded text-sm font-bold shadow-lg">
      {{ Math.round(currentScale * 100) }}%
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentScale = ref(1);
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const SCALE_STEP = 0.1;
const isFullscreen = ref(false);

// Get the main content wrapper
const getContentWrapper = () => {
  return document.querySelector('#app > div');
};

// Apply scale to the content wrapper
const applyScale = (scale) => {
  const wrapper = getContentWrapper();
  if (wrapper) {
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'top center';
    wrapper.style.width = `${100 / scale}%`;
    wrapper.style.height = `${100 / scale}%`;
    wrapper.style.position = 'relative';
    wrapper.style.left = `${(100 - 100 / scale) / 2}%`;
    const baseFontSize = 16;
    document.documentElement.style.fontSize = `${baseFontSize * scale}px`;
  }
};

// Scale up function
const scaleUp = () => {
  if (currentScale.value < MAX_SCALE) {
    currentScale.value = Math.min(currentScale.value + SCALE_STEP, MAX_SCALE);
    applyScale(currentScale.value);
    saveScalePreference();
  }
};

// Scale down function
const scaleDown = () => {
  if (currentScale.value > MIN_SCALE) {
    currentScale.value = Math.max(currentScale.value - SCALE_STEP, MIN_SCALE);
    applyScale(currentScale.value);
    saveScalePreference();
  }
};

// Reset scale function
const resetScale = () => {
  currentScale.value = 1;
  applyScale(currentScale.value);
  saveScalePreference();
};

// Save scale preference to localStorage
const saveScalePreference = () => {
  localStorage.setItem('pageScale', currentScale.value.toString());
};

// Load scale preference from localStorage
const loadScalePreference = () => {
  const savedScale = localStorage.getItem('pageScale');
  if (savedScale) {
    currentScale.value = parseFloat(savedScale);
    applyScale(currentScale.value);
  }
};

// Toggle fullscreen mode
const toggleFullscreen = () => {
  const wrapper = getContentWrapper();
  if (!wrapper) return;

  if (!isFullscreen.value) {
    if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen().catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  }
};

// Handle fullscreen change events
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Handle keyboard shortcuts
const handleKeyPress = (event) => {
  // Ctrl + Plus for scale up
  if (event.ctrlKey && event.key === '+') {
    event.preventDefault();
    scaleUp();
  }
  // Ctrl + Minus for scale down
  else if (event.ctrlKey && event.key === '-') {
    event.preventDefault();
    scaleDown();
  }
  // Ctrl + 0 for reset scale
  else if (event.ctrlKey && event.key === '0') {
    event.preventDefault();
    resetScale();
  }
  // F11 or Ctrl + F for fullscreen toggle
  else if (event.key === 'F11' || (event.ctrlKey && event.key.toLowerCase() === 'f')) {
    event.preventDefault();
    toggleFullscreen();
  }
};

onMounted(() => {
  loadScalePreference();
  window.addEventListener('keydown', handleKeyPress);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style scoped>
/* Add smooth transition for scale */
#app > div {
  transition: all 0.2s ease-in-out;
}

/* Ensure proper scaling of text */
:deep(*) {
  transform-origin: top left;
}
</style>