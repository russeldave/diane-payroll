<template>
  <div class="relative">
    <!-- Drag and Drop Area -->
    <div
      v-if="!hideDragArea"
      class="relative"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div
        :class="[
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400',
        ]"
        @click="triggerFileInput"
      >
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          accept="image/*"
          @change="handleFileSelect"
        />
        
        <div class="space-y-2">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
          <div class="text-sm text-gray-600">
            <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-else class="flex items-center justify-center space-x-2">
      <button
        type="button"
        @click="triggerFileInput"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <i class="fas fa-upload mr-2"></i>
        Upload Images
      </button>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        multiple
        accept="image/*"
        @change="handleFileSelect"
      />
    </div>

    <!-- Preview Section -->
    <div v-if="previewFiles.length > 0" class="mt-4">
      <!-- Grid View for Drag Area -->
      <div v-if="!hideDragArea" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(file, index) in previewFiles"
          :key="index"
          class="relative group"
        >
          <img
            :src="file.preview"
            class="w-full h-24 object-cover rounded-lg"
            alt="Preview"
          />
          <button
            type="button"
            @click.prevent="removeFile(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- List View for Button Upload -->
      <div v-else class="space-y-2">
        <div
          v-for="(file, index) in previewFiles"
          :key="index"
          class="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center space-x-3">
            <!-- <img
              :src="file.preview"
              class="w-12 h-12 object-cover rounded"
              alt="Preview"
            /> -->
            <div class="text-xs text-gray-600 truncate text-nowrap">
              {{ file.file.name }}
              <div class="text-xs text-gray-500">
                {{ formatFileSize(file.file.size) }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              type="button"
              @click.prevent="showImage(file.preview)"
              class="p-1 text-blue-600 hover:text-blue-700"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              type="button"
              @click.prevent="removeFile(index)"
              class="p-1 text-red-600 hover:text-red-700"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showPreview = false">
      <div class="max-w-4xl max-h-[90vh] p-4" @click.stop>
        <img :src="previewUrl" class="max-w-full max-h-[80vh] object-contain" alt="Preview" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['files-selected']);
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB default
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  hideDragArea: {
    type: Boolean,
    default: false
  }
});

const fileInput = ref(null);
const isDragging = ref(false);
const previewFiles = ref([]);
const showPreview = ref(false);
const previewUrl = ref('');

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const showImage = (url) => {
  previewUrl.value = url;
  showPreview.value = true;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const validateFile = (file) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  if (file.size > props.maxFileSize) {
    throw new Error(`File size should not exceed ${props.maxFileSize / (1024 * 1024)}MB`);
  }
  return true;
};

const createPreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
};

const handleFiles = async (files) => {
  try {
    const validFiles = Array.from(files).filter(file => {
      try {
        return validateFile(file);
      } catch (error) {
        console.warn(error.message);
        return false;
      }
    });

    if (validFiles.length + previewFiles.value.length > props.maxFiles) {
      throw new Error(`Maximum ${props.maxFiles} files allowed`);
    }

    const newPreviews = await Promise.all(
      validFiles.map(file => createPreview(file))
    );

    previewFiles.value = [...previewFiles.value, ...newPreviews];
    emit('files-selected', previewFiles.value.map(p => p.file));
  } catch (error) {
    console.error(error.message);
    // You can add your preferred error handling here (e.g., toast notification)
  }
};

const handleFileSelect = (event) => {
  handleFiles(event.target.files);
  event.target.value = ''; // Reset input
};

const handleDrop = (event) => {
  isDragging.value = false;
  handleFiles(event.dataTransfer.files);
};

const removeFile = (index) => {
  previewFiles.value.splice(index, 1);
  emit('files-selected', previewFiles.value.map(p => p.file));
};

// Cleanup preview URLs when component is unmounted
onUnmounted(() => {
  previewFiles.value.forEach(preview => {
    URL.revokeObjectURL(preview.preview);
  });
});
</script> 