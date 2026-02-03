<template>
  <button
    @click="openModal()"
    type="button"
    class="bg-violet-600 text-white hover:opacity-70 focus:bg-blue-400 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110"
  >
    <!-- <i class="fa fa-file"></i>  -->
    History
  </button>

    <Modal
    :show="isViewModalOpen"
    :maxWidth="'8xl'"
    title="History"
    @close="closeModal"
  >
    <div class="border-b border-gray-200 mb-4">
      <nav class="flex -mb-px overflow-x-auto" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200',
            activeTab === tab.key
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <i :class="tab.icon" class="mr-2"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="loading" class="px-2 py-2 border text-center" colspan="10">
      <Loader />
    </div>

    <div v-else class="p-4 overflow-x-auto">
      <AllHistory
        v-if="activeTab === 'allHistory'"
        :show="true"
        :ingredientIdNumber="data.ingredient_id_number"
        :activeTTab="activeTab" 
      />
      <MrfHistory
        v-if="activeTab === 'mrf'"
        :show="true"
        :activeTTab="activeTab" 
      />
      <PrHistory
        v-if="activeTab === 'pr'"
        :show="true"
        :activeTTab="activeTab" 
      />
    </div>
    <div class="flex w-full overflow-auto">
            <Paginator
                v-if="data.totalrows > 0 && !loading"
                :page_number="search.page_num"
                :total_rows="data.totalrows"
                :itemsperpage="search.itemsperpage"
                @page_num="handlePagination"
            />
       </div>
  </Modal>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, handleApiError } from "@/views/Utility/Helper.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import MrfHistory from "./Histories/MrfHistory.vue";
import PrHistory from "./Histories/PrHistory.vue";
import AllHistory from "./Histories/AllHistory.vue";

const emits = defineEmits(["transaction_id"]);

const props = defineProps({
  data: Object
});

const isViewModalOpen = ref(false);
const loading = ref(false);
const activeTab = ref("allHistory");

const data = ref({
  mrfReceived: [],
  totalrows: 0,
  ingredient_id_number: props.data.ingredientIdNumber
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 1
});


const tabs = [
  { key: "allHistory", label: "All History", icon: "fa fa-list" },
  { key: "mrf", label: "MRF History", icon: "fa fa-list" },
  { key: "pr", label: "PR History", icon: "fa fa-box" },
];

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;

};

const openModal = () => {
  // console.log("open modal of history parent")
  // console.log(props.data.ingredientIdNumber);
  isViewModalOpen.value = true;
};

const closeModal = () => {
  isViewModalOpen.value = false;
};
</script>