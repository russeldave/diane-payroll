<template>
  <button
    @click.prevent="receiveItemBehavior()"
    class="bg-green-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-hands"></i>
    Receive
  </button>
  <Modal
    :show="isReceiveItemModalOpen"
    :maxWidth="'2xl'"
    title="Receive Item For Purchase Order"
    @close="isReceiveItemModalOpen = false"
  >
    <div class="block gap-6 p-6">
      <form class="mt-0 grid grid-cols-2 gap-6" @submit.prevent="directReceiveItem()">
        <div class="mb-4 md:col-span-2">
             <div class="space-y-2">
            <!-- Date of PR -->
            <div class="border-2 border-gray-400 rounded-lg p-2 bg-gray-100">
              <label class="block text-sm font-bold text-gray-900 mb-1">
                Date of PR: {{ props.data.dateOfPr }}
              </label>
            </div>
            <div class="border-2 border-gray-400 rounded-lg p-2 bg-gray-100">
              <label class="block text-sm font-bold text-gray-900 mb-1">
                Remarks: {{ props.data.prRemarks }}
              </label>
            </div>
          
          <!-- building_id,contact_info,address,geo_map,remarks. -->
           <div class="border border-gray-400 border-2 rounded-lg p-2 bg-gray-200">
            <span>
              {{ receiveForm.ingredient_id_number }} - 
            </span>
            <span class="font-bold">
              {{ receiveForm.item_name }}
            </span>
            <span class="italic text-red-500">
              [{{ receiveForm.unit_abbre }}]
            </span>
           </div>
             </div>
          <!-- <input
            type="text"
            id="ProductName"
            disabled
            v-model="receiveForm.item_name"
            required
            placeholder="Item Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          /> -->
        </div>
        <div class="mb-4 md:col-span-2">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Expiration Date </label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="date"
            id="expirationDate"
            v-model="receiveForm.expiration_date"
            placeholder="Expiration Date"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Supplier  (<i class="text-red-500">Optional</i>)</label
          >
          <div class="flex items-center mt-1">
            <SearchDropdown
              apiEndpoint="suppliers/list"
              :searchModel="searchSupplier"
              placeholder="Search Supplier"
              itemLabel="name"
              itemId="id"
              inputId="supplierName"
              :defaultValue="receiveForm.supplier_name"
              @item-selected="(data) => fillSupplierForm(data)"
              dataKey="suppliers"
              returnName="['name','supplierNumber']"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Invoice No. (<i class="text-red-500">Optional</i>)</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            v-model="receiveForm.invoice_number"
            placeholder="Input Invoice No."
            autocomplete="off"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Serial No. (<i class="text-red-500">Optional</i>)</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="SerialName"
            v-model="receiveForm.serial_number"
            placeholder="Input Serial No."
            autocomplete="off"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Model No. (<i class="text-red-500">Optional</i>)</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ModelName"
            v-model="receiveForm.model_number"
            placeholder="Input Model No."
            autocomplete="off"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Purchase Order No. (<i class="text-red-500">Optional</i>)</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            v-model="receiveForm.po_number"
            autocomplete="off"
            placeholder="Input Purchase Order No."
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Receiving Warehouse</label
          >
          <select
            placeholder="Select Building Name"
            class="mt-1 p-2 border rounded-md w-full"
            required
            v-model="receiveForm.warehouse_id"
          >
            <option value="0">--Select Warehouse--</option>
            <option v-for="(w, ww) in warehouses" :key="w.id" :value="w.warehouseId">
              {{ w.warehouseName }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Recieving Price
          </label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <div class="flex">
            <input
              type="text"
              id="ProductName"
              
              required
              :value="formatNumber(receiveForm.recieving_price)"
              autocomplete="off"
              placeholder="Recieving Price"
              class="mt-1 p-2 border rounded-md w-full"
              @input="handleReceivingPriceInput($event)"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Price per Item (<i class="text-red-500">{{
              receiveForm.prev_cost_price ?? 0
            }}</i
            >)</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <div class="flex">
            <input
              type="number"
              id="ProductName"
              disabled
              v-model="receiveForm.price"
              autocomplete="off"
              placeholder="Input Price"
              class="mt-1 p-2 border rounded-md w-full bg-gray-300"
            />
            <button
              type="button"
              class="flex items-center gap-1 rounded-r p-2"
              :class="{
                'text-red-600': priceChangeIcon === 'up',
                'text-green-600': priceChangeIcon === 'down',
                'text-gray-500': priceChangeIcon === 'equal',
              }"
              v-if="priceChangeIcon != 'equal'"
            >
              <i
                v-if="priceChangeIcon === 'up'"
                class="fa fa-arrow-up"
                aria-hidden="true"
              ></i>
              <i
                v-else-if="priceChangeIcon === 'down'"
                class="fa fa-arrow-down"
                aria-hidden="true"
              ></i>
              <span v-else>–</span>

              <span>{{ priceChangeIcon === "equal" ? "" : priceChangePercent }}</span>
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Received Quantity</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <!-- :value="formatNumber(receiveForm.received_quantity)" -->
          <div class="flex">
            <input
              type="text"
              
              id="ProductName"
              min="0"
              required
              autocomplete="off"
              :value="formatNumber(receiveForm.received_quantity)"
              class="mt-1 p-2 border rounded-md w-full"
              @input="handleQuantityInput($event)"
            />
          
            <button type="" class="bg-red-500 p-2 text-white rounded-r">
              {{ receiveForm.unit_abbre }}
            </button>
          </div>
        </div>
        <div class="mb-4 md:col-span-2">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Remarks (<i class="text-red-500">Optional</i>)</label
          >
          <textarea
            v-model="receiveForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="mb-4 md:col-span-2">
          <label for="itemImages" class="block text-sm font-medium text-gray-700"
            >Item Image</label
          >
          <input
            type="file"
            id="itemImages"
            @change="handleImageUpload"
            multiple
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="flex justify-end md:col-span-2">
          <button
            type="submit"
            :disabled="receiveForm.received_quantity <= 0"
            :class="receiveForm.received_quantity <= 0 ? 'opacity-50' : ''"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import AddSupplier from "@/views/Pages/Suppliers/Actions/Add.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, WAREHOUSE, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const searchSupplier = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  warehouse_id: Number,
});
const formatNumber = (value) => {
  if (!value && value !== 0) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  
  // Format with commas and 2 decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};
const handleQuantityInput = (event) => {
  const rawValue = event.target.value.replace(/,/g, '');
  const numValue = parseFloat(rawValue) || 0;
  
  // Update the reactive value
  receiveForm.value.received_quantity = numValue;
  
  // Recompute price
  computeReceivingPrice(receiveForm.value.received_quantity);
};
const handleReceivingPriceInput = (event) => {
  const rawValue = event.target.value.replace(/,/g, '');
  const numValue = parseFloat(rawValue) || 0;
  
  // Update the reactive value
  receiveForm.value.recieving_price = numValue;
  
  // Recompute price per item
  computePricePerItem(numValue);
};
const isReceiveItemModalOpen = ref(false);
const warehouses = ref([]);
const imageFiles = ref([]);

const receiveForm = ref({
  supplier_id: 0,
  serial_number:'',
  item_id: 0,
  received_quantity: 0,
  recieving_price: 0,
  invoice_number: "",
  po_number: "",
  price: 0,
  warehouse_id: 0,
});

const receiveItemBehavior = async () => {
  const data = props.data;

  resetForm();
  console.log(data);
  receiveForm.value.pr_item_id = data.id;
  receiveForm.value.item_name = data.ingredientName;
  receiveForm.value.ingredient_id_number = data.ingredientIdNumber;
  receiveForm.value.unit_abbre = data.unitAbbre ?? "none";
  receiveForm.value.item_sku = data.itemSku;
  receiveForm.value.warehouse_id = data.receivedByWarehouseId ?? 0;
  receiveForm.value.supplier_name = data.supplierName ?? "";
  receiveForm.value.supplier_id = data.supplierId ?? 0;
  receiveForm.value.prev_cost_price = data.price ?? 0;
  receiveForm.value.serial_number = '';
  receiveForm.value.recieving_price = data.price * data.conversionRate;
  receiveForm.value.price = data.price ?? 0;
  receiveForm.value.received_quantity = 0;
  receiveForm.value.model_number = '';
  isReceiveItemModalOpen.value = true;
  // computePricePerItem(data.price);
  getWarehouses();
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillSupplierForm = (item) => {
  receiveForm.value.supplier_id = item.id;
  receiveForm.value.supplier_name = item.name + " / " + item.supplierNumber;

  searchSupplier.value.search = "";
};
//warehouse dropdown
const resetForm = () => {
  receiveForm.value = {
    date_now: DATE_NOW(),
    item_id: 0,
    received_quantity: 0,
    invoice_number: "",
    po_number: "",
    price: 0,
    warehouse_id: 0,
  };
  // emits("transaction_id", Math.random());
};

const directReceiveItem = async () => {
  // console.log("directReceiveItem");
  // console.log(props.data);
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(receiveForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("item_images[]", file); // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-item-in/pr-in-one-item`,
      formData,
      BearToken(token)
    );

    Swal.close();
    // Close the modal
    isReceiveItemModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const getWarehouses = async () => {
  try {
    warehouses.value = [];
    const response = await axios.post(
      `api/users/warehouses-dropdown`,
      { id: 0 }
    );
    warehouses.value = response.data.userWarehouses || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};

const checkCostPriceMargin = (current_price, prev_price) => {
  if (current_price > prev_price) return "up";
  if (current_price < prev_price) return "down";
  return "equal";
};

const priceChangeIcon = computed(() =>
  checkCostPriceMargin(receiveForm.value.price, receiveForm.value.prev_cost_price)
);

const computePricePerItem = (RecievingPrice) => {
  const pricePerItem = RecievingPrice/receiveForm.value.received_quantity;
  receiveForm.value.price = pricePerItem.toFixed(2);
}

const computeReceivingPrice = (pricePerItem) => {
  const pricePerItem2 = receiveForm.value.recieving_price / receiveForm.value.received_quantity;
  receiveForm.value.price = pricePerItem2.toFixed(2);
}

const priceChangePercent = computed(() => {
  if (receiveForm.value.prev_cost_price === 0) return "–";
  const diff = receiveForm.value.price - receiveForm.value.prev_cost_price;
  const percent = (diff / receiveForm.value.prev_cost_price) * 100;
  return percent.toFixed(2) + "%";
});
</script>
