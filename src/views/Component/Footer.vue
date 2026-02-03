<template>
  <footer class="bg-white border-t border-gray-200 py-4 mt-auto">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-sm text-gray-600">
          © {{ new Date().getFullYear() }} Tancor Point of Sales. All rights reserved.
        </div>
        <div class="flex items-center space-x-4 mt-2 md:mt-0">
          <span class="text-sm text-gray-600">Version 1.0.0</span>
          <span class="text-sm text-gray-600">|</span>
          <span class="text-sm text-gray-600">Online Status: <span :class="isOnline ? 'text-green-500' : 'text-red-500'">{{ isOnline ? 'Connected' : 'Offline' }}</span></span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script> 