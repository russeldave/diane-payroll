<template>
  <div
    v-if="hasPermission('Navigation_Statistics') && hasPermission('Navigation_Reports')"
  >
    <!-- Breadcrumb Navigation -->
    <div class="px-4 min-h-screen">
      <!-- <BreadCrumbs :page="'Restaurant Statistics'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-1">Restaurant Statistics</h1>
      <!-- Restaurant Statistics Content -->
      <div class="block space-y-4">
        <div class="grid grid-cols-1 gap-6">
          <General />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OutOfStocks />
          <BestSelling />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Error403 from "@/views/Error/403.vue";
import { hasPermission } from "@/views/Utility/Permissions";

import BestSelling from "@/views/Pages/Charts/Modules/PopularItemsChart.vue";
import General from "./Modules/General.vue";
import OutOfStocks from "./Modules/OutOfStocks.vue";

// Token from localStorage for authentication (if needed)
const token = localStorage.getItem("token");
</script>

<style scoped>
/* Add custom styles here */
</style>
