<template>
  <button
    @click.prevent="openUploadModal()"
    type="button"
    :class="[
      'bg-emerald-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-brain"></i>
    Upload Utak Inventory
  </button>

  <!-- Upload Modal -->
  <Modal
    :show="isUploadModalOpen"
    :maxWidth="'2xl'"
    title="Upload Utak Inventory"
    @close="isUploadModalOpen = false"
  >
    <div class="p-6">
      <form
        @submit.prevent="uploadUtakInventory()"
        autocomplete="off"
        v-if="!isUploadError"
      >
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
      <div class="block" v-else>
        <div class="flex justify-between gap-6">
          <label class="text-red-500"
            >Failed to Upload Ingredients Please see table below:</label
          >
          <button
            type="button"
            @click.prevent="reuploadUtak()"
            class="px-4 py-2 text-white rounded flex items-center bg-red-500 hover:bg-red-600"
          >
            <i class="fas fa-upload mr-2"></i>
            Reupload Again
          </button>
        </div>
        <div class="flex w-full overflow-auto mt-4">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid border-yellow-500">
                <th
                  scope="col"
                  class="px-2 py-2 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Ingredient
                </th>
                <th
                  scope="col"
                  class="px-2 py-2 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Deduct
                </th>
                <th
                  scope="col"
                  class="px-2 py-2 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Row
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
              <!-- Loop through products and display them -->
              <tr
                v-for="ing in incompleteIngredients"
                class="hover:bg-gray-200"
                v-if="incompleteIngredients?.length > 0"
                :key="ing.id"
              >
                <td class="px-2 py-2 border">{{ ing.ingredient }}</td>
                <td class="px-2 py-2 border text-right">{{ ing.deduct ?? 0 }}</td>
                <td class="px-2 py-2 border text-right">{{ ing.row ?? 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import ExcelUpload from "@/views/Component/ExcelUpload.vue";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
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
const isUploadError = ref(false);
const incompleteIngredients = ref([]);

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

const reuploadUtak = () => {
  isUploading.value = false;
  isUploadError.value = false;
  incompleteIngredients.value = [];
  if (excelUpload.value) {
    excelUpload.value.removeFile();
  }
};

const uploadUtakInventory = async () => {
  if (!selectedFile.value) return;

  try {
    isUploading.value = true;

    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const response = await axios.post(
      `${VUE_APP_API_URL}menus-excel/upload-utak-inventory`,
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
    console.log(error);
    if (error.response.data.uploadError) {
      isUploadError.value = error.response.data.uploadError;
      incompleteIngredients.value = isUploadError.value
        ? error.response.data.ingredients
        : [];
    }
    isUploading.value = false;
    if (excelUpload.value) {
      excelUpload.value.removeFile();
    }
  } finally {
    isUploading.value = false;
    if (excelUpload.value) {
      excelUpload.value.removeFile();
    }
  }
};
</script>
