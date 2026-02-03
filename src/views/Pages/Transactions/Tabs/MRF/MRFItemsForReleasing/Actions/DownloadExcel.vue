<template>
  <button
    @click="downloadExcel"
    :disabled="isProcessing"
    title="Download MRF Releasing Report Here!"
    class="bg-purple-500 ml-2 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 float-end text-nowrap"
  >
    <i class="fas fa-download"></i> Download
    <span v-if="isProcessing" class="ml-2 text-xs">Processing...</span>
  </button>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { BearToken, FormDx } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isProcessing = ref(false);
const props = defineProps({
  data: Object,
});

const downloadExcel = async () => {
  if (isProcessing.value) return; // avoid double clicks
  isProcessing.value = true;

  try {
    const formData = FormDx(props.data);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}mrf-download-excel/mrf-released`,
      formData,
      {
        ...BearToken(token),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "mrf_released.xlsx";
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download error:", err);
    Swal.fire("Download Failed", "There was a problem downloading the report.", "error");
  } finally {
    isProcessing.value = false;
  }
};
</script>