<template>
  <div class="p-4 min-h-screen">
    <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-4">DataTable Sample Implementation</h1>
    
    <DataTable
      :api-endpoint="`${VUE_APP_API_URL}ingredients/list`"
      :columns="tableColumns"
      :search-params="searchParams"
      responseDataKey="ingredients"
      :header-bg="DEFAULT_BG"
      :no-data-message="'No data found'"
      :search-placeholder="'Search ingredients...'"
      @update:data="handleDataUpdate"
    >
      <!-- Action Buttons Slot -->
      <template #actions>
        <button
          class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 text-nowrap"
          @click="handleRefresh"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </template>

      <!-- Row Template -->
      <template #default="{ item }">
        <tr class="hover:bg-gray-100">
          <td class="px-4 py-2 text-right">{{ item.ingredientIdNumber }}</td>
          <td class="px-4 py-2">{{ item.name }}</td>
          <td class="px-4 py-2">{{ item.ingredientCategoryName }}</td>
          <td class="px-4 py-2 text-right">{{ formatNumberWithCommas(item.stocks) }}</td>
          <td class="px-4 py-2 text-right">{{ item.costPrice }}</td>
          <td class="px-4 py-2 text-center">
            <button
              class="bg-blue-500 text-white hover:opacity-70 px-3 py-1 rounded text-sm"
              @click="handleView(item)"
            >
              View
            </button>
          </td>
        </tr>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from '@/views/Component/DataTable.vue';
import { VUE_APP_API_URL, DEFAULT_BG } from '@/views/Utility/Global';
import { formatNumberWithCommas } from '@/views/Utility/Helper';

// Table columns configuration
const tableColumns = [
  {
    key: 'id',
    label: 'ID #',
    align: 'right',
    sortable: true
  },
  {
    key: 'name',
    label: 'Name',
    align: 'left',
    sortable: true
  },
  {
    key: 'category',
    label: 'Category',
    align: 'left',
    sortable: false
  },
  {
    key: 'stocks',
    label: 'Stocks',
    align: 'right',
    sortable: true
  },
  {
    key: 'costPrice',
    label: 'Cost Price',
    align: 'right',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'center',
    sortable: false
  }
];

// Search parameters
const searchParams = ref({
  category_id: 0
});

// Handle data update from DataTable
const handleDataUpdate = (data) => {
  console.log('Data updated:', data);
};

// Handle refresh button click
const handleRefresh = () => {
  const dataTable = document.querySelector('DataTable');
  if (dataTable) {
    dataTable.refresh();
  }
};

// Handle view button click
const handleView = (item) => {
  console.log('View item:', item);
};
</script> 