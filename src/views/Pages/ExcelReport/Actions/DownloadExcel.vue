<template>
  <button
    @click="downloadExcel"
    :disabled="isProcessing"
    :title="`Download ${titleText}`"
    class="flex items-center justify-center gap-2 font-semibold text-sm md:text-base py-2.5 px-5 rounded-lg shadow-md transition-all duration-150 ease-in-out"
    :class="isProcessing
      ? 'bg-gray-400 text-white cursor-not-allowed'
      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'"
  >
    <svg
      v-if="isProcessing"
      class="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
      />
    </svg>

    <template v-else>
      <i class="fas fa-file-excel"></i>
      <span>Download</span>
    </template>
  </button>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { BearToken, FormDx } from "@/views/Utility/Helper";
import { VUE_APP_API_URL } from "@/views/Utility/Global";

const props = defineProps({
  reportType: { type: String, required: true },
  data: { type: [Object, Array], default: () => ({}) },
});

const emit = defineEmits(["processing"]);

const token = localStorage.getItem("token");
const isProcessing = ref(false);
const baseURL = import.meta.env.VITE_API_URL || VUE_APP_API_URL;

// ✅ Dynamic title
const titleText = computed(() => {
  switch (props.reportType) {
    case "mrf":
      return "MRF (Issued & Releasing) Report";
    case "direct-receiving":
      return "Direct Receiving Report";
    case "pr-receiving":
      return "PR Receiving Report";
    default:
      return "Excel Report";
  }
});

// ✅ Dynamic endpoint
const endpoint = computed(() => {
  switch (props.reportType) {
    case "mrf":
      return { method: "POST", url: "mrfs/excel-mrf-items-completeds" };
    case "direct-receiving":
      return {
        method: "GET",
        url: `ingredient-reports-auth/download-excel-direct-receiving/${props.data.type}/${props.data.date_from}/${props.data.date_to}`,
      };
    case "pr-receiving":
      return {
        method: "GET",
        url: `ingredient-reports-auth/download-excel-pr-receiving/${props.data.type}/${props.data.date_from}/${props.data.date_to}`,
      };
    default:
      return { method: "POST", url: "reports/excel-generic" };
  }
});

// ✅ Main download logic
const downloadExcel = async () => {
  if (isProcessing.value) return;
  if (!token) {
    Swal.fire("Unauthorized", "Please log in again to download reports.", "warning");
    return;
  }

  isProcessing.value = true;
  emit("processing", true);

  try {
    const url = `${baseURL}${endpoint.value.url}`;
    let response;

    if (endpoint.value.method === "POST") {
      const formData = FormDx(props.data);
      response = await axios.post(url, formData, {
        ...BearToken(token),
        responseType: "blob",
      });
    } else {
      response = await axios.get(url, {
        ...BearToken(token),
        responseType: "blob",
      });
    }

    // ✅ Create Excel file
    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const from = props.data.date_from || "NoDate";
    const to = props.data.date_to || "NoDate";
    const fileName = `${titleText.value.replace(/\s+/g, "_")}_${from}_to_${to}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download error:", err);
    const message = err.response?.data?.message || "There was a problem downloading the report.";
    Swal.fire("Download Failed", message, "error");
  } finally {
    isProcessing.value = false;
    emit("processing", false);
  }
};
</script>
