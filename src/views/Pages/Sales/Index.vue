<template>
  <div v-if="hasPermission('Navigation_Sales') && hasPermission('Navigation_Reports')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Sales'" /> -->
      <div class="flex justify-between items-center p-3 mt-1 px-2">
        <h1 class="text-lg md:text-2xl font-bold">Sales</h1>
        <!-- View Mode Toggle -->
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'detailed'"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="
              viewMode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            "
          >
            <i class="fas fa-list-alt mr-2"></i>Detailed View
          </button>
          <button
            @click="viewMode = 'table'"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            "
          >
            <i class="fas fa-table mr-2"></i>Table View
          </button>
        </div>
      </div>

      <!-- Dynamic Component -->
      <component :is="viewMode === 'table' ? TableMode : DetailedMode" />
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";

// Import view components
import TableMode from "./Actions/TableMode.vue";
import DetailedMode from "./Actions/DetailedMode.vue";

const viewMode = ref("detailed"); // Default to table view
</script>
