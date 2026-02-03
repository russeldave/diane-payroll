<template>
  <div class="p-4 overflow-x-auto">
    <div class="flex justify-between mb-4">
      <h1 class="text-sm text-gray-700">
        <b>Order date:</b> {{ clientForm.date_of_park }}
      </h1>
      <h2 class="text-md text-black font-bold">
        Grand Total:
        <b class="text-4xl md:text-4xl text-amber-600">{{
          moneyFormatter(clientForm.grand_total ?? 0)
        }}</b>
      </h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 py-2 md:gap-6">
      <div class="mb-4">
        <label class="block font-semibold">Customer Name:</label>
        <div class="flex">
          <input
            type="text"
            v-model="clientForm.customer_name"
            disabled
            class="uppercase bg-gray-200 focus-visible:bg-yellow-100 p-1 w-full border"
          />
        </div>
      </div>
      <div class="mb-4">
        <!-- <button @click="addItem" class="border-2 border-black bg-blue-500 rounded text-white p-2">
                  <i class="fa fa-plus"></i> Add Item
              </button> -->
        <label class="block font-semibold">Park Name:</label>
        <input
          type="text"
          name=""
          v-model="clientForm.park_name"
          disabled
          @input.prevent="saveParkName()"
          placeholder="Input Park Name"
          class="uppercase bg-gray-200 focus-visible:bg-yellow-100 p-1 w-full border"
        />
      </div>
    </div>
    <div class="mb-4 overflow-auto">
      <table class="w-full border-collapse bg-white text-md uppercase">
        <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
          <tr>
            <th class="text-left text-xs border p-2" width="30%">Name</th>
            <th class="text-right text-xs border p-2" width="15%">Price</th>
            <th class="text-center text-xs border p-2" width="15%">Quantity</th>
            <th class="text-right text-xs border p-2" width="10%">Total</th>
            <th class="text-left text-xs border p-2" width="10%">Discount</th>
            <th class="text-right text-xs border p-2" width="10%">Grand Total</th>
            <th class="text-center text-xs border p-2" width="30%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="data.parkItems?.length > 0 && !loading"
            v-for="(item, index) in data.parkItems"
            :key="index"
            class="border hover:bg-gray-200"
          >
            <td class="border p-2 text-md text-wrap">{{ item.menuTitle }}</td>
            <td class="border p-2 text-md text-right">{{ item.retailPrice }}</td>
            <td class="border p-2 text-right">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="border p-1 w-full text-left text-md text-red-500 font-bold focus-visible:bg-yellow-100"
                @input="updateTotal(index)"
              />
            </td>
            <td class="border p-2 text-md text-right">{{ item.total?.toFixed(2) }}</td>
            <td class="border p-2 text-xs text-right text-nowrap">
              <span
                v-if="item.discountId > 0"
                class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
              >
                {{ item.discountAbbre }} Discount Applied Less:{{ item.less }}
              </span>
            </td>
            <td class="border p-2 text-md text-right">
              {{ item.finalTotal?.toFixed(2) }}
            </td>
            <td class="border p-2 text-center">
              <div class="flex justify-center">
                <button
                  @click="deleteItem(item)"
                  class="bg-red-500 rounded border border-black text-sm text-white py-1 px-2"
                >
                  <i class="fa fa-trash"></i> Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="data.parkItems?.length == 0 && !loading">
            <td colspan="6" class="border p-2 text-center text-red-500 font-bold">
              <small>No items added!</small>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="border p-2 text-center text-red-500 font-bold">
              <Loader />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="mb-4 border-t pt-4">
        <div class="flex justify-between items-center">
          <span class="font-semibold">Subtotal:</span>
          <span>{{ moneyFormatter(subTotal ?? 0) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-semibold">VAT ({{ vatRate * 100 }}%):</span>
          <span>{{ moneyFormatter(vatAmount ?? 0) }}</span>
        </div>
        <div class="flex justify-between items-center text-xl font-bold">
          <span>Total Amount Due:</span>
          <span class="text-green-600">{{ moneyFormatter(totalWithVAT ?? 0) }}</span>
        </div>
      </div> -->
    <div class="mt-4 text-lg space-y-2 px-4">
      <div class="flex justify-end space-x-3">
        <span><strong>Sub Total:</strong></span>
        <span>{{ moneyFormatter(clientForm.total_price ?? 0) }}</span>
      </div>
      <div class="flex justify-end">
        <span
          v-if="clientForm.discount_id > 0"
          class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
        >
          {{ clientForm.discount_abbre }} Discount Applied Less:{{ clientForm.less }}
        </span>
      </div>
      <div class="flex justify-end space-x-3">
        <span><strong>Grand Total:</strong></span>
        <span>{{ moneyFormatter(clientForm.grand_total ?? 0) }}</span>
      </div>
    </div>
    <div class="flex justify-end py-4">
      <button
        @click.prevent="goToPaymentForm()"
        :class="collectPaymentButtonClicked ? 'opacity-50' : ''"
        :disabled="collectPaymentButtonClicked"
        class="border-2 border-black bg-green-500 rounded text-white p-1"
      >
        <i
          :class="
            collectPaymentButtonClicked ? 'fa fa-spinner fa-spin' : 'fa fa-money-bills'
          "
        ></i>
        Collect
      </button>
    </div>
  </div>
  <Modal
    :show="isPaymentModalOpen"
    :maxWidth="'2xl'"
    title="Pay Menu"
    @close="isPaymentModalOpen = false"
  >
    <div class="flex justify-end mb-4 px-4 pt-2">
      <h2 class="text-md text-black font-bold">
        Grand Total:
        <b class="text-4xl md:text-4xl text-yellow-600">{{
          moneyFormatter(clientForm.grand_total ?? 0)
        }}</b>
      </h2>
    </div>
    <div class="flex justify-end px-4 border-t pt-2">
      <button
        @click.prevent="addMenuPaymentMethod()"
        class="bg-blue-500 text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm p-2 mb-4 float-end text-nowrap border-2 border-black"
      >
        <i class="fas fa-plus"></i>
        New Payment Method
      </button>
    </div>
    <div class="flex justify-start px-4">
      <label class="block font-semibold">Mode of Payment:</label>
    </div>
    <div class="overflow-auto p-4">
      <table
        class="w-full border-collapse bg-white border-2 border-black text-md uppercase"
      >
        <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
          <tr>
            <th class="text-left text-xs border p-2" width="40%">Payment Method</th>
            <th class="text-right text-xs border p-2" width="40%">Amount</th>
            <th class="text-center border p-2" width="10%">
              <i class="fa fa-cog"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="clientForm.payment_methods.length > 0"
            v-for="(item, index) in clientForm.payment_methods"
            :key="index"
            class="border"
          >
            <td class="border p-2 text-xs">
              <select
                v-model="item.payment_method_id"
                class="border p-1 w-full text-sm text-start focus-visible:bg-yellow-100"
              >
                <option value="0">Select Payment Method</option>
                <option
                  v-for="(pm, pp) in payment_methods"
                  :key="pm.value"
                  :value="pm.value"
                >
                  {{ pm.label }}
                </option>
              </select>
            </td>
            <td class="border p-2 text-right">
              <input
                v-model.number="item.amount"
                type="number"
                min="1"
                class="border p-1 w-full text-sm text-end focus-visible:bg-yellow-100"
              />
            </td>
            <td class="border p-2 text-center">
              <button
                @click="removeMenuPaymentMethod(index)"
                class="bg-red-500 rounded text-white p-2"
              >
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="6" class="border p-2 text-center text-red-500 font-bold">
              <small>No items added!</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 text-lg space-y-2 px-4">
      <div class="flex justify-end space-x-3">
        <span><strong>Sub Total:</strong></span>
        <span>{{ moneyFormatter(clientForm.total_price ?? 0) }}</span>
      </div>
      <div class="flex justify-end">
        <span
          v-if="clientForm.discount_id > 0"
          class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
        >
          {{ clientForm.discount_abbre }} Discount Applied Less:{{ clientFormless }}
        </span>
      </div>
      <div class="flex justify-end space-x-3">
        <span><strong>Grand Total:</strong></span>
        <span>{{ moneyFormatter(clientForm.grand_total ?? 0) }}</span>
      </div>
    </div>
    <div class="flex justify-end mb-4 p-4">
      <button
        @click.prevent="collectPayment"
        :class="collectButtonClicked ? 'opacity-50' : ''"
        :disabled="collectButtonClicked"
        class="border-2 border-black bg-green-500 rounded text-white p-1"
      >
        <i
          :class="collectButtonClicked ? 'fa fa-spinner fa-spin' : 'fa fa-money-bills'"
        ></i>
        Collect
      </button>
    </div>
  </Modal>
  <Modal
    :show="receiptModalOpen"
    :maxWidth="'4xl'"
    title="Receipt Details"
    @close="closeReceipt()"
  >
    <div class="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <!-- Receipt Header -->
      <div class="flex justify-between text-sm">
        <div class="space-x-2 space-y-2">
          <h2 class="font-semibold text-xl">Receipt</h2>
          <p>Sales Number: {{ receipt.menuSales.salesNumber }}</p>
          <p>Date: {{ receipt.menuSales.dateOfSales }}</p>
        </div>
        <div class="text-right space-x-2 space-y-2 uppercase">
          <p><strong>Cashier:</strong> {{ receipt.menuSales.cashierUserName }}</p>
          <p><strong>Customer:</strong> {{ receipt.menuSales.customerName }}</p>
        </div>
      </div>

      <!-- Menu Item Details -->
      <div class="border-t-2">
        <h3 class="font-semibold text-lg mt-4">Menu Items</h3>
        <table class="w-full table-auto mt-2 text-sm">
          <thead class="bg-gray-800 text-white">
            <tr class="border-b">
              <th class="text-left p-2">Menu Name</th>
              <th class="text-right p-2">Quantity</th>
              <th class="text-right p-2">Unit Price</th>
              <th class="text-right p-2">Total</th>
              <th class="text-center p-2">Discount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(menu, index) in receipt.menus"
              :key="index"
              :class="index % 2 == 0 ? 'bg-gray-100' : ''"
              class="border-b"
            >
              <td class="p-2">{{ menu.menuName }}</td>
              <td class="p-2 text-right">{{ menu.quantity }}</td>
              <td class="p-2 text-right">{{ moneyFormatter(menu.retailPrice) }}</td>
              <td class="p-2 text-right">{{ moneyFormatter(menu.finalTotal) }}</td>
              <td class="p-2 text-center">
                <!-- Show discount label only if discount_id > 0 -->
                <span
                  v-if="menu.discountId > 0"
                  class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
                >
                  Discount Applied Less:{{ menu.less }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Discount Details -->
      <div v-if="receipt.menuSales.discountId > 0" class="mt-4 space-y-2 border-t-2">
        <!-- <h3 class="font-semibold text-lg">Discount</h3>
                <p class="text-sm">Discount Type: 
                  <span v-if="receipt.menuSales.discountId > 0" class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded">
                      Discount Applied Less:{{ receipt.menuSales.less }}
                  </span>
                </p>
                <p class="text-sm">Discount Value: {{ moneyFormatter(receipt.menuSales.discountValue) }}</p> -->
        <!-- <p class="text-sm">Less: {{ moneyFormatter(receipt.menuSales.less) }}</p> -->
      </div>

      <!-- Grand Total -->
      <div class="mt-4 text-lg space-y-2">
        <div class="flex justify-end space-x-3">
          <span><strong>Sub Total:</strong></span>
          <span>{{ moneyFormatter(receipt.menuSales.grandTotal) }}</span>
        </div>
        <div class="flex justify-end">
          <span
            v-if="receipt.menuSales.discountId > 0"
            class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
          >
            {{ receipt.menuSales.discountAbbre }} Discount Applied Less:{{
              receipt.menuSales.less
            }}
          </span>
        </div>
        <div class="flex justify-end space-x-3">
          <span><strong>Grand Total:</strong></span>
          <span>{{ moneyFormatter(receipt.menuSales.grandFinalTotal) }}</span>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="mt-4 border-t-2">
        <h3 class="font-semibold text-lg">Payment Details</h3>
        <table class="w-full table-auto mt-2 text-sm">
          <thead class="bg-gray-800 text-white">
            <tr class="border-b">
              <th class="text-left p-2">Payment Method</th>
              <th class="text-right p-2">Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(payment, index) in receipt.payments"
              :key="index"
              class="border-b"
            >
              <td class="p-2">{{ payment.paymentMethodName }}</td>
              <td class="p-2 text-right">{{ moneyFormatter(payment.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
  Alert,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  menu_park_id: Number,
  customer: Object,
});
const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const receiptModalOpen = ref(false);
const collectPaymentButtonClicked = ref(false);
const isPaymentModalOpen = ref(false);
const payment_methods = ref([]);
const data = ref([]);
const receipt = ref([]);
const loading = ref(false);
const clientForm = ref({
  customer_id: 0,
  customer_name: "",
  park_name: "",
  menu_park_id: 0,
  date_of_park: "",
  orders: [],
  payment_methods: [
    {
      payment_method_id: 1,
      amount: 0,
    },
  ],
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  menu_park_id: 0,
});

const vatRate = ref(0.12); // 12% VAT
const subTotal = computed(() =>
  data.value.parkItems?.reduce((sum, item) => sum + parseFloat(item.total), 0)
);
const vatAmount = computed(() => subTotal.value * vatRate.value);
// const totalWithVAT = computed(() => subTotal.value + vatAmount.value);
const totalWithVAT = computed(() => subTotal.value);

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getParkMeals();
  handlePagination(1);
}, 500);

const goToPaymentForm = async () => {
  collectPaymentButtonClicked.value = true;
  await paymentMethodDropdown();
  isPaymentModalOpen.value = true;
  collectPaymentButtonClicked.value = false;
};

const addMenuPaymentMethod = () => {
  clientForm.value.payment_methods.push({
    payment_method_id: 1,
    amount: 0,
  });
};

const removeMenuPaymentMethod = (index) => {
  clientForm.value.payment_methods.splice(index, 1); // Removes the ingredient at the given index
};

const getParkMeals = async () => {
  try {
    loading.value = true;
    search.value.menu_park_id = props.menu_park_id;

    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/get-park-items`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};

const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  getParkMeals();
};
const closeReceipt = () => {
  items.value = [];
  clientForm.value = {
    customer_id: 0,
    customer_name: "",
    park_name: "",
    menus: [],
  };

  collectButtonClicked.value = false;
  receiptModalOpen.value = false;
  isPaymentModalOpen.value = false;
  emits("transaction_id", Math.random());
};

const collectPayment = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process your payment.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(clientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/collect-park`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    if (response.data) {
      receipt.value = response.data;
      receiptModalOpen.value = true;
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const deleteItem = async (data) => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we remove this transaction.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx({order_item_id: data.id});
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/delete-item-in-park`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    Alert("success", "Success", response.data.message);

    getParkMeals();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const showOrderData = async () => {
  isViewModalOpen.value = true;
  await getParkMeals();

  const paymentData = data.value;

  clientForm.value.menu_park_id = props.menu_park_id;
  clientForm.value.customer_id = props.customer.id;
  clientForm.value.customer_name = props.customer.customerName;
  clientForm.value.park_name =
    props.customer.name == "null" ? "No Name" : props.customer.name;
  clientForm.value.date_of_park = props.customer.dateOfPark;
  clientForm.value.orders = paymentData.parkItems;

  clientForm.value.discount_id = paymentData.park.discountId ?? 0;
  clientForm.value.less = paymentData.park.less ?? 0;
  clientForm.value.discount_value = paymentData.park.discountValue ?? 0;
  clientForm.value.grand_total = paymentData.park.grandFinalTotal ?? 0;
  clientForm.value.total_price = paymentData.park.grandTotal ?? 0;

  clientForm.value.payment_methods[0].amount = paymentData.park.grandFinalTotal ?? 0;
  console.log(clientForm.value);
};
const paymentMethodDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}payment-methods/dropdown`,
      BearToken(token)
    );
    payment_methods.value = response.data.paymentMethods ?? [];
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};

onMounted(() => {
  showOrderData();
})
</script>
