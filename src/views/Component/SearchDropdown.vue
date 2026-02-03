<template>
  <div class="relative w-full p-0 m-0" ref="dropdownRef">
    <div class="flex">
      <input
        type="text"
        :id="inputId"
        :placeholder="placeholder"
        v-model="searchQuery"
        :title="searchQuery"
        @input="onInput"
        @keydown="handleKeyDown"
        autocomplete="off"
        :class="
          className ? className : 'mt-0 p-2 border-l border-t border-b rounded-l w-full'
        "
      />
      <!-- @click="onInput" -->
      <button type="button" @click.prevent="viewItems()" class="absolute top-2 right-2">
        <i class="fa fa-xs font-extrabold text-black fa-chevron-down"></i>
      </button>
    </div>

    <div
      class="dropdown-menu absolute bg-white shadow w-full mt-1"
      v-if="filteredItems.length > 0"
      @scroll="handleScroll"
      style="max-height: 200px; overflow-y: auto"
    >
      <ul>
        <li
          v-for="(item, index) in filteredItems"
          :key="item[itemId]"
          :class="[
            'p-2 border-l-2 border-slate-200 flex py-2 font-bold shadow text-gray-600 cursor-pointer hover:bg-gray-100',
            { 'bg-slate-200': selectedIndex === index },
          ]"
          @click="selectItem(item)"
          @mouseover="selectedIndex = index"
        >
          {{ labelFormatter(item) }}
        </li>
        <li v-if="loadingMore" class="text-center py-2">Loading more...</li>
        <li v-if="!loadingMore && !hasMoreItems" class="text-center py-2 text-gray-500">
          No more items
        </li>
      </ul>
    </div>
    <!-- <div 
     v-else
     class="dropdown-menu absolute bg-white shadow w-full mt-1">
      <ul>
        <li  class="text-center py-2 deco">Not Found</li>
      </ul>
    </div> -->
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useDebounce, convertStringToArray, BearToken } from "../Utility/Helper";
import { VUE_APP_API_URL } from "../Utility/Global";


const props = defineProps({
  apiEndpoint: String,
  searchModel: Object,
  placeholder: String,
  itemLabel: String,
  itemId: String,
  inputId: String,
  returnName: String,
  dataKey: String,
  className: {
    type: String,
    default: "",
  },
  defaultValue: String,
  formatLabel: {
    type: String,
    default: "none",
  },
});

const keyName = ref(convertStringToArray(props.returnName));
const emit = defineEmits(["item-selected"]);

const searchQuery = ref("");
const filteredItems = ref([]);
const selectedIndex = ref(-1);
const loadingMore = ref(false);
const hasMoreItems = ref(true); // Track if more items can be loaded
const page = ref(1);
const dropdownRef = ref(null);
const token = localStorage.getItem("token");

const viewItems = () => {
  if (filteredItems.value.length > 0) {
    filteredItems.value = [];
  } else {
    fetchItems();
  }
};

// Close dropdown if clicked outside component
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

const closeDropdown = () => {
  filteredItems.value = [];
  selectedIndex.value = -1;
};

const fetchItems = async (loadMore = false) => {
  try {
    if (!loadMore) {
      filteredItems.value = [];
      page.value = 1; // Reset page for fresh searches
      hasMoreItems.value = true; // Reset hasMoreItems when performing a new search
    }

    const response = await axios.post(
      `${VUE_APP_API_URL}${props.apiEndpoint}`,
      {
        ...props.searchModel,
        page_num: page.value,
      },
      BearToken(token)
    );

    const newItems =
      props.dataKey && response.data[props.dataKey]
        ? response.data[props.dataKey]
        : Array.isArray(response.data)
        ? response.data
        : Object.values(response.data).find((val) => Array.isArray(val)) || [];

    if (newItems.length === 0) {
      hasMoreItems.value = false; // No more items to load
    } else if (loadMore) {
      filteredItems.value.push(...newItems); // Append new items to the list
    } else {
      filteredItems.value = newItems;
    }

    loadingMore.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;

  // Check if the user has scrolled to the bottom
  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    !loadingMore.value &&
    hasMoreItems.value
  ) {
    page.value += 1;
    loadingMore.value = true;
    fetchItems(true); // Load more items on scroll
  }
};

const labelFormatter = (item) => {
  const formatLabel = props.formatLabel;
  const key = keyName.value;
  if (key.length > 3) return "Maximum Allowed key is 3 only!";

  const third_value =
    key?.length >= 2 && item[key[2]]?.length > 0 ? " (" + (item[key[2]] ?? "") + ")" : "";
  switch (formatLabel) {
    case "none":
      return key?.length > 0
        ? (item[key[0]] ?? "") + "  " + (item[key[1]] ?? "") + " " + (item[key[2]] ?? "")
        : item[key[0]] ?? "";
    case "dashed":
      return key?.length > 0
        ? (item[key[0]] ?? "") +
            " - " +
            (item[key[1]] ?? "") +
            "  " +
            (item[key[2]] ?? "")
        : item[key[0]] ?? "";
    case "dashed_and_parenthesis":
      return key?.length > 0
        ? (item[key[0]] ?? "") +
            " - " +
            (item[key[1]] ?? "") +
            "  (" +
            (item[key[2]] + ")" ?? "")
        : item[key[0]] ?? "";
    case "parenthesis":
      return key?.length == 2
        ? (item[key[0]] ?? "") + " (" + (item[key[1]] + ")" ?? ")")
        : item[key[0]] ?? ""; //max two keys
    case "third_parenthesis":
      return key?.length > 0
        ? (item[key[0]] ?? "") + " - " + (item[key[1]] ?? "") + third_value
        : item[key[0]] ?? "";
    default:
      return key?.length > 0
        ? (item[key[0]] ?? "") + "  " + (item[key[1]] ?? "") + (item[key[2]] ?? "")
        : item[key[0]] ?? "";
  }
};

const debouncedFetchItems = useDebounce(fetchItems, 500);

const onInput = (event) => {
  searchQuery.value = event.target.value; // immediately update with latest input
  props.searchModel.search = searchQuery.value;

  debouncedFetchItems();
};

const handleKeyDown = (event) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (selectedIndex.value < filteredItems.value.length - 1) {
        selectedIndex.value += 1;
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (selectedIndex.value > 0) {
        selectedIndex.value -= 1;
      }
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0 && filteredItems.value[selectedIndex.value]) {
        selectItem(filteredItems.value[selectedIndex.value]);
      }
      break;
  }
};

const selectItem = (item) => {
  const labelName = labelFormatter(item);
  searchQuery.value = labelName;
  filteredItems.value = [];
  selectedIndex.value = -1;

  emit("item-selected", item);
};

onMounted(() => {
  searchQuery.value = props.defaultValue;
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  z-index: 9999; /* Ensure it appears above other elements */
  position: relative; /* Required for positioning */
}
</style>
