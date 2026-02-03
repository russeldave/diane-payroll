<template>
  <div class="flex flex-wrap items-center justify-between w-full py-4">
    <!-- Pagination Controls -->
    <nav class="flex items-center gap-2">
      <!-- Items Per Page -->
      <div v-if="!props.paginationOnly" class="flex items-center gap-2 mr-4">
        <label class="text-sm text-gray-600">Go to:</label>
        <select
          v-model="quickJumpPage"
          @change="handleQuickJump"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors"
        >
          <option
            v-for="page in totalPages"
            :key="page"
            :value="page"
            :selected="page === props.page_number"
          >
            Page {{ page }}
          </option>
        </select>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center gap-1">
        <button
          title="First page"
          @click.prevent="paginateToPage(1)"
          :disabled="props.page_number <= 1"
          class="pagination-button"
          :class="{ 'opacity-50 cursor-not-allowed': props.page_number <= 1 }"
        >
          <i class="fas fa-angle-double-left text-sm"></i>
        </button>

        <button
          title="Previous page"
          :disabled="props.page_number <= 1"
          @click.prevent="paginate(false)"
          class="pagination-button"
          :class="{ 'opacity-50 cursor-not-allowed': props.page_number <= 1 }"
        >
          <i class="fas fa-angle-left text-sm"></i>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1 mx-1">
          <button
            v-for="pn in visiblePageNumbers"
            :key="pn"
            @click.prevent="paginateToPage(pn)"
            class="pagination-button min-w-[40px]"
            :class="[
              props.page_number === pn
                ? 'bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500 font-semibold shadow-sm'
                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900',
            ]"
          >
            {{ pn }}
          </button>
        </div>

        <button
          title="Next page"
          :disabled="props.page_number >= totalPages"
          @click.prevent="paginate(true)"
          class="pagination-button"
          :class="{ 'opacity-50 cursor-not-allowed': props.page_number >= totalPages }"
        >
          <i class="fas fa-angle-right text-sm"></i>
        </button>

        <button
          title="Last page"
          @click.prevent="paginateToPage(totalPages)"
          :disabled="props.page_number >= totalPages"
          class="pagination-button"
          :class="{ 'opacity-50 cursor-not-allowed': props.page_number >= totalPages }"
        >
          <i class="fas fa-angle-double-right text-sm"></i>
        </button>
      </div>
    </nav>

    <!-- Page Info -->
    <div v-if="!props.paginationOnly" class="flex items-center gap-4">
      <p v-if="props.total_rows > 0" class="text-sm text-gray-600">
        {{ pageInfo(props.page_number, props.total_rows, props.itemsperpage) }}
      </p>

      <!-- Quick Jump -->
      <!-- <div class="flex items-center gap-2">
       
      </div> -->
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import { DEFAULT_BG } from "@/views/Utility/Global";

// Define emits and props
const emits = defineEmits(["page_num"]);
const props = defineProps({
  page_number: {
    type: Number,
    default: 1,
  },
  total_rows: {
    type: Number,
    default: 0,
  },
  itemsperpage: {
    type: Number,
    default: 10,
  },
  paginationOnly: {
    type: Boolean,
    default: false,
  }
});

const currentPath = window.location.pathname;
const storageKey = `lastPage_${currentPath}`;

// Reactive state
const totalPages = ref(0);
const selectedPage = ref(props.page_number);
const itemsPerPage = ref(props.itemsperpage);
const quickJumpPage = ref(Number(localStorage.getItem(storageKey)) || props.page_number);

// Function to calculate total pages
const getTotalPageNumber = () => {
  totalPages.value = Math.ceil(props.total_rows / itemsPerPage.value);
};

// Function to handle pagination
const paginate = (isIncrement) => {
  const increment = isIncrement ? props.page_number + 1 : props.page_number - 1;
  emits("page_num", increment);
};

// Function to handle direct page number selection
const paginateToPage = (pageNum) => {
  emits("page_num", pageNum);
};

// Function to handle quick jump
const handleQuickJump = () => {
  if (quickJumpPage.value >= 1 && quickJumpPage.value <= totalPages.value) {
    localStorage.setItem(storageKey, quickJumpPage.value);
    paginateToPage(quickJumpPage.value);
  }
};

// Page info text
const pageInfo = (page_num, total_rows, items_per_page = 10) => {
  if (page_num < 1) page_num = 1;

  const total_pages = Math.ceil(total_rows / items_per_page);
  if (page_num > total_pages) page_num = total_pages;

  const start_index = (page_num - 1) * items_per_page + 1;
  const end_index = Math.min(page_num * items_per_page, total_rows);

  return `Page ${page_num} of ${total_pages}. Showing ${start_index}-${end_index} of ${total_rows} rows.`;
};

const page_number = (totalPages, currentPage) => {
  let pagesToShow = [];

  if (totalPages > 0) {
    if (totalPages == currentPage) {
      if (currentPage - 2 > 0) pagesToShow.push(currentPage - 2); // Next page
    }
    if (currentPage > 1) {
      if (currentPage - 1 > 0) pagesToShow.push(currentPage - 1);
    }
    if (currentPage > 0) pagesToShow.push(currentPage);
    if (currentPage == 1 && totalPages < 3) {
      if (currentPage + 1 <= totalPages) pagesToShow.push(currentPage + 1); // Next page
    }
    if (currentPage == 1 && totalPages >= 3) {
      if (currentPage + 1 <= totalPages) pagesToShow.push(currentPage + 1); // Next page
      if (currentPage + 2 <= totalPages) pagesToShow.push(currentPage + 2); // Next page
    }
    if (currentPage < totalPages && currentPage != 1) {
      if (currentPage + 1 <= totalPages) pagesToShow.push(currentPage + 1); // Next page
    }
  }
  return pagesToShow;
};

// Compute visible page numbers
const visiblePageNumbers = computed(() => {
  const currentPage = props.page_number;
  const page = page_number(totalPages.value, currentPage);
  return page;
});

// Watch for changes in total_rows and itemsperpage
watch(
  () => props.total_rows,
  () => getTotalPageNumber()
);
watch(
  () => itemsPerPage.value,
  () => getTotalPageNumber()
);

// Watch for changes in page_number
watch(
  () => props.page_number,
  (newValue) => {
    quickJumpPage.value = newValue;
    localStorage.setItem(storageKey, newValue);
  }
);

// Initialize total pages on mount
onMounted(() => {
  getTotalPageNumber();
  // Reset page if on different webpage
  if (window.location.pathname !== currentPath) {
    localStorage.removeItem(storageKey);
    paginateToPage(1);
  }
});

onUnmounted(() => {
  localStorage.removeItem(storageKey);
});
</script>

<style scoped>
.pagination-button {
  @apply flex items-center justify-center px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-200;
}

/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
