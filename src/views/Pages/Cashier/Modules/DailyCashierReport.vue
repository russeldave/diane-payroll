<template>
  <button
    @click="downloadExcel"
    :disabled="isProcessing"
    title="Download Daily Cashier Report Here!"
    class="bg-green-500 text-white px-4 py-2 rounded-r hover:opacity-70 focus:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <i class="fas fa-download"></i>
    <span v-if="isProcessing" class="ml-2 text-xs">Processing...</span>
  </button>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isProcessing = ref(false);

const downloadExcel = async () => {
  if (isProcessing.value) return; // avoid double clicks
  isProcessing.value = true;

  const url = `${VUE_APP_API_URL}ingredient-reports-download-excel/sales-per-cashier`;

  try {
    const response = await axios.get(url, {
      ...BearToken(token),
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "sales-per-cashier.xlsx";
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
