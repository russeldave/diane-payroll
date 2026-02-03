<template>
  <div class="bg-white p-6 rounded-lg h-full">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-bold"></h1>
      <div class="flex items-center gap-2">
        <select
          v-model="selectedType"
          class="border rounded p-2 text-xs md:text-sm"
          :disabled="loading"
          @change="handleTypeChange"
        >
          <option value="0">All</option>
          <option value="1">Hourly</option>
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>

        <input
          v-if="selectedType === '1'"
          type="datetime-local"
          v-model="selectedDate"
          class="border rounded p-2 text-xs md:text-sm"
          @change="handleDateChange"
        />

        <input
          v-if="selectedType === '2'"
          type="date"
          v-model="selectedDate"
          class="border rounded p-2 text-xs md:text-sm"
          @change="handleDateChange"
        />

        <input
          v-if="selectedType === '3'"
          type="week"
          v-model="selectedDate"
          class="border rounded p-2 text-xs md:text-sm"
          @change="handleDateChange"
        />

        <input
          v-if="selectedType === '4'"
          type="month"
          v-model="selectedDate"
          class="border rounded p-2 text-xs md:text-sm"
          @change="handleDateChange"
        />

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

        <canvas v-if="chartData?.labels?.length > 0 && !loading" ref="chartRef"></canvas>

        <div v-else-if="!loading" class="text-center text-gray-500">
          <p>No data available</p>
        </div>
      </div>
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

import { FormDx, BearToken, handleApiError } from "@/views/Utility/Helper";
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

const chartRef = ref(null);
const chartInstance = ref(null);

const selectedType = ref("2");
const selectedDate = ref("");
const loading = ref(false);
const token = localStorage.getItem("token");
const chartData = ref({ labels: [], datasets: [] });

const handleTypeChange = () => {
  selectedDate.value = "";
  loadChart();
};

const handleDateChange = () => {
  loadChart();
};

const getChartData = async () => {
  try {
    loading.value = true;
    const formData = FormDx({
      type: selectedType.value,
      date: selectedDate.value,
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-analytics/filter-date-revenue-trends`,
      formData,
      BearToken(token)
    );

    console.log("API Response:", response.data);

    chartData.value = {
      labels: response.data.labels || [],
      datasets: response.data.datasets || [],
    };

    console.log("Chart Data:", chartData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
    handleApiError(error);
    chartData.value = { labels: [], datasets: [] };
  } finally {
    loading.value = false;
  }
};

const createChart = () => {
  console.log("Creating chart...");
  if (!chartRef.value) {
    console.error("Canvas ref not found");
    return;
  }

  if (chartInstance.value) {
    console.log("Destroying existing chart");
    chartInstance.value.destroy();
  }

  const chartConfig = {
    type: "line",
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Revenue Trend",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Revenue",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time Period",
          },
        },
      },
    },
  };

  console.log("Chart configuration:", chartConfig);

  try {
    chartInstance.value = new Chart(chartRef.value, chartConfig);
    console.log("Chart created successfully");
  } catch (error) {
    console.error("Error creating chart:", error);
  }
};

const loadChart = async () => {
  try {
    console.log("Loading chart...");
    await getChartData();
    setTimeout(() => {
      createChart();
    }, 100);
  } catch (error) {
    console.error("Error in loadChart:", error);
  }
};

onMounted(() => {
  loadChart();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  min-height: 300px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
