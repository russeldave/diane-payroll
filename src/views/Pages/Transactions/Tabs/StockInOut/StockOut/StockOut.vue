<template>
  <button
    @click.prevent="getmrfReceived()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-3 mb-4 float-end text-nowrap"
  >
    <i class="fa fa-box-open"></i> Stock Out
  </button>

  <Modal
    :show="isViewModalOpen"
    :maxWidth="'8xl'"
    title="Stock Out"
    @close="closeModal()"
  >
    <ViewStockOut
    :is_viewing = "false"
    />

  </Modal>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "axios";
import ViewStockOut from './Index.vue'
import { hasPermission } from "@/views/Utility/Permissions";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Modal from "@/views/Component/Modal.vue";

const emits = defineEmits(["transaction_id"]);

const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const loading = ref(false);
const props = defineProps({
  mrfs: Object,
});
const data = ref({
  mrfReceived: [],
  totalrows: 0,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getmrfReceived();
  handlePagination(1);
}, 500);

const getmrfReceived = async () => {
  try { 
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}direct-receiveds/list-direct-and-pr`,
      formData,
      BearToken(token)
    );
       isViewModalOpen.value = true;

       console.log("dsa",response.data);
       
    if (response.data) {
      data.value = response.data;
    } else {
      data.value = { mrfReceived: [], totalrows: 0 };
    }
 
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getmrfReceived();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  getmrfReceived();
};
const handleTypeChange = () => {
  // Reset date format based on type
  if (search.value.type === "2") {
    // For daily, use YYYY-MM-DD format
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    // For monthly, use YYYY-MM format
    search.value.date = new Date().toISOString().slice(0, 7);
  }
getmrfReceived()
};
// onMounted(() => {
//   getmrfReceived();
// });
const fillUserForm = (data) => {
  search.value.user_id = data.id;
  getmrfReceived();
};
const handleTransaction = () => {
  getmrfReceived();
  emits("transaction_id", Math.random() + "transactions-done");
};

const closeModal = () => {
  search.value.search = "";
  isViewModalOpen.value = false;
};
</script>
