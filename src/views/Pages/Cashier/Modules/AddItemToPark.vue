<template>
  <button
    @click="showOrderData()"
    class="border-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] flex items-center text-md lg:text-xl rounded text-nowrap rounded border-white bg-blue-500 text-white p-1"
  >
    <i class="fa fa-car"></i>&nbsp;Park
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'6xl'"
    title="Add item to parked orders."
    @close="isViewModalOpen = false"
  >
    <div v-if="loading" class="p-4">
      <Loader />
    </div>
    <div class="p-4 overflow-x-auto flex justify-center" v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6"
        v-if="data.dinningTables?.length > 0 && !loading"
      >
        <div
          @click.prevent="openNewTablePrompt()"
          class="flex flex-col items-center bg-gray-500 relative justify-center text-white text-wrap text-center w-24 h-24 rounded shadow-lg p-4 cursor-pointer"
        >
          <p class="capitalize text-xs md:text-base uppercase">
            <i class="fa fa-plus fa-2x"></i>
          </p>
          <small class="uppercase font-bold text-nowrap">Add Table</small>
        </div>
        <div
          v-for="(table, tt) in data.dinningTables"
          :key="table.id"
          @click.prevent="addToExistingTableOrder(table), (isCollectModal.value = true)"
        >
          <TableName :key="table.id" :table="table" />
        </div>
      </div>
      <!-- <div class="flex justify-start">
          {{ clientForm }}
      </div> -->
    </div>
  </Modal>
  <Modal
    :show="isOpenNewTableModal"
    :maxWidth="'sm'"
    title="Add New Table"
    @close="isOpenNewTableModal = false"
  >
    <div class="grid grid-cols-1 gap-6 px-3 py-2">
      <div class="">
        <label class="block font-semibold">Table Name:</label>
        <div class="flex">
          <input
            type="text"
            v-model="clientForm.park_name"
            class="focus-visible:bg-yellow-100 px-2 py-2 w-full border"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <button
          @click.prevent="addToParkList()"
          class="border-2 border-black bg-green-500 rounded text-white p-1"
        >
          Save
        </button>
      </div>
    </div>
  </Modal>
  <Modal
    :show="isCollectModal"
    :maxWidth="'6xl'"
    title="Collect"
    @close="isCollectModal = false"
  >
    <div class="grid grid-cols-1 gap-6 px-3 py-2">
      <button @click="isCollectModal = false">Force Close</button>

      <CollectPaymentForm
        :menu_park_id="clientForm.table_id"
        :key="clientForm.table_id"
        :customer="clientForm.customerDetails"
        @transaction_id="handleTransaction"
      />
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
  Toast,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";

import CollectPayment from "./CollectPayment.vue";
import TableName from "./TableName.vue";
import CollectPaymentForm from "./CollectPaymentForm.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const isOpenNewTableModal = ref(false);
const isCollectModal = ref(false);
const data = ref([]);
const items = ref([]);
const loading = ref(false);
const clientForm = ref([]);
const parkButtonClicked = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const showOrderData = async () => {
  isViewModalOpen.value = true;
  await getCustomerOrders();
  console.log("showOrderData");
};

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getCustomerOrders();
  handlePagination(1);
}, 500);

const openNewTablePrompt = (name) => {
  isOpenNewTableModal.value = true;
};

const addToExistingTableOrder = async (table) => {
  clientForm.value.park_name = table.name;
  clientForm.value.park_id = table.id;
  clientForm.value.customer_details = table.customerDetails;
  await addToParkList();
};

const getCustomerOrders = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}dinning-tables/list-in-cashier`,
      { id: 0 },
      BearToken(token)
    );
    data.value = response.data ?? [];
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  getCustomerOrders();
};
const handleTransaction = (transaction_id) => {
  getCustomerOrders();
  emits("transaction_id", Math.random() + "transactions-done");
};

const addToParkList = async () => {
  try {
    // Show confirmation prompt
    const result = await Swal.fire({
      title: "Confirm Park Order",
      text: `Are you sure you want to park this order${
        clientForm.value.park_name ? ` for table "${clientForm.value.park_name}"` : ""
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, park it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we park your order.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    parkButtonClicked.value = true;
    const formData = FormDx(clientForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "menu-sales/add-to-park",
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (response.data) {
      const orderDetails = response.data.orders ?? [];

      Toast("success", "Success", response.data.message);

      clientForm.value = {
        customer_id: 0,
        customer_name: "",
        park_name: "",
        menus: [],
      };

      //saving order details to localstorage for auto fill
      saveOrderDetailsToLocalStorage(orderDetails);

      // Show success toast for autofill
      await Swal.fire({
        title: "Success!",
        text: "Order details have been saved and will be autofilled in the cashier form.",
        icon: "success",
        toast: true, // Enable toast mode
        position: "top-end", // Top-right corner
        showConfirmButton: false, // Hide confirm button for toast
        timer: 3000, // Auto-close after 3 seconds
        timerProgressBar: true, // Show progress bar
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer); // Pause timer on hover
          toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer when hover ends
        },
      });

      isViewModalOpen.value = false;
      emits("transaction_id", clientForm.value.menus);
    }

    isOpenNewTableModal.value = false;
  } catch (error) {
    console.log(error);
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  } finally {
    parkButtonClicked.value = false;
  }
};

const clearOrderLocalStorage = () => {
  localStorage.setItem("customer_name", "Walk-in");
  localStorage.setItem("customer_id", 0);
  localStorage.setItem("park_name", "");
  localStorage.setItem("orders", []);
};

const saveOrderDetailsToLocalStorage = (orderDetails) => {
  // Save customer details
  localStorage.setItem("customer_name", orderDetails.customerName ?? "Walk-in");
  localStorage.setItem("customer_id", orderDetails.customerId ?? 0);
  localStorage.setItem("park_name", orderDetails.parkName ?? "");

  // Map orders to the required format
  const orderFormat = orderDetails.items?.map((item) => ({
    menu_id: item.id,
    menu_name: item.menuTitle,
    price: item.retailPrice,
    quantity: item.quantity,
    total: parseFloat(item.retailPrice) * parseFloat(item.quantity ?? 0),
    discount_id: item.discountId ?? 0,
    discount_value: item.discountValue ?? 0,
    less: item.itemLess ?? 0,
    final_total: parseFloat(item.retailPrice) * parseFloat(item.quantity ?? 0),
    bg_color: item.bgColor,
  }));

  // Save formatted orders to localStorage
  localStorage.setItem("orders", JSON.stringify(orderFormat));

  //save to clientForm;
  clientForm.value.customer_name = orderDetails.customerName ?? "Walk-in";
  clientForm.value.customer_id = orderDetails.customerId ?? 0;
  clientForm.value.park_name = orderDetails.parkName ?? "";
  clientForm.value.menus = orderFormat;
};

const loadData = () => {
  clientForm.value = props.data;
};
onMounted(() => {
  loadData();
});
</script>
