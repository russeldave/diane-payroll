<template>
  <div class="bg-white p-6 rounded-lg h-full">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-bold"></h1>
      <div class="flex items-center gap-2">
        <select
          v-model="selectedType"
          class="border rounded p-2 text-xs md:text-sm"
          @change.prevent="loadChart"
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

        <canvas
          v-if="chartData?.labels?.length > 0 && !loading"
          :id="chartId"
          ref="chartRef"
        ></canvas>

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
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FormDx, BearToken, handleApiError, moneyFormatter } from "@/views/Utility/Helper";
import { VUE_APP_API_URL } from "@/views/Utility/Global";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartId = "popular-items-chart";
const chartRef = ref(null);
const chartInstance = ref(null);

const selectedType = ref("2");
const loading = ref(false);
const token = localStorage.getItem("token");
const chartData = ref({ labels: [], quantities: [], backgroundColors: [] });

const getInventoryData = async () => {
  try {
    loading.value = true;
    const formData = FormDx({ type: selectedType.value });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-analytics/real-time-top-seller-menu-sales`,
      formData,
      BearToken(token)
    );

    chartData.value = response.data;
  } catch (error) {
    handleApiError(error);
    chartData.value = { labels: [], quantities: [], backgroundColors: [] };
  } finally {
    loading.value = false;
  }
};

const createChart = () => {
  const ctx = document.getElementById(chartId);
  if (!ctx || !chartData.value.labels?.length) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  chartInstance.value = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: "Items Sold",
          data: chartData.value.quantities,
          backgroundColor: chartData.value.backgroundColors,
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Most Popular Items",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantity Sold",
          },
        },
        y: {
          title: {
            display: true,
            text: "Menu Items",
          },
          ticks: {
            callback: function(value) {
              const label = this.getLabelForValue(value);
              return label.length > 20 ? label.substr(0, 20) + '...' : label;
            }
          }
        },
      },
    },
  });
};

const loadChart = async () => {
  await getInventoryData();
  createChart();
};

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
