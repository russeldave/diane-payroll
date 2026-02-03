<template>
  <button
    @click="uploadPRBehavior"
    class="bg-orange-500 hover:opacity-70 focus:bg-orange-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    Upload PR
  </button>

  <Modal :show="isUploadModalOpen" :maxWidth="'md'" title="Upload PR" @close="isUploadModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="uploadPR">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            Upload Purchase Request Files / Images
          </label>
          <input
            type="file"
            id="itemImages"
            @change="handleImageUpload"
            multiple
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            v-model="mrfForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");

// ✅ emits both transaction and uploaded_files
const emits = defineEmits(["transaction_id", "uploaded_files"]);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const isUploadModalOpen = ref(false);
const imageFiles = ref([]);
const mrfForm = ref({
  pr_id: 0,
  remarks: "",
});

const uploadPRBehavior = () => {
  mrfForm.value.pr_id = props.data.id;
  mrfForm.value.remarks = "";
  imageFiles.value = [];
  isUploadModalOpen.value = true;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const uploadPR = async () => {
  try {
    const formData = FormDx(mrfForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("pr_images[]", file); // ✅ renamed field
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}prs/upload-pr-images`, // ✅ renamed endpoint
      formData,
      BearToken(token)
    );

    isUploadModalOpen.value = false;
    Alert("success", "Success", response.data.message);

    // ✅ Emit to parent (ImageButton.vue)
    emits("uploaded_files", response.data.files || []);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};
</script>
