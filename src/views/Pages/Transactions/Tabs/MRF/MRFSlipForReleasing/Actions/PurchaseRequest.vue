<template>
  <div @click.stop>
  <button
    @click="addPRBehavior()"
    :disabled="props.data == 0"
    :class="props.data == 0 ? 'opacity-50' : ''"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-file-invoice me-2"></i>
    <span class="hidden md:inline">Add Item to PR</span>
    <span class="inline md:hidden" title="Add Item to PR">Add Item</span>
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Create Purchase Request"
    @close="isAddModalOpen = false"
    >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addToPR()">
        <div class="grid grid-cols-2 gap-6">
          <div class="mb-4 col-span-2 md:col-span-1">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PR Manual No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="prForm.pr_manual_number"
              placeholder="Input PR Manual Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 col-span-2 md:col-span-1">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Destination Location</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <select
                  id="warehouse-select"
                  placeholder="Select Warehouse"
                  class="mt-1 p-2 border rounded-md w-full"
                   v-model="prForm.destination_warehouse_id"
              >
                  <option v-for="(w, index) in warehouse" :key="index" :value="w.warehouseId">
                  {{ w.warehouseName }}
                  </option>
                  <option value="0">All</option>
              </select>
          </div>
        </div>
        <!-- Mobile view: Form-like layout -->
        <div v-if="isMobile" class="block lg:hidden">
          <div
            v-for="(i, ii) in prForm.items"
            v-if="prForm.items.length > 0"
            :key="ii"
            class="mb-4 p-4 border rounded-lg shadow"
          >
            <!-- Item Dropdown -->
            <div class="mb-2">
              <label
                for="itemsName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Item</label
              >
              <input
                type="text"
                placeholder="Input Item Name"
                v-model="i.item_name"
                required
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >MRF Request</label>
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.requested_quantity"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Item Quantity"
                  disabled
                  step="any"
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>
            <!-- Quantity and Units -->
            <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >PR quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.quantity"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  class="p-2 border border-red-500 rounded-l-md w-full"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>
            <!-- Remarks -->
            <div class="mb-2">
              <label
                for="remarks"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Remarks</label
              >
              <textarea
                v-model="i.remarks"
                placeholder="Input Item Remarks"
                class="mt-1 p-2 border rounded-md w-full"
                id="remarks"
              ></textarea>
            </div>

            <!-- Remove Item Button -->
            <div class="flex justify-center">
              <button
                @click.prevent="removeItemField(ii)"
                type="button"
                title="Remove Item"
                class="bg-red-500 text-white rounded font-bold text-md md:text-lg py-2 px-4"
              >
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>

          <p
            v-if="prForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
         <!-- Desktop view: table-like layout -->
        <div class="mb-4 overflow-auto" v-else>
          <label
            for="LeagueName"
            class="block text-sm font-medium mb-3 text-gray-700"
            >Items:</label
          >
          <!-- <button
            @click.prevent="generateItemField()"
            type="button"
            class="px-4 py-2 font-bold hover:bg-blue-500 bg-blue-600 mb-2 rounded shadow text-white text-md float-right"
          >
            <i class="fa fa-plus"></i> Add Billing Row
          </button> -->
          <div class="w-full whitespace-nowrap overflow-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <!-- Table headers -->
                <thead class="text-white shadow" :class="DEFAULT_BG">
                  <tr class="border border-solid text-nowrap ">
                    <th
                      scope="col"
                      width="30%"
                      class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                    >
                      Item Name
                    </th>
                    <th
                      scope="col"

                      class="px-2 py-3 text-left text-sm ont-medium uppercase tracking-wider border border-solid bg-blue-500"
                    >
                    MRF Request
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid bg-red-500"
                    >
                      PR quantity
                    </th>
                    <th
                      scope="col"

                      class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid bg-green-500"
                    >
                      Cost Price
                    </th>

                    <th
                      scope="col"
                      class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      width="10%"
                      class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <!-- Loop through products and display them -->
                  <tr
                    v-for="(i, ii) in prForm.items"
                    v-if="prForm.items.length > 0"
                    :key="ii"
                    class="border border-solid text-sm hover:bg-gray-100"
                  >
                    <td class="px-2 py-3 border border-solid">
                      <!-- <select
                              placeholder="Select Building Name"
                              class="mt-1 p-2 border rounded-md w-full"
                              v-model="i.item_id"
                              >
                              <option value="0">--Select Item--</option>
                              <option v-for="(i,ii) in items" :key="i.value" :value="i.value">{{ i.label }}</option>
                              </select> -->
                      <div class="flex items-center mt-1">
                        <input
                          type="text"
                          placeholder="Input Item Name"
                          v-model="i.item_name"
                          @input.prevent="searchItemBehavior(ii, i.item_name)"
                          required
                          disabled
                          class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                        />
                      </div>
                      <div
                        class="absolute bg-white shadow z-50"
                        v-if="search.search != '' && activeItemIndex == ii"
                      >
                        <ul class="">
                          <li
                            class="p-1 border-l-2 border-lime-200 flex py-2 font-bold shadow text-gray-600"
                            @click.prevent="fillItemsForm(item, ii)"
                            v-for="(item, index) in items"
                            :key="index"
                          >
                            {{ item.sku }} - {{ item.name }}
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td class="px-2 py-3 border border-solid">
                      <div class="flex">
                        <input
                          type="number"
                          id="ProductName"
                          v-model="i.requested_quantity"
                          min="1"
                          placeholder="Input Item Quantity"
                          disabled
                          step="any"
                          class="p-2 border rounded-l-md w-full bg-gray-200"
                        />
                        <button
                          type="button"
                          class="border border-l-0 rounded-r-md px-3 bg-blue-500 text-white hover:bg-gray-300"
                        >
                          {{ i.unit_abbre }}
                        </button>
                      </div>
                    </td>
                    <td class="px-2 py-3 border border-solid">
                      <div class="flex">
                        <input
                          type="number"
                          id="ProductName"
                          v-model="i.quantity"
                          min="1"
                          step="any"
                          placeholder="Input Item Quantity"
                          class="p-2 border border-red-500 rounded-l-md w-full"
                        />
                        <button
                          type="button"
                          class="border border-l-0 rounded-r-md px-3 bg-red-500 text-white hover:bg-gray-300"
                        >
                          {{ i.unit_abbre }}
                        </button>
                      </div>
                    </td>
                    <td class="px-2 py-3 border border-solid">
                      <div class="flex">
                        <input
                          type="number"
                          id="ProductName"
                          disabled
                          v-model="i.pr_price"
                          step="any"
                          placeholder="Input Item Price"
                          class="p-2 border border-green-500 rounded-l-md w-full bg-gray-200"
                        />
                        {{ i.pr_price }}
                      </div>
                    </td>
                    <!-- <td class="px-2 py-3 border border-solid">
                      <div class="flex justify-center" v-if="i.item_id != 0">
                        {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
                      </div>
                    </td> -->
                    <td class="px-2 py-3 border border-solid">
                      <textarea
                        v-model="i.remarks"
                        placeholder="Input Item Remarks"
                        class="mt-1 p-2 border rounded-md w-full"
                      ></textarea>
                    </td>
                    <td class="px-2 py-3 border border-solid">
                      <div class="flex justify-center">
                        <button
                          @click.prevent="removeItemField(ii)"
                          type="button"
                          class="bg-red-500 text-white rounded font-bold rounded-r text-sm md:text-sm py-2 px-4 mb-4 float-end text-nowrap"
                        >
                          <i class="fas fa-trash"></i>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-else>
                    <td class="px-2 py-3 border border-solid" colspan="11">
                      <p class="text-red-500 font-bold text-center">
                        **No items found**
                      </p>
                    </td>
                  </tr>
                  <!-- item_id: 0,
                        item_name: '',
                        quantity: 0,
                        description: '',
                        remarks: '',
                        room_location_number: 0, -->
                </tbody>
              </table>
          </div>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="prForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="prForm.items.length == 0"
            :class="prForm.items.length == 0 ? 'opacity-50' : ''"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
   </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  COMPANIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const default_warehouse_id = ref(localStorage.getItem('defaultWarehouse'));
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});
const isAddModalOpen = ref(false);
const users = ref([]);
const items = ref([]);
const companies = ref([]);
const warehouse = ref([]);
const activeItemIndex = ref(0);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const prForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  requested_to_user_id: 0,
  requested_to_user_name: "",
  destination_warehouse_id: 0,
  remarks: "",
  pr_manual_number: "",
  pr_price: 0,
  items: [],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

//itemd dropdown
const listItems = async () => {
  try {
    items.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}items/list`,
      formData,
      BearToken(token)
    );
    items.value = response.data.items;
  } catch (error) {
    handleApiError(error);
  }
};
const searchItemBehavior = (index, name) => {
  search.value.search = name;
  activeItemIndex.value = index;
  if (search.value.search?.length == 0) {
    prForm.value.items[index].mrf_item_id = 0;
  }
  listItems();
};
const fillItemsForm = (item, index) => {
  prForm.value.items[index] = item;
  search.value.search = "";
};
//location dropdown
const listUsers = async () => {
  try {
    items.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}users/list`,
      formData,
      BearToken(token)
    );
    users.value = response.data.users;
  } catch (error) {
    handleApiError(error);
  }
};
const searchUserBehavior = (name) => {
  searchUser.value.search = name;
  if (searchUser.value.search?.length == 0) {
    prForm.value.requested_to_user_id = 0;
  }
  listUsers();
};
const fillUserForm = (item) => {
  prForm.value.requested_to_user_id = item.id;
  prForm.value.requested_to_user_name = item.name;

  searchUser.value.search = "";
};
//add
const addPRBehavior = () => {
  // console.log("addPRBehavior");
  // console.log(props); 
  resetForm();
  companiesDropdown();
  warehouseDropdown();
  prForm.value.items = props.data;
  prForm.value.destination_warehouse_id = default_warehouse_id.value;
  isAddModalOpen.value = true;
};
const resetForm = () => {
  prForm.value.mrf_id = 0;
  prForm.value.date_now = DATE_NOW();
  prForm.value.remarks = "";
  prForm.value.pr_manual_number = "";
  prForm.value.requested_to_user_id = 0;
  prForm.value.items = [];
};
const addToPR = async () => {
  console.log("addToPR");
  console.log(props);
  try {
    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = FormDx(prForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/add`,
      formData,
      BearToken(token)
    );
    
    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
const warehouseDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}users/get-warehouses`,
      BearToken(token)
    );
    if(!response.data.error) {
        warehouse.value = response.data.warehouses;
    }
  } catch (error) {
    // Handle the error (log, throw, etc.)
    console.error("Error fetching list warehouse:", error);
    return []; // You may want to handle errors more gracefully based on your use case
  }
};
// const generateItemField = async () => {
//   let item_data = {
//     item_id: 0,
//     item_name: "",
//     quantity: 0,
//     description: "",
//     remarks: "",
//     room_location_number: 0,
//     /* other charge properties */
//   };

//   // Assuming salesForm.charges is an array
//   prForm.value.items.push(item_data);
// };
const removeItemField = (index) => {
  // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
  prForm.value.items.splice(index, 1);
};
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
// Watch for screen size changes
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
watch(() => window.innerWidth, handleResize);
onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>
