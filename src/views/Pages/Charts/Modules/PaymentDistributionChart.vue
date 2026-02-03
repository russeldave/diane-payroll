<template>
  <div class="bg-white p-6 rounded-lg  h-full">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-bold"></h1>
      <div class="flex items-center gap-2">
        <select
          v-model="selectedType"
          class="border rounded p-2 text-xs md:text-sm"
          :disabled="loading"
        >
          <option value="" disabled>Select Type</option>
          <option value="1">Hourly</option>
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>
        <button
          @click="loadChart"
          title="Refresh"
          type="button"
          class="bg-blue-500 text-white font-semibold py-2 px-2 rounded text-xs md:text-sm"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div class="chart-container py-2">
      <div class="flex items-center justify-center h-full">
        <div
          v-if="loading"
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"
        ></div>

        <canvas v-if="chartData?.values?.length > 0 && !loading" :id="chartId"></canvas>

        <div v-else-if="!loading" class="text-center text-gray-500">
          <p>No data available</p>
        </div>
      </div>

      <p class="text-right text-nowrap mt-2" v-if="chartData">
        Grand Total: <b>{{ moneyFormatter(chartData.grandTotal ?? 0) }}</b>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import axios from "axios";

import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  BearToken,
  handleApiError,
  FormDx,
  moneyFormatter,
} from "@/views/Utility/Helper";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Filler);

const chartId = "inventory-chart";
const chartRef = ref(null); // Canvas element
const chartInstance = ref(null); // Chart.js instance

const selectedType = ref("2");
const loading = ref(false);
const token = localStorage.getItem("token");
const chartData = ref({ labels: [], values: [], backgroundColors: [] });

const getInventoryData = async () => {
  try {
    loading.value = true;
    const formData = FormDx({ type: selectedType.value });
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-analytics/real-time-payment-methods`,
      formData,
      BearToken(token)
    );
    chartData.value = response.data;
  } catch (error) {
    handleApiError(error);
    chartData.value = { labels: [], values: [], backgroundColors: [] };
  } finally {
    loading.value = false;
  }
};

const loadChart = async () => {
  await getInventoryData();

  // Destroy previous chart if exists
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  createChart();
};

const createChart = () => {
  const ctx = document.getElementById(chartId);
  if (!ctx || !chartData.value.labels?.length) return;

  chartInstance.value = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          data: chartData.value.values,
          backgroundColor: chartData.value.backgroundColors,
          borderColor: chartData.value.backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
};

// Auto refresh chart on type change
watch(selectedType, () => {
  loadChart();
});

onMounted(() => {
  loadChart();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
.h-full {
  height: 100%;
}
</style>
