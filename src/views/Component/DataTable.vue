<template>
  <div class="w-full">
    <!-- Search Input -->
    <div class="mb-4">
      <div class="flex items-center space-x-2">
        <div class="flex-1">
          <input
            type="search"
            v-model="searchQuery"
            @input="handleSearch"
            :placeholder="searchPlaceholder"
            class="shadow shadow-gray-700 w-full focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded"
          />
        </div>
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Table Container -->
    <div class="flex w-full overflow-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table Header -->
        <thead class="text-white shadow" :class="headerBg">
          <tr class="border-b-2 text-xs md:text-sm border-solid border-yellow-500">
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-2 py-2 border',
                column.align ? `text-${column.align}` : 'text-left',
                column.sortable ? 'cursor-pointer' : '',
                column.class || ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center">
                {{ column.label }}
                <i
                  v-if="column.sortable"
                  :class="getSortIcon(column.key)"
                  class="ml-1"
                ></i>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-2 py-2 text-center text-red-500 font-bold">
              <Loader />
            </td>
          </tr>

          <!-- No Data State -->
          <tr v-else-if="!loading && (!data || data.length === 0)">
            <td :colspan="columns.length" class="px-2 py-2 text-center text-red-500 font-bold">
              {{ noDataMessage }}
            </td>
          </tr>

          <!-- Data Rows -->
          <template v-else>
            <slot
              v-for="(item, index) in data"
              :key="index"
              :item="item"
              :index="index"
            ></slot>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex w-full overflow-auto mt-4">
      <Paginator
        v-if="totalRows"
        :page_number="currentPage"
        :total_rows="totalRows"
        :itemsperpage="itemsPerPage"
        @page_num="handlePagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import Loader from './Loader.vue';
import Paginator from './Pagination.vue';
import { BearToken, FormDx, handleApiError, useDebounce } from '@/views/Utility/Helper';

const props = defineProps({
  // API endpoint for fetching data
  apiEndpoint: {
    type: String,
    required: true
  },
  // Column definitions
  columns: {
    type: Array,
    required: true
  },
  // Initial search parameters
  searchParams: {
    type: Object,
    default: () => ({})
  },
  // Header background color class
  headerBg: {
    type: String,
    default: 'bg-gray-800'
  },
  // Message to show when no data is available
  noDataMessage: {
    type: String,
    default: 'No data found'
  },
  // Items per page
  itemsPerPage: {
    type: Number,
    default: 10
  },
  // Search placeholder text
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  // Search field name in the API request
  searchField: {
    type: String,
    default: 'search'
  },
  // Response data key (e.g., 'data', 'ingredients', etc.)
  responseDataKey: {
    type: String,
    default: 'data'
  }
});

const emit = defineEmits(['update:data', 'update:totalRows', 'update:loading']);

// State
const data = ref([]);
const totalRows = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const sortBy = ref('id');
const sortType = ref('ASC');
const searchQuery = ref('');

// Watch for changes in search parameters
watch(() => props.searchParams, (newParams) => {
  currentPage.value = 1;
  fetchData();
}, { deep: true });

// Handle search with debounce
const handleSearch = useDebounce(() => {
  currentPage.value = 1;
  fetchData();
}, 500);

// Fetch data from API
const fetchData = async () => {
  try {
    loading.value = true;
    emit('update:loading', true);

    const params = {
      ...props.searchParams,
      [props.searchField]: searchQuery.value,
      page_num: currentPage.value,
      itemsperpage: props.itemsPerPage,
      sort_by: sortBy.value,
      sort_type: sortType.value
    };

    const formData = FormDx(params);
    const token = localStorage.getItem('token');
    const response = await axios.post(
      props.apiEndpoint,
      formData,
      BearToken(token)
    );

    data.value = response.data[props.responseDataKey] || [];
    totalRows.value = response.data.totalrows || 0;

    emit('update:data', data.value);
    emit('update:totalRows', totalRows.value);
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
    emit('update:loading', false);
  }
};

// Handle sorting
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortType.value = sortType.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortBy.value = column;
    sortType.value = 'ASC';
  }
  fetchData();
};

// Get sort icon class
const getSortIcon = (column) => {
  if (sortBy.value !== column) {
    return 'fas fa-arrows-up-down text-white';
  }
  return sortType.value === 'ASC' 
    ? 'fas fa-arrow-up text-white' 
    : 'fas fa-arrow-down text-white';
};

// Handle pagination
const handlePagination = (page) => {
  currentPage.value = page;
  fetchData();
};

// Initial data fetch
fetchData();

// Expose methods and state
defineExpose({
  refresh: fetchData,
  data,
  loading,
  totalRows,
  searchQuery
});
</script> 