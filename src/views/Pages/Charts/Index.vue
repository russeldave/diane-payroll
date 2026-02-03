<template>
  <div
    v-if="hasPermission('Navigation_Analytics') && hasPermission('Navigation_Reports')"
  >
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Analytics'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Analytics</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Popular Items Chart -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <div class="flex items-center justify-between p-4">
              <h2 class="text-lg font-semibold text-gray-800">Popular Items</h2>
              <nav class="flex space-x-2" aria-label="Tabs">
                <button
                  v-for="tab in popularItemsTabs"
                  :key="tab.id"
                  @click="activePopularItemsTab = tab.id"
                  :class="[
                    activePopularItemsTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                    'p-2 rounded-lg transition-colors duration-200',
                  ]"
                  :title="tab.name"
                >
                  <i :class="tab.icon" class="text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
          <div class="p-4">
            <PopularItemsChart v-if="activePopularItemsTab === 'default'" />
            <FilteredPopularItemsChart v-if="activePopularItemsTab === 'filtered'" />
          </div>
        </div>

        <!-- Menu Sales Comparison Chart -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <div class="flex items-center justify-between p-4">
              <h2 class="text-lg font-semibold text-gray-800">Menu Sales Comparison</h2>
              <nav class="flex space-x-2" aria-label="Tabs">
                <button
                  v-for="tab in menuSalesTabs"
                  :key="tab.id"
                  @click="activeMenuSalesTab = tab.id"
                  :class="[
                    activeMenuSalesTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                    'p-2 rounded-lg transition-colors duration-200',
                  ]"
                  :title="tab.name"
                >
                  <i :class="tab.icon" class="text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
          <div class="p-4">
            <MenuSalesComparisonChart v-if="activeMenuSalesTab === 'default'" />
            <FilteredMenuSalesComparisonChart v-if="activeMenuSalesTab === 'filtered'" />
          </div>
        </div>

        <!-- Revenue Trend Chart -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <div class="flex items-center justify-between p-4">
              <h2 class="text-lg font-semibold text-gray-800">Revenue Trend</h2>
              <nav class="flex space-x-2" aria-label="Tabs">
                <button
                  v-for="tab in revenueTabs"
                  :key="tab.id"
                  @click="activeRevenueTab = tab.id"
                  :class="[
                    activeRevenueTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                    'p-2 rounded-lg transition-colors duration-200',
                  ]"
                  :title="tab.name"
                >
                  <i :class="tab.icon" class="text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
          <div class="p-4">
            <RevenueTrendChart v-if="activeRevenueTab === 'default'" />
            <FilteredRevenueTrendChart v-if="activeRevenueTab === 'filtered'" />
          </div>
        </div>

        <!-- Payment Distribution Chart -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <div class="flex items-center justify-between p-4">
              <h2 class="text-lg font-semibold text-gray-800">Payment Distribution</h2>
              <nav class="flex space-x-2" aria-label="Tabs">
                <button
                  v-for="tab in inventoryTabs"
                  :key="tab.id"
                  @click="activePaymentDistribution = tab.id"
                  :class="[
                    activePaymentDistribution === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                    'p-2 rounded-lg transition-colors duration-200',
                  ]"
                  :title="tab.name"
                >
                  <i :class="tab.icon" class="text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
          <div class="p-4">
            <PaymentDistributionChart v-if="activePaymentDistribution === 'default'" />
            <FilteredPaymentDistributionChart
              v-if="activePaymentDistribution === 'filtered'"
            />
          </div>
        </div>

        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <div class="flex items-center justify-between p-4">
              <h2 class="text-lg font-semibold text-gray-800">Sales Overview</h2>
              <nav class="flex space-x-2" aria-label="Tabs">
                <button
                  v-for="tab in salesTabs"
                  :key="tab.id"
                  @click="activeSalesTab = tab.id"
                  :class="[
                    activeSalesTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                    'p-2 rounded-lg transition-colors duration-200',
                  ]"
                  :title="tab.name"
                >
                  <i :class="tab.icon" class="text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
          <div class="p-4">
            <SalesChart v-if="activeSalesTab === 'default'" />
            <FilteredSalesChart v-if="activeSalesTab === 'filtered'" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Error403 from "@/views/Error/403.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import SalesChart from "./Modules/SalesChart.vue";
import PaymentDistributionChart from "./Modules/PaymentDistributionChart.vue";
import PopularItemsChart from "./Modules/PopularItemsChart.vue";
import RevenueTrendChart from "./Modules/RevenueTrendChart.vue";
import MenuSalesComparisonChart from "./Modules/MenuSalesComparisonChart.vue";
import FilteredPopularItemsChart from "./Modules/FilteredPopularItemsChart.vue";
import FilteredMenuSalesComparisonChart from "./Modules/FilteredMenuSalesComparisonChart.vue";
import FilteredRevenueTrendChart from "./Modules/FilteredRevenueTrendChart.vue";
import FilteredPaymentDistributionChart from "./Modules/FilteredPaymentDistributionChart.vue";
import FilteredSalesChart from "./Modules/FilteredSalesChart.vue";

const token = localStorage.getItem("token");

const breadcrumbs = [
  { name: "Home", to: "/" },
  { name: "Charts", to: "/charts" },
];

// Tab configurations for each chart
const popularItemsTabs = [
  { id: "default", name: "Default View", icon: "fas fa-chart-bar" },
  { id: "filtered", name: "Filtered View", icon: "fas fa-filter" },
];

const menuSalesTabs = [
  { id: "default", name: "Default View", icon: "fas fa-chart-bar" },
  { id: "filtered", name: "Filtered View", icon: "fas fa-filter" },
];

const revenueTabs = [
  { id: "default", name: "Default View", icon: "fas fa-chart-bar" },
  { id: "filtered", name: "Filtered View", icon: "fas fa-filter" },
];

const inventoryTabs = [
  { id: "default", name: "Default View", icon: "fas fa-chart-bar" },
  { id: "filtered", name: "Filtered View", icon: "fas fa-filter" },
];

const salesTabs = [
  { id: "default", name: "Default View", icon: "fas fa-chart-bar" },
  { id: "filtered", name: "Filtered View", icon: "fas fa-filter" },
];

// Active tab states for each chart
const activePopularItemsTab = ref("default");
const activeMenuSalesTab = ref("default");
const activeRevenueTab = ref("default");
const activePaymentDistribution = ref("default");
const activeSalesTab = ref("default");
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
