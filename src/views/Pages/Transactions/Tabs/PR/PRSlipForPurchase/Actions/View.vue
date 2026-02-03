<template>
  <button
    @click="(isAddModalOpen = true), viewPRBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 rounded-l text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="View Purchase Request"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editPR()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PR No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="prForm.pr_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >PR Date.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="prForm.date_now"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Manual No.</label
            >
          
            <input
              type="text"
              id="ProductName"
              v-model="prForm.pr_manual_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div> -->
          <div class="mb-4 col-span-2 md:col-span-1">
            <label
              for="estimatedArrival"
              class="block text-sm font-medium text-gray-700"
              >Estimated Date of Arrival</label
            >
            <input
              type="date"
              id="estimatedArrival"
              disabled
              v-model="prForm.estimated_arrival"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Requested To.</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="prForm.requested_by_user_name"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div> -->
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Warehouse Destination</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="prForm.full_destination"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
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
            placeholder="Input Building Remarks"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          ></textarea>
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
                >MRF'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.mrf_quantity"
                  autocomplete="off"
                  min="1"
                  placeholder="Input Item Quantity"
                  disabled
                  step="any"
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-lime-500 text-white hover:bg-gray-300"
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
                >PR'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.quantity"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  disabled
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-green-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div>
            <!-- Quantity and Units -->
            <!-- <div class="mb-2">
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >PO'ed Quantity</label
              >
              <div class="flex">
                <input
                  type="number"
                  id="ProductName"
                  v-model="i.po_quantity"
                  min="1"
                  step="any"
                  placeholder="Input Item Quantity"
                  disabled
                  class="p-2 border rounded-l-md w-full bg-gray-200"
                />
                <button
                  type="button"
                  class="border border-l-0 rounded-r-md px-3 bg-yellow-500 text-white hover:bg-gray-300"
                >
                  {{ i.unit_abbre ?? "-" }}
                </button>
              </div>
            </div> -->
            <!-- Quantity per Unit -->
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Quantity per Unit</label
              >
              <div
                class="mt-1 p-2 border rounded-l-md w-full bg-gray-200"
                v-if="i.item_id != 0"
              >
                {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
              </div>
              <div
                class="mt-1 p-2 border rounded-l-md w-full text-red-500"
                v-else
              >
                Please select Item!
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
                disabled
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                id="remarks"
              ></textarea>
            </div>
          </div>

          <p
            v-if="prForm.items.length === 0"
            class="text-red-500 font-bold text-center"
          >
            **No items found**
          </p>
        </div>
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
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="text-white shadow" :class="DEFAULT_BG">
              <tr class="border border-solid text-nowrap">
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Item Name
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm ont-medium uppercase tracking-wider border border-solid bg-red-500"
                >
                  MRF
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-green-500"
                  >
                  PR'ed
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium tracking-wider border border-solid bg-cyan-500"
                  >
                  PR Price
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 text-right text-sm font-medium tracking-wider border border-solid bg-yellow-500"
                >
                  PO'ed
                </th> -->
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Remarks
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm font-medium uppercase tracking-wider border border-solid"
                >
                  Actions
                </th> -->
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
                    <!-- <input
                      type="text"
                      placeholder="Input Item Name"
                      v-model="i.item_name"
                      @input.prevent="searchItemBehavior(ii, i.item_name)"
                      required
                      disabled
                      class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                    /> -->
                    <ItemTitle
                      :item_id="i.item_id"
                      :key="i.item_id"
                      :item_name="i.item_name"
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
                      v-model="i.mrf_quantity"
                      min="1"
                      placeholder="Input Item Quantity"
                      disabled
                      step="any"
                      class="p-2 border rounded-l-md w-full bg-gray-200"
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
                      v-model="i.quantity"
                      min="1"
                      step="any"
                      placeholder="Input Item Quantity"
                      disabled
                      class="p-2 border border-red-500 rounded-l-md w-full bg-gray-200"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-green-500 text-white hover:bg-gray-300"
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
                      v-model="i.pr_price"
                      min="1"
                      step="any"
                      placeholder="Input pr PRice"
                      disabled
                      class="p-2 border border-cyan-500 rounded-l-md w-full bg-gray-200"
                    />
                  </div>
                </td>
                <!-- <td class="px-2 py-3 border border-solid">
                  <div class="flex">
                    <input
                      type="number"
                      id="ProductName"
                      v-model="i.po_quantity"
                      min="1"
                      placeholder="Input Item Quantity"
                      disabled
                      step="any"
                      class="p-2 border rounded-l-md w-full bg-gray-200"
                    />
                    <button
                      type="button"
                      class="border border-l-0 rounded-r-md px-3 bg-yellow-500 text-white hover:bg-gray-300"
                    >
                      {{ i.unit_abbre }}
                    </button>
                  </div>
                </td> -->
                <!-- <td class="px-2 py-3 border border-solid">
                  <div
                    class="p-2 border rounded w-full bg-gray-200"
                    v-if="i.item_id != 0"
                  >
                    {{ i.quantity_per_unit }} /{{ i.unit_abbre }}
                  </div>
                </td> -->
                <td class="px-2 py-3 border border-solid">
                  <textarea
                    v-model="i.pr_remarks"
                    placeholder="Input Item Remarks"
                    disabled
                    class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                  ></textarea>
                </td>
                <!-- <td class="px-2 py-3 border border-solid">
                  <div class="flex justify-center">
                    <EditPRItem v-if="hasPermission('PR_Slip_Item_Edit_Button')" :data="i" @transaction_id="handleTransaction" />
                    <DeletePRItem v-if="hasPermission('PR_Slip_Item_Delete_Button')" :data="i" @transaction_id="handleTransaction" />
                  </div>
                </td> -->
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
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="prForm.remarks"
            placeholder="Input Remarks"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          ></textarea>
        </div>
        <!-- <div class="flex justify-end">
          <button
            type="submit"
            :disabled="prForm.items.length == 0"
            :class="prForm.items.length == 0 ? 'opacity-50' : ''"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div> -->
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
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

import { hasPermission } from "@/views/Utility/Permissions";
import DeletePRItem from "./DeletePRItem.vue";
import EditPRItem from "./EditPRItem.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";

const token = localStorage.getItem("token");
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
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const items = ref([]);
const companies = ref([]);
const activeItemIndex = ref(0);
const prForm = ref({
  pr_id: 0,
  date_now: DATE_NOW(),
  requested_to_user_id: 0,
  requested_to_user_name: "",
  requested_by_user_id: 0,
  requested_by_user_name: "",
  full_destination: "",
  estimated_arrival: "",
  remarks: "",
  pr_manual_number: "",
  pr_number: "",
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

//add
const viewPRBehavior = () => {
  resetForm();
  fillForm();
  companiesDropdown();
};
const fillForm = () => {
  const data = props.data;
  prForm.value.pr_id = data.id;
  prForm.value.date_now = data.dateOfPr;
  prForm.value.remarks = data.remarks;
  prForm.value.pr_manual_number = data.prManualNumber;
  prForm.value.full_destination = data.fullDestination;
  prForm.value.pr_number = data.prNumber;
  prForm.value.requested_by_user_name = data.requestedByUserName;
  prForm.value.estimated_arrival = data.estimateTimeArrival;
  prForm.value.items = [];
  

  listItemsPerPR(prForm.value.pr_id);
};
const listItemsPerPR = async (id) => {
  try {
    search.value.pr_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/get-items-per-pr`,
      formData,
      BearToken(token)
    );
    console.log("listItemsPerPr-from-viewPRItems", );

    prForm.value.items = response.data.prItems.map((item) => ({
      pr_item_id: item.id,
      item_id: item.itemId,
      item_name: item.itemSku + " - " + item.itemName,
      mrf_quantity: item.mrfItemQuantity ?? 0,
      po_quantity: item.poItemQuantity ?? 0,
      quantity: item.quantity ?? 0,
      unit_abbre: item.unitAbbre,
      quantity_per_unit: item.quantityPerUnit,
      pr_price: item.price,
      pr_remarks: item.remarks,
    }));

    prForm.value.full_destination = response.data.pr.fullDestination;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listItemsPerPR(prForm.value.pr_id);
};
const handleTransaction = (transaction_id) => {
  listItemsPerPR(prForm.value.pr_id);
};
const resetForm = () => {
  prForm.value.mrf_id = 0;
  prForm.value.date_now = DATE_NOW();
  prForm.value.remarks = "";
   prForm.value.full_destination = "";
  prForm.value.pr_manual_number = "";
  prForm.value.requested_to_user_id = 0;
  prForm.value.items = [];
};
const editPR = async () => {
  try {
    const formData = FormDx(prForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/add`,
      formData,
      BearToken(token)
    );

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
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
