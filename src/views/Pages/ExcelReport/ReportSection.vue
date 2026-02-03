<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center bg-gray-50/60 p-4 rounded-xl shadow-sm border border-gray-100"
  >
    <div>
        <h2>{{ title }}</h2>
      <select
        v-model="localSearch.type"
        @change="onTypeChange(localSearch.type)"
        class="w-full bg-white shadow-sm border border-gray-300 font-medium text-sm py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="0">All Dates</option>
        <!-- <option value="1">Hourly</option> -->
        <option value="2">Daily</option>
        <option value="3">Weekly</option>
        <option value="4">Monthly</option>
        <option value="5">Custom Range</option>
      </select>
    </div>

    <div v-if="localSearch.type !== '0'">
      <label class="block text-xs font-semibold text-gray-500 mb-1">
        Date Range
      </label>
      <div
        class="flex items-center justify-between border border-gray-300 bg-white rounded-lg px-2 py-1 shadow-sm"
      >
        <input
          :type="dateInputType"
          v-model="localSearch.date_from"
          @change="onDateChange('date_from', $event.target.value)"
          class="w-28 text-sm font-semibold border-none bg-transparent focus:ring-0 focus:outline-none"
        />
        <span class="text-gray-500 text-xs px-1">to</span>
        <input
          :type="dateInputType"
          v-model="localSearch.date_to"
          @change="onDateChange('date_to', $event.target.value)"
          class="w-28 text-sm font-semibold border-none bg-transparent focus:ring-0 focus:outline-none"
        />
      </div>
    </div>

        <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">
                User
            </label>
            <div
                class="shadow-sm border border-gray-300 bg-white rounded-lg px-1 focus-within:ring-2 focus-within:ring-blue-400"
            >
                <SearchDropdown
                apiEndpoint="users/search-name-only"
                :searchModel="searchUser"
                placeholder="Search User"
                itemLabel="name"
                itemId="id"
                inputId="userName"
                @item-selected="onUserSelected"
                dataKey="users"
                returnName="['name']"
                />
            </div>
        </div>
        <div class="flex flex-col justify-start items-start mt-3 lg:mt-6">
            <DownloadExcel
            :report-type="reportType"
            :data="localSearch"
            :disabled="isLoading"
            class="text-sm shrink-0"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import DownloadExcel from "./Actions/DownloadExcel.vue";

const props = defineProps({
  title: String,
  reportType: String,
  search: Object,
  searchUser: Object,
  isLoading: Boolean,
});

const emit = defineEmits([
  "update:search",
  "update:search-user",
  "user-selected",
  "search-updated",
]);

const today = new Date().toISOString().split("T")[0];
const formatDate = (d) => new Date(d).toISOString().split("T")[0];

const localSearch = ref({
  ...props.search,
  date_from: props.search?.date_from || today,
  date_to: props.search?.date_to || today,
});

// ✅ Watch for parent updates
watch(
  () => props.search,
  (newVal) => (localSearch.value = { ...newVal }),
  { deep: true }
);

// ✅ Dynamic input type based on type filter
const dateInputType = computed(() => {
  switch (localSearch.value.type) {
    case "1":
      return "datetime-local";
    case "2":
    case "5":
      return "date";
    case "3":
      return "week";
    case "4":
      return "month";
    default:
      return "date";
  }
});
const mergedDateRange = computed({
  get() {
    return `${localSearch.value.date_from} to ${localSearch.value.date_to}`;
  },
  set(val) {
    const [from, to] = val.split(" to ");
    localSearch.value.date_from = from || "";
    localSearch.value.date_to = to || "";
  },
});

// ✅ When type changes
const onTypeChange = (value) => {
  const now = new Date();
  const start = new Date(now);
  const updated = { ...localSearch.value, type: value };

  switch (value) {
    case "1": // Hourly
      updated.date_from = updated.date_to = formatDate(now);
      break;
    case "2": // Daily (7 days)
      start.setDate(now.getDate() - 7);
      updated.date_from = formatDate(start);
      updated.date_to = formatDate(now);
      break;
    case "3": // Weekly
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      updated.date_from = formatDate(monday);
      updated.date_to = formatDate(sunday);
      break;
    case "4": // Monthly
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      updated.date_from = formatDate(firstDay);
      updated.date_to = formatDate(lastDay);
      break;
    case "5": // Custom Range
      updated.date_from = "";
      updated.date_to = "";
      break;
    default:
      updated.date_from = "";
      updated.date_to = "";
  }

  localSearch.value = updated;
  emit("update:search", updated);
  emit("search-updated", updated);
};

const onDateRangeChange = (e) => {
  const val = e.target.value;
  const [from, to] = val.split(" to ");
  const updated = { ...localSearch.value, date_from: from, date_to: to };
  localSearch.value = updated;
  emit("update:search", updated);
  emit("search-updated", updated);
};

// ✅ When user is selected
const onUserSelected = (user) => {
  const updated = { ...localSearch.value, user_id: user.id };
  localSearch.value = updated;
  emit("update:search", updated);
  emit("user-selected", user);
  emit("search-updated", updated);
};
</script>
