<template>
  <div class="relative">
    <!-- Drag and Drop Area -->
    <div
      class="relative"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div
        :class="[
          'flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100',
          isDragging ? 'border-blue-500 bg-blue-100' : '',
        ]"
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <i class="fas fa-file-excel text-4xl text-gray-500 mb-4"></i>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">XLSX or XLS (MAX. 10MB)</p>
        </div>
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".xlsx, .xls, .csv"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Selected File Display -->
    <div v-if="selectedFile" class="mt-4 p-4 bg-gray-100 rounded">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-file-excel text-green-500 mr-2"></i>
          <span class="text-sm font-medium">{{ selectedFile.name }}</span>
        </div>
        <button @click="removeFile" class="text-red-500 hover:text-red-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Loading Progress Bar -->
    <div v-if="isUploading" class="mb-4">
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <p class="text-sm text-center mt-2 text-gray-600">
        Uploading... {{ uploadProgress }}%
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Alert } from "@/views/Utility/Helper";

const emit = defineEmits(['file-selected', 'file-removed', 'upload-progress']);
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB default
  }
});

const fileInput = ref(null);
const isDragging = ref(false);
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);

const triggerFileInput = () => {
  fileInput.value.click();
};

const validateFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
  ];

  if (!validTypes.includes(file.type)) {
    Alert("error", "Error", "Please upload only Excel files (.xlsx or .xls)");
    return false;
  }

  if (file.size > props.maxFileSize) {
    Alert("error", "Error", `File size should not exceed ${props.maxFileSize / (1024 * 1024)}MB`);
    return false;
  }

  return true;
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
    emit('file-selected', file);
  }
  event.target.value = ''; // Reset input
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
    emit('file-selected', file);
  }
};

const removeFile = () => {
  selectedFile.value = null;
  uploadProgress.value = 0;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('file-removed');
};

// Method to update upload progress
const updateProgress = (progress) => {
  uploadProgress.value = progress;
  isUploading.value = progress > 0 && progress < 100;
  emit('upload-progress', progress);
};

// Expose methods to parent component
defineExpose({
  removeFile,
  updateProgress
});
</script> 