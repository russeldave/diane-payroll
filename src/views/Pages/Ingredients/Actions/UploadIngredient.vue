<template>
  <button
    @click.prevent="openUploadModal()"
    type="button"
    :class="[
      'bg-green-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-file-excel"></i>
    Upload Excel
  </button>

  <!-- Upload Modal -->
  <Modal
    :show="isUploadModalOpen"
    :maxWidth="'xl'"
    title="Upload Ingredient Inventory Excel"
    @close="isUploadModalOpen = false"
  >
    <div class="p-6">
      <form @submit.prevent="uploadExcel()" autocomplete="off">
        <!-- File Upload Section -->
        <div class="mb-6">
          <ExcelUpload
            ref="excelUpload"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
            @upload-progress="handleUploadProgress"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="isUploadModalOpen = false"
            :disabled="isUploading"
            class="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!selectedFile || isUploading"
            :class="[
              'px-4 py-2 text-white rounded flex items-center',
              selectedFile && !isUploading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed',
            ]"
          >
            <i
              :class="[isUploading ? 'fas fa-spinner fa-spin' : 'fas fa-upload']"
              class="mr-2"
            ></i>
            {{ isUploading ? "Uploading..." : "Upload" }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import ExcelUpload from "@/views/Component/ExcelUpload.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});

const isUploadModalOpen = ref(false);
const selectedFile = ref(null);
const excelUpload = ref(null);
const isUploading = ref(false);

const openUploadModal = () => {
  isUploadModalOpen.value = true;
};

const handleFileSelected = (file) => {
  selectedFile.value = file;
};

const handleFileRemoved = () => {
  selectedFile.value = null;
};

const handleUploadProgress = (progress) => {
  isUploading.value = progress > 0 && progress < 100;
};

const uploadExcel = async () => {
  if (!selectedFile.value) return;

  try {
    isUploading.value = true;

    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const response = await axios.post(
      `${VUE_APP_API_URL}menus-excel/upload-ingredients`,
      formData,
      BearToken(token),
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (excelUpload.value) {
            excelUpload.value.updateProgress(percentCompleted);
          }
        },
      }
    );

    if (response.data) {
      if (excelUpload.value) {
        excelUpload.value.updateProgress(100);
      }
      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert("success", "Success", response.data.message);
      isUploadModalOpen.value = false;
      emits("transaction_id", Math.random());
      if (excelUpload.value) {
        excelUpload.value.removeFile();
      }
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    isUploading.value = false;
    if (excelUpload.value) {
      excelUpload.value.removeFile();
    }
  }
};
</script>
