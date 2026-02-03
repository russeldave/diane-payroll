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
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FormDx, BearToken, handleApiError, moneyFormatter } from "@/views/Utility/Helper";
import { VUE_APP_API_URL } from "@/views/Utility/Global";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartId = "revenue-trend-chart";
const chartRef = ref(null);
const chartInstance = ref(null);

const selectedType = ref("2");
const loading = ref(false);
const token = localStorage.getItem("token");
const chartData = ref({ labels: [], datasets: [] });

const getChartData = async () => {
  try {
    loading.value = true;
    const formData = FormDx({ type: selectedType.value });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-analytics/real-time-revenue-trends`,
      formData,
      BearToken(token)
    );

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    chartData.value = {
      labels: response.data.labels || [],
      datasets: response.data.dataSets || []
    };
  } catch (error) {
    handleApiError(error);
    chartData.value = { labels: [], datasets: [] };
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
    type: "line",
    data: {
      labels: chartData.value.labels,
      datasets: chartData.value.datasets.map(dataset => ({
        ...dataset,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `${context.dataset.label}: ${moneyFormatter(value)}`;
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Revenue (PHP)",
          },
          ticks: {
            callback: function (value) {
              return moneyFormatter(value);
            },
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
    },
  });
};

const loadChart = async () => {
  await getChartData();
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
