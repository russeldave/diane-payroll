<template>
  <div class="bg-white p-6 rounded-lg  h-full">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-bold"></h1>
      <div class="flex items-center gap-2">
        <div>
          <SearchDropdown
            apiEndpoint="buffets/dishes-list"
            :searchModel="searchDish"
            :key="filterChart.menu_ids?.length"
            placeholder="Select Dish"
            itemLabel="name"
            itemId="id"
            inputId="menuName"
            formatLabel="dashed"
            className="border rounded p-2 text-xs md:text-sm"
            @item-selected="(data) => fillDishName(data)"
            dataKey="menus"
            returnName="['id','dishesName']"
          />
        </div>
        <select
          v-model="filterChart.type"
          @change="loadChart"
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

    <!-- Show selected dishes with remove buttons -->
    <div class="mb-2 flex flex-wrap gap-2">
      <span
        v-for="(menu, index) in filterChart.menu_ids"
        :key="menu.id"
        class="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
      >
        {{ menu.dishesName }}
        <button @click="removeDish(index)" class="text-red-500 font-bold">&times;</button>
      </span>
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
          <p>
            Please select dish for
            <b class="text-red-500">menu sales comparison</b>
            maximum five(5) menus.
          </p>
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
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, handleApiError, FormDx, moneyFormatter } from "@/views/Utility/Helper";
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
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

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

const chartId = ref("menu-comparison-chart");
const chartRef = ref(null);
const chartInstance = ref(null);
const loading = ref(false);
const token = localStorage.getItem("token");
const chartData = ref({ labels: [], dataSets: [], menus: [] });

const MENU_IDS_KEY = "saved_menu_ids";

const filterChart = ref({
  type: 2,
  menu_ids: [], // Stores [{ id: 123, dishesName: 'Pizza' }]
});

const searchDish = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
});

// Add dish
const fillDishName = (item) => {
  if (!item?.dishId || !item?.dishesName) return;

  if (filterChart.value.menu_ids.some((d) => d.id === item.dishId)) return;

  if (filterChart.value.menu_ids.length >= 5) {
    alert("You can only compare up to 5 dishes.");
    return;
  }

  filterChart.value.menu_ids.push({
    id: item.dishId,
    dishesName: item.dishesName,
  });

  saveMenuIdsToStorage();
  searchDish.value.search = "";
  loadChart();
};

// Remove dish
const removeDish = (index) => {
  filterChart.value.menu_ids.splice(index, 1);
  saveMenuIdsToStorage();
  loadChart();
};

// Create chart
const createChart = async () => {
  const ctx = document.getElementById(chartId.value);
  if (!ctx) return;

  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.value.labels ?? [],
      datasets: chartData.value.dataSets ?? [],
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
        },
      },
    },
  });
};

// Fetch data from API using only dish IDs
const getComparisonData = async () => {
  try {
    loading.value = true;

    const formData = FormDx({
      type: filterChart.value.type,
      menu_ids: filterChart.value.menu_ids.map((m) => m.id), // Only send IDs
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients-analytics/real-time-menu-comparison`,
      formData,
      BearToken(token)
    );

    chartData.value = response.data || { labels: [], dataSets: [], menus: [] };
  } catch (error) {
    handleApiError(error);
    chartData.value = { labels: [], dataSets: [], menus: [] };
  } finally {
    loading.value = false;
  }
};

// Load chart
const loadChart = async () => {
  await getComparisonData();

  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  await createChart();
};

// Local storage persistence
const saveMenuIdsToStorage = () => {
  localStorage.setItem(MENU_IDS_KEY, JSON.stringify(filterChart.value.menu_ids));
};

const loadMenuIdsFromStorage = () => {
  const saved = localStorage.getItem(MENU_IDS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        filterChart.value.menu_ids = parsed;
      }
    } catch {
      console.warn("Failed to parse saved menu data");
    }
  }
};

onMounted(() => {
  loadMenuIdsFromStorage();
  loadChart();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
