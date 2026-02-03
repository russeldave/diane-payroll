<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        Excel Reports
      </h1>

      <div class="space-y-10">
        <!-- MRF -->
        <ReportSection
          title="MRF"
          report-type="mrf"
          v-model:search="search.mrf"
          v-model:search-user="searchUser.mrf"
          :is-loading="loading.mrf"
          @user-selected="(user) => handleUserSelected('mrf', user)"
          @search-updated="(data) => handleSearchUpdated('mrf', data)"
        />

        <!-- Direct Receiving -->
        <ReportSection
          title="Direct Receiving"
          report-type="direct-receiving"
          v-model:search="search.direct"
          v-model:search-user="searchUser.direct"
          :is-loading="loading.direct"
          @user-selected="(user) => handleUserSelected('direct', user)"
          @search-updated="(data) => handleSearchUpdated('direct', data)"
        />

        <!-- PR Receiving -->
        <ReportSection
          title="PR Receiving"
          report-type="pr-receiving"
          v-model:search="search.pr"
          v-model:search-user="searchUser.pr"
          :is-loading="loading.pr"
          @user-selected="(user) => handleUserSelected('pr', user)"
          @search-updated="(data) => handleSearchUpdated('pr', data)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReportSection from "./ReportSection.vue";

// ✅ Today's date
const today = new Date().toISOString().split("T")[0];

// ✅ Reactive states
// const search = ref({
//   mrf: { type: "0", date_from: today, date_to: today, user_id: 0 },
//   direct: { type: "0", date_from: today, date_to: today, user_id: 0 },
//   pr: { type: "0", date_from: today, date_to: today, user_id: 0 },
// });
const search = ref({
  mrf: { type: "0", date_from: today, date_to: today, user_id: 0, receiving_type: "0" },
  direct: { type: "0", date_from: today, date_to: today, user_id: 0, receiving_type: "0" },
  pr: { type: "0", date_from: today, date_to: today, user_id: 0, receiving_type: "0" },
});


const searchUser = ref({
  mrf: { search: "" },
  direct: { search: "" },
  pr: { search: "" },
});

const loading = ref({
  mrf: false,
  direct: false,
  pr: false,
});

// ✅ Auto-initialize with default fetch
onMounted(() => {
  console.log(" Setting default date range:", today);
  ["mrf", "direct", "pr"].forEach((type) => runFetch(type));
});

// ✅ Handle user selection
const handleUserSelected = (reportType, user) => {
  search.value[reportType].user_id = user.id;
  runFetch(reportType);
};

// ✅ Handle search/filter update
const handleSearchUpdated = (reportType, data) => {
  console.log(`🔄 ${reportType} search updated:`, data);
  runFetch(reportType);
};

// ✅ Simulated API calls (with loading indicator)
const runFetch = async (reportType) => {
  loading.value[reportType] = true;

  switch (reportType) {
    case "mrf":
      await listMRFs();
      break;
    case "direct":
      await listItems();
      break;
    case "pr":
      await listPRs();
      break;
  }

  loading.value[reportType] = false;
};

const listMRFs = async () => {
  console.log("📦 Fetching MRF list...");
  await new Promise((res) => setTimeout(res, 1000)); // simulate API delay
};

const listItems = async () => {
  console.log("📦 Fetching Direct Receiving items...");
  await new Promise((res) => setTimeout(res, 1000));
};

const listPRs = async () => {
  console.log("📦 Fetching PR Receiving list...");
  await new Promise((res) => setTimeout(res, 1000));
};
</script>
