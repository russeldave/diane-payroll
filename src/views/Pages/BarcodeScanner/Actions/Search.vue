<template>
  <!-- Main Button to Open Modal -->
  <button
    @click.prevent="openModal()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-3 mb-4 float-end text-nowrap"
  >
    <i class="fa fa-box-open"></i> List
  </button>

  <!-- Main Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'8xl'"
    title="Ingredient List"
    @close="closeModal"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Loader />
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Search Header -->
      <div
        class="sticky top-0 bg-white flex items-center gap-4 py-4 border-b border-gray-300 z-10"
      >
        <div class="flex items-center w-full gap-2">
          <!-- Search Input with Button -->
          <div class="flex w-full max-w-md">
            <input
              type="search"
              placeholder="Search Name or SKU"
              v-model="search.search"
              @input="handleSearchInput"
              @keyup.enter="searchInput"
              class="w-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-300 rounded-l-lg text-sm p-2"
            />
            <button
              title="Search Ingredients"
              @click="searchInput"
              class="px-4 bg-blue-500 text-white font-medium rounded-r-lg border-2 border-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              type="button"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>

          <!-- Reset Button -->
          <button
            @click="resetSearch"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            title="Reset search"
          >
            <i class="fa fa-redo"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="data.items?.length === 0 && !loading"
        class="text-center py-12"
      >
        <i class="fa fa-inbox text-gray-400 text-6xl mb-4"></i>
        <p class="text-gray-600 text-lg">No ingredients found</p>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>

      <!-- Ingredient Items Grid -->
      <div
        v-else
        class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4"
      >
        <!-- Skeleton Loading -->
        <div
          v-for="index in search.itemsperpage"
          v-if="loading"
          :key="`skeleton-${index}`"
          class="relative border rounded-lg overflow-hidden animate-pulse"
        >
          <div class="w-full h-40 bg-gray-200"></div>
          <div class="absolute top-0 left-0">
            <div
              class="bg-gray-300 h-6 w-20 rounded-r shadow-sm"
            ></div>
          </div>
          <div class="absolute bottom-0 w-full bg-gray-100 p-3">
            <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Actual Menu Items -->
        <div
          v-for="item in data.items"
          v-else
          :key="item.id"
          class="relative border rounded-lg overflow-hidden transition duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          :style="{ borderColor: item.bgColor, borderWidth: '3px' }"
          :title="item.description && item.description !== 'null' ? item.description : ''"
          @click="selectIngredient(item)"
        >
          <MenuCards
            :data="item"
            :isSimple="true"
            :isViewing="false"
            @transaction_id="handleTransaction"
            @click.native.stop="selectIngredient(item)"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6 border-t border-gray-200 pt-4" v-if="data.totalrows > search.itemsperpage">
        <div class="flex items-center gap-4">
          <button
            @click="handlePagination(search.page_num - 1)"
            :disabled="search.page_num <= 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          
          <div class="flex items-center gap-2">
            <span
              v-for="page in visiblePages"
              :key="page"
              @click="handlePagination(page)"
              class="px-3 py-1 rounded-lg cursor-pointer transition"
              :class="{
                'bg-blue-500 text-white': page === search.page_num,
                'hover:bg-gray-100': page !== search.page_num
              }"
            >
              {{ page }}
            </span>
            <span v-if="showEllipsis" class="px-2">...</span>
          </div>
          
          <button
            @click="handlePagination(search.page_num + 1)"
            :disabled="search.page_num >= totalPages"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import { FormDx, useDebounce, generateRandomHex } from "@/views/Utility/Helper.js";
import { VUE_APP_API_URL } from "@/views/Utility/Global.js";
import MenuCards from "../../RequestIngredient/Modules/MenuCards.vue";
import Modal from "@/views/Component/Modal.vue";

// Refs
const emits = defineEmits(["transaction_id", "ingredient-selected"]); // Added new emit
// Make deviceWarehouseId a ref that reads from localStorage
const deviceWarehouseId = ref(localStorage.getItem('device_warehouse_id') ?? 0);
const loading = ref(false);
const data = ref({
  items: [],
  totalrows: 0,
  menus: []
});
const isViewModalOpen = ref(false);
const screenWidth = ref(window.innerWidth);

// Search parameters - use deviceWarehouseId.value
const search = ref({
  search: "",
  warehouse_id: deviceWarehouseId.value,
  page_num: 1,
  itemsperpage: 8,
});

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(data.value.totalrows / search.value.itemsperpage);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, search.value.page_num - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > visiblePages.value.length && 
         Math.max(...visiblePages.value) < totalPages.value;
});

// Methods
const openModal = () => {
  // Refresh device warehouse ID before opening
  const currentDeviceWarehouseId = localStorage.getItem('device_warehouse_id') ?? 0;
  deviceWarehouseId.value = currentDeviceWarehouseId;
  search.value.warehouse_id = currentDeviceWarehouseId;
  
  isViewModalOpen.value = true;
  getIngredientsByWarehouse();
};

const closeModal = () => {
  isViewModalOpen.value = false;
  
  // Reset search to default state
  resetSearch();
};

// Add this new method to handle ingredient selection
const selectIngredient = (ingredient) => {
  // Emit the selected ingredient data to parent component
  emits("ingredient-selected", ingredient);
  
  // Close the modal
  closeModal();
  
  // Optional: Show a success message
  Swal.fire({
    icon: 'success',
    title: 'Ingredient Selected',
    text: `${ingredient.name} has been selected`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500
  });
};

const handleSearchInput = useDebounce(() => {
  searchInput();
}, 500);

const searchInput = async () => {
  search.value.page_num = 1;
  await getIngredientsByWarehouse();
};

const resetSearch = () => {
  // Get fresh device warehouse ID when resetting
  const currentDeviceWarehouseId = localStorage.getItem('device_warehouse_id') ?? 0;
  deviceWarehouseId.value = currentDeviceWarehouseId;
  
  search.value = {
    search: "",
    warehouse_id: currentDeviceWarehouseId,
    page_num: 1,
    itemsperpage: 8,
  };
  
  // Only fetch data if modal is open
  if (isViewModalOpen.value) {
    getIngredientsByWarehouse();
  }
};

const getIngredientsByWarehouse = async () => {
  try {
    loading.value = true;
    
    // Ensure we have the latest warehouse ID
    search.value.warehouse_id = localStorage.getItem('device_warehouse_id') ?? 0;
    
    const formData = FormDx(search.value);
    
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-search-ingredient`,
      formData,
    );
    
    if (response.data && Array.isArray(response.data.items)) {
      data.value = response.data;
      
      // Enhance items with additional properties
      data.value.items = data.value.items.map(item => ({
        ...item,
        price: item.price || 0,
        quantity: item.quantity || 1,
        bgColor: generateRandomHex(),
        description: item.description || ''
      }));
      
    } else {
      data.value = { items: [], totalrows: 0, menus: [] };
      console.warn("Unexpected response format:", response.data);
    }
    
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to fetch ingredients. Please try again.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    
    data.value = { items: [], totalrows: 0, menus: [] };
  } finally {
    loading.value = false;
  }
};

const handlePagination = (page_num) => {
  if (page_num < 1 || page_num > totalPages.value) return;
  
  search.value.page_num = page_num;
  getIngredientsByWarehouse();
  
  // Scroll to top of grid
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.scrollTop = 0;
  }
};

const handleTransaction = (transaction_id) => {
  emits("transaction_id", transaction_id);
};

// Handle keyboard shortcuts
const handleKeydown = (e) => {
  if (!isViewModalOpen.value) return;
  
  switch(e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'Enter':
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        searchInput();
      }
      break;
  }
};

// Handle screen resize
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

// Watch for localStorage changes for device_warehouse_id
const watchLocalStorage = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'device_warehouse_id') {
      console.log('device_warehouse_id changed in localStorage:', event.newValue);
      
      // Update the reactive value
      deviceWarehouseId.value = event.newValue ?? 0;
      
      // Update search if modal is open
      if (isViewModalOpen.value) {
        search.value.warehouse_id = deviceWarehouseId.value;
        // Refresh the ingredient list
        getIngredientsByWarehouse();
      }
    }
  });
};

// Lifecycle hooks
onMounted(() => {
  watchLocalStorage();
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Custom scrollbar for the modal */
:deep(.modal-content) {
  max-height: 80vh;
  overflow-y: auto;
}

/* Hide scrollbar for Chrome, Safari and Opera */
:deep(.modal-content)::-webkit-scrollbar {
  width: 8px;
}

:deep(.modal-content)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.modal-content)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

:deep(.modal-content)::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition {
  transition: all 0.2s ease-in-out;
}

/* Improve hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Ensure proper z-index stacking */
.z-10 {
  z-index: 10;
}

/* Cursor pointer for clickable items */
.cursor-pointer {
  cursor: pointer;
}
</style>