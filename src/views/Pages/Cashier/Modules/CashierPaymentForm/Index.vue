<template>
  <div
    v-if="hasPermission('Navigation_Cashier')"
    class="py-4 px-2 bg-gradient-to-tl from-amber-200 via-amber-300 via-amber-400 to-amber-500 rounded min-h-full"
  >
    <div v-if="showParkList == true">
      <div class="flex justify-between mb-4 border-b pb-2">
        <h2 class="text-md text-black font-bold">Parks List</h2>
        <div class="flex justify-end items-center space-y-2 xl:space-y-0 xl:space-x-2">
          <AllParkedOrders :key="Math.random()" />
          <button
            @click="backToMainMenu"
            class="border-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] border-white flex items-center text-nowrap rounded bg-red-500 text-white p-1"
          >
            <i class="fa fa-arrow-left"></i>&nbsp;Back
          </button>
        </div>
      </div>
      <div>
        <CustomerWithOrders :key="showParkList" />
      </div>
    </div>
    <div v-else class="">
      <div class="flex justify-between mb-0">
        <button
          @click.prevent="showParkList = true"
          class="border-2 h-10 text-nowrap shadow-[4px_4px_0_rgba(0,0,0,0.25)] items-center rounded border-white text-sm bg-purple-500 text-white p-1"
        >
          <i class="fa fa-boxes-packing"></i>
          <span class="inline xs:hidden sm:inline md:hidden lg:inline"
            >&nbsp;Parked Orders</span
          >
        </button>
        <div class="block">
          <div
            class="shadow-[4px_4px_0_rgba(0,0,0,0.25)] bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-2 min-w-[200px]"
          >
            <div class="flex justify-between text-white text-end">
              <!-- <p class="text-sm font-medium mb-1">Grand Total</p> -->
              <i class="fa fa-coins"></i>
              <p class="text-2xl font-bold">
                {{ moneyFormatter(clientForm.grand_total ?? 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 overflow-auto flex justify-end border-t-2 pt-2">
        <button
          @click.prevent="clearCashierForm()"
          class="border-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] flex items-center text-xs lg:text-sm rounded border-white bg-red-500 text-white p-1"
        >
          <i class="fa fa-ban"></i>
          &nbsp;Clear Form
        </button>
      </div>
      <div class="overflow-hidden">
        <label class="block font-semibold">Menus ({{ items.length }}):</label>
        <MenuList
          :key="items.length"
          :data="items"
          @discountData="(menulist) => handleDiscountedMenuData(menulist)"
        />
        <!-- {{menuHasDiscount}} -->
      </div>

      <!-- Service Fee enables -->
      <div class="flex items-center gap-2 mt-0 mb-2">
        <label class="font-semibold">Service Fee:</label>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            v-model="serviceFeeEnabled"
            class="sr-only peer"
            @change.prevent="reComputeGrandTotal"
          />
          <!-- GrandTotal are total of all items -->
          <div
            class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-lime-500 transition-colors"
          ></div>
          <div
            class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"
          ></div>
        </label>
        <span class="text-left text-md text-gray-600">
          <!-- {{ serviceFeeEnabled ? "Enabled" : "Disabled" }} -->
          {{ clientForm.service_fee }}
        </span>
      </div>

      <div v-if="!menuHasDiscount" class="mb-4 overflow-auto">
        <MenuDiscount
          :key="updateKey"
          :data="clientForm"
          @discountData="(orders) => handleDiscountedOrderData(orders)"
        />
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
      <div class="flex justify-between mb-4 px-1">
        <AddItemToPark
          :key="updateKey"
          :data="clientForm"
          @transaction_id="handleParkTransaction"
        />
        <button
          @click.prevent="goToPaymentForm()"
          :class="collectPaymentButtonClicked ? 'opacity-50' : ''"
          :disabled="collectPaymentButtonClicked"
          class="border-2 flex shadow-[4px_4px_0_rgba(0,0,0,0.25)] items-center text-md lg:text-xl rounded border-white bg-green-500 text-white p-1"
        >
          <i
            :class="
              collectPaymentButtonClicked ? 'fa fa-spinner fa-spin' : 'fa fa-money-bills'
            "
          ></i>
          &nbsp;Pay
        </button>
      </div>
    </div>
    <Modal
      :show="isPaymentModalOpen"
      :maxWidth="'2xl'"
      title="Pay Menu"
      @close="isPaymentModalOpen = false"
    >
      <div class="flex justify-between mb-4 px-4 pt-2">
        <div></div>
        <div class="flex justify-end mb-4">
          <div
            class="shadow-[4px_4px_0_rgba(0,0,0,0.25)] bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-4 min-w-[200px]"
          >
            <div class="text-white">
              <p class="text-sm font-medium mb-1">Grand Total</p>
              <p class="text-2xl font-bold">
                {{ moneyFormatter(clientForm.grand_total ?? 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div class="mb-4 px-4 md:col-span-3">
          <label class="block font-semibold">Customer Name:</label>
          <div class="flex">
            <SearchDropdown
              apiEndpoint="customers/search-name-only"
              :searchModel="searchCustomer"
              :key="clientForm.customer_name"
              placeholder="Search/Add Customer"
              itemLabel="name"
              itemId="id"
              :defaultValue="clientForm.customer_name"
              inputId="ingredientName"
              formatLabel="parenthesis"
              className="focus-visible:bg-yellow-100 p-2 w-full border rounded"
              @input.prevent="rememberCustomer"
              @item-selected="(data) => fillCustomer(data)"
              dataKey="customers"
              returnName="['name']"
            />
          </div>
        </div>
        <div class="mb-4 px-4 md:col-span-2">
          <!-- <button @click="addItem" class="border-2 border-black bg-blue-500 rounded text-white p-2">
              <i class="fa fa-plus"></i> Add Item
            </button> -->
          <label class="block font-semibold">Park Name:</label>
          <input
            type="text"
            name=""
            v-model="clientForm.park_name"
            @input.prevent="saveParkName()"
            placeholder="Input Park Name"
            class="focus-visible:bg-yellow-100 p-2 w-full border rounded"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="mb-4 px-4">
          <!-- <button @click="addItem" class="border-2 border-black bg-blue-500 rounded text-white p-2">
              <i class="fa fa-plus"></i> Add Item
            </button> -->
          <label class="block font-semibold">CP Number:</label>
          <input
            type="text"
            name=""
            v-model="clientForm.cp_number"
            placeholder="Input Captain's Pad Number"
            class="focus-visible:bg-yellow-100 p-2 w-full border rounded"
          />
        </div>
        <div class="mb-4 px-4">
          <!-- <button @click="addItem" class="border-2 border-black bg-blue-500 rounded text-white p-2">
              <i class="fa fa-plus"></i> Add Item
            </button> -->
          <label class="block font-semibold">SI Number:</label>
          <input
            type="text"
            name=""
            v-model="clientForm.si_number"
            placeholder="Input SI Number"
            class="focus-visible:bg-yellow-100 p-2 w-full border rounded"
          />
        </div>
      </div>
      <div class="flex justify-end px-4 border-t pt-2">
        <button
          @click.prevent="addMenuPaymentMethod()"
          class="bg-blue-500 shadow-[4px_4px_0_rgba(0,0,0,0.25)] text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm p-2 mb-4 float-end text-nowrap border-2 border-white"
        >
          <i class="fas fa-plus"></i>
          New Payment Method
        </button>
      </div>
      <div class="flex justify-start px-4">
        <label class="block font-semibold">Mode of Payment:</label>
      </div>
      <div class="overflow-auto px-4">
        <table
          class="w-full border-collapse bg-white border-2 border-black text-md uppercase"
        >
          <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
            <tr>
              <th class="text-left text-xs border p-2" width="40%">Payment Method</th>
              <th class="text-left text-xs border p-2" width="40%">Amount</th>
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
                  class="border p-1 w-full text-sm text-left focus-visible:bg-yellow-100"
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
            {{ clientForm.discount_abbre }} Discount Applied Less:{{ clientForm.less }}
          </span>
        </div>
        <div class="flex justify-end space-x-3">
          <span><strong>Service Fee:</strong></span>
          <span>{{ moneyFormatter(clientForm.service_fee ?? 0) }}</span>
        </div>
        <div class="flex justify-end space-x-3">
          <span><strong>Grand Total:</strong></span>
          <span>{{ moneyFormatter(clientForm.grand_total ?? 0) }}</span>
        </div>
      </div>
      <div class="flex justify-end mb-4 p-4 border-t">
        <button
          @click.prevent="collectPayment"
          :class="collectButtonClicked ? 'opacity-50' : ''"
          :disabled="collectButtonClicked"
          class="border-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] text-lg border-white bg-green-500 rounded text-white px-5 py-3"
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
            <p>
              <strong>Customer:</strong>
              {{ receipt.menuSales.customerName ?? clientForm.customer_name }}
            </p>
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
            <span><strong>Service Fee:</strong></span>
            <span>{{ moneyFormatter(receipt.menuSales.serviceFee) }}</span>
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
  </div>
  <div v-else class="relative">
    <Error403 />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import axios from "axios";
import { hasPermission } from "@/views/Utility/Permissions";
import Modal from "@/views/Component/Modal.vue";
import Error403 from "@/views/Error/403.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Paginator from "@/views/Component/Pagination.vue";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
  Alert,
  Toast,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import defaultImage from "@/assets/images/default/noImageAvailable2.png";

import CustomerWithOrders from "@/views/Pages/Cashier/Modules/CustomerWithOrders.vue";
import AllParkedOrders from "@/views/Pages/Cashier/Modules/AllParkedOrders.vue";
import AddItemToPark from "@/views/Pages/Cashier/Modules/AddItemToPark.vue";
import MenuList from "@/views/Pages/Cashier/Modules/CashierPaymentForm/MenuList.vue";
import MenuDiscount from "@/views/Pages/Cashier/Modules/CashierPaymentForm/MenuDiscount.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const showParkList = ref(false);
const isPaymentModalOpen = ref(false);
const isDiscountModalOpen = ref(false);
const receiptModalOpen = ref(false);
const collectPaymentButtonClicked = ref(false);
const parkButtonClicked = ref(false);
const collectButtonClicked = ref(false);
const payment_methods = ref([]);
const serviceFeeEnabled = ref(false); // change default if needed
const hasServiceFee = ref(0); // change default if needed
const serviceFee = ref(0); // change default if needed
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  items: {
    type: Array,
    default: false,
  },
});
const searchCustomer = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const clientForm = ref({
  customer_id: 0,
  customer_name: "",
  park_name: "",
  cp_number: "",
  si_number: "",
  menus: [],
  payment_methods: [
    {
      payment_method_id: 1,
      amount: 0,
    },
  ],
  //discount for all orders
  discount_id: 0,
  discount_value: 0,
  less: 0,
  total_price: 0,
  grand_total: 0,
  service_fee_enabled: false,
  service_fee: 0,
});
const vatRate = ref(0.12); // 12% VAT
const updateKey = ref(0);
const subTotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.final_total, 0)
);
const vatAmount = computed(() => subTotal.value * vatRate.value);
// const totalWithVAT = computed(() => subTotal.value + vatAmount.value);
const totalWithVAT = computed(() => subTotal.value);
const customerName = ref("");
const data = ref([]);
const items = ref([]);
const receipt = ref([]);
const categories = ref([]);

const backToMainMenu = () => {
  showParkList.value = false;
  items.value = [];

  Alert("info", "You are now back to main menu!", "Welcome back to main menu.");
  emits("transaction_id", items.value);
};

const goToPaymentForm = async () => {
  collectPaymentButtonClicked.value = true;
  await paymentMethodDropdown();
  isPaymentModalOpen.value = true;
  collectPaymentButtonClicked.value = false;
};

const menuHasDiscount = ref(false);

const handleDiscountedMenuData = (data) => {
  console.log("Test for grand total not show");
  console.log(data);
  const totalAmount = data?.reduce((sum, item) => sum + item.final_total, 0);
  menuHasDiscount.value = data?.some((item) => item.discount_id > 0);

  clientForm.value.discount_id = 0;
  clientForm.value.less = 0;
  clientForm.value.discount_value = 0;
  clientForm.value.menus = data;
  clientForm.value.grand_total = totalAmount;
  clientForm.value.total_price = totalAmount;
  clientForm.value.service_fee_enabled = serviceFeeEnabled;
  clientForm.value.payment_methods[0].amount = totalAmount;
  console.log(clientForm.value);
  updateKey.value = Math.random();
  emits("transaction_id", data);
};

const handleParkTransaction = (data) => {
  emits("transaction_id", data);
};
const handleDiscountedOrderData = (data) => {
  // console.log("Test for undo remove test, from handleDiscount");
  // console.log(data);
  // clientForm.value.discount_id = data.discount_id;
  // clientForm.value.less = data.less;
  clientForm.value.discount_value = data.value;
  clientForm.value.discount_id = data.discount_id;
  reComputeGrandTotal();
  // clientForm.value.grand_total = data.final_price;
  // clientForm.value.total_price = data.total_price;
  // clientForm.value.total_price = data.total_price;

  // // Assuming clientForm.value.menus is the array you're working with
  // console.log("Test for Handle discount emits");
  // console.log(clientForm);
  // clientForm.value.menus.forEach((menu) => {
  //   // Reset discount values for each menu item
  //   menu.grand_total = 0; // Reset the discount value
  //   menu.discount_id = 0; // Reset the discount ID
  //   menu.less = 0; // Reset the discount amount
  //   menu.final_total = menu.final_total; // Reset the final total to the original total
  //   menu.discount_abbre = "-"; // Reset the discount abbreviation
  // });

  // clientForm.value.payment_methods[0].amount = data.final_price;
};

const addMenuPaymentMethod = () => {
  clientForm.value.payment_methods.push({
    payment_method_id: 1,
    amount: clientForm.value.total_price,
  });
};
const removeMenuPaymentMethod = (index) => {
  clientForm.value.payment_methods.splice(index, 1); // Removes the ingredient at the given index
};

const rememberCustomer = () => {
  const storedName = searchCustomer.value.search ?? "Walk-in";

  localStorage.setItem("customer_name", storedName);
  localStorage.setItem("customer_id", searchCustomer.value.customer_id ?? 0);
};

const fillCustomer = (data) => {
  // Use a fallback value if 'data.name' is not available
  const storedName = data.name || searchCustomer.value.search;

  // Use a fallback value if 'data.id' is 0
  const storedId = data.id !== 0 ? data.id : searchCustomer.value.customer_id ?? 0;

  console.log(storedName);
  // Update form values
  clientForm.value.customer_name = storedName;
  clientForm.value.customer_id = storedId;

  console.log(clientForm.value.customer_name);
  // Store values in localStorage
  localStorage.setItem("customer_name", storedName);
  localStorage.setItem("customer_id", storedId);
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

    collectButtonClicked.value = true;
    clientForm.value.customer_name = localStorage.getItem("customer_name") ?? "Walk-in";
    clientForm.value.customer_id = localStorage.getItem("customer_id") ?? 0;
    const formData = FormDx(clientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/collect-sales`,
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
  } finally {
    collectButtonClicked.value = false;
  }
};

const closeReceipt = () => {
  items.value = [];
  clientForm.value = {
    customer_id: 0,
    customer_name: "",
    park_name: "",
    cp_number: "",
    si_number: "",
    menus: [],
  };

  collectButtonClicked.value = false;
  receiptModalOpen.value = false;
  isPaymentModalOpen.value = false;
  emits("transaction_id", items.value);
};
const saveParkName = () => {
  localStorage.setItem("park_name", clientForm.value.park_name);
};
const init = () => {
  // Merge duplicate items from props.items, if any.
  if (props.items?.length > 0) {
    const mergedItems = [];
    props.items?.forEach((item) => {
      const index = mergedItems.findIndex((merged) => merged.menu_id === item.menu_id);
      if (index !== -1) {
        // Merge the quantities and update the total
        mergedItems[index].quantity += item.quantity;
        mergedItems[index].total =
          parseFloat(mergedItems[index].price) * mergedItems[index].quantity;
      } else {
        mergedItems.push({ ...item });
      }
    });

    items.value = mergedItems;
    clientForm.value.menus = mergedItems;

    menuHasDiscount.value = mergedItems?.some((item) => item.discount_id > 0);
    clientForm.value.total_price = totalWithVAT.value;
    clientForm.value.payment_methods[0].amount = clientForm.value.total_price;
    clientForm.value.grand_total = clientForm.value.total_price;
    clientForm.value.service_fee_enabled = serviceFeeEnabled;
  }

  // Retrieve stored values
  clientForm.value.customer_name = localStorage.getItem("customer_name") ?? "Walk-in";
  clientForm.value.customer_id = localStorage.getItem("customer_id") ?? 0;
  clientForm.value.park_name = localStorage.getItem("park_name");

  updateKey.value = Math.random();
};

const paymentMethodDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}payment-methods/dropdown`,
      BearToken(token)
    );
    payment_methods.value = response.data.paymentMethods ?? [];
  } catch (error) {
    handleApiError(error);
  }
};

const reComputeGrandTotal = async () => {
  try {
    const formData = FormDx(clientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/recompute-service-fee`,
      formData,
      BearToken(token)
    );
    // console.log("Test recompute: ");
    // console.log(response.data.computed.finalTotal);
    // const serviceFee = response.data.serviceFee;
    clientForm.value.grand_total = response.data.computed.finalTotal ?? 0;
    clientForm.value.service_fee = response.data.computed.serviceFee ?? 0;
    clientForm.value.service_fee_enabled = serviceFeeEnabled;
    clientForm.value.less = response.data.computed.less ?? 0;
    clientForm.value.discount_abbre = response.data.computed.discountAbbre ?? "";
    clientForm.value.payment_methods[0].amount = response.data.computed.finalTotal ?? 0;
    // payment_methods.value = response.data.paymentMethods ?? [];
  } catch (error) {
    handleApiError(error);
  }
};

const clearCashierForm = () => {
  // Show confirmation prompt
  Swal.fire({
    title: "Clear Cashier Form?",
    text:
      "Are you sure you want to clear the cashier form? This will remove all saved order details.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, clear it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem("customer_name", "Walk-in");
      localStorage.setItem("customer_id", 0);
      localStorage.setItem("park_name", "");
      localStorage.setItem("orders", JSON.stringify([]));

      closeReceipt();
      // Show success message
      Swal.fire({
        title: "Cleared!",
        text: "The cashier form has been cleared successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      updateKey.value = Math.random();
    }
  });
};

onMounted(() => {
  init();
});
</script>
