<template>
  <button
    @click="(isViewModalOpen = true), editMRFBehavior()"
     class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-box"></i>
    Items
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'fullscreen'"
    title="View MRF"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editMRF()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Type</label
            > -->
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <!-- <p class="mt-1 p-2 border rounded-md w-full bg-gray-200">
              {{ mrfForm.mrf_type == 1 ? "Request Item" : "Transfer Item" }}
            </p>
          </div> -->
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Date.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.date_now"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Requested By:</label
            >
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.requestor_employee"
              disabled
              placeholder="Input MRF Number"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200 text-red-700 font-bold text-xl italic"
            />
          </div>
          <!-- <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Manual No.</label
            > -->
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <!-- <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_manual_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div> -->
          <!-- <div class="mb-4 md:col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Our Company</label
            >
            <select
              placeholder="Select Building Name"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              disabled
              v-model="mrfForm.our_company_id"
            >
              <option value="0">--Select Company--</option>
              <option
                v-for="(b, bb) in companies"
                :key="b.value"
                :value="b.value"
              >
                {{ b.label }}
              </option>
            </select>
          </div> -->
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="mrfForm.remarks"
            placeholder="Input Building Remarks"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200  border border-4 border-lime-500 rounded-lg"
          ></textarea>
        </div>
        <h5 class="text-lg font-bold mb-4 mt-4">Items:</h5>

          <PurchaseRequest
            :data="mrf_data"
            @transaction_id="handleTransaction()"
            @click.stop
          />

        <div class="flex w-full overflow-auto p-2" v-if="isMobile">
          <div v-if="isMobile" class="block lg:hidden">
            <div
              v-for="(mrf, index) in items.mrfItems"
              v-if="items.mrfItems?.length > 0"
              :key="mrf.id"
              :title="'Requested By:' + mrf.userName"
              class="mb-4 p-4 border rounded-lg shadow"
            >
              <!-- Item Dropdown -->
              <div class="mb-2">
                <label
                  for="itemsName"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Item</label
                >
                <div class="flex">
                  <ItemTitle
                    :item_id="mrf.itemId"
                    :item_name="mrf.itemSku + ' - ' + mrf.itemName"
                  />
                </div>

              </div>
              

              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Type</label
                >
                <div class="flex">
                  {{ typeFormatter(mrf.isFixed) }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >MRF No.</label
                >
                <div class="flex">
                  {{ mrf.mrfNumber }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >MRF No.</label
                >
                <div class="flex">
                  {{ mrf.mrfManualNumber }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Quantity Per Unit</label
                >
                <div class="flex">
                  {{ mrf.quantityPerUnit ?? 0 }} {{ mrf.subUnitAbbre }}/{{
                    mrf.unitAbbre
                  }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Requested Quantity</label
                >
                <div class="flex">
                  {{ mrf.quantity ?? 0 }}
                  {{ mrf.unitAbbre }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Released Quantity</label
                >
                <div class="flex">
                  {{ mrf.releasedQuantity ?? 0 }}
                  {{ mrf.unitAbbre }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >PR'ed Quantity</label
                >
                <div class="flex">
                  {{ mrf.unpaidQuantity ?? 0 }}
                  {{ mrf.unitAbbre }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Available Quantity</label
                >
                <div class="flex">
                  {{ mrf.allStocks }}
                  {{ mrf.unitAbbre }}
                </div>
              </div>
              <!-- Brand -->
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Proof</label
                >
                <div class="flex">
                  <ProofImageViewer
                    v-if="mrf.id"
                    :mrf_id="mrf.id"
                    :thumbnail="mrf.thumbnail"
                    :canDeleteImage="false"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Remarks</label
                >
                <div class="flex">{{ mrf.remarks }}</div>
              </div>
              <!-- Remove Item Button -->
              <div class="flex justify-center">
                <DirectRelease
                  v-if="hasPermission('Direct_Release_Button')"
                  :warehouse_id="props.warehouse_id"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                />
                <ReleaseItemToBin
                  v-if="hasPermission('Release_Item_To_Bin_Button')"
                  :warehouse_id="props.warehouse_id"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                />
                <Completed
                  v-if="hasPermission('Completed_MRF_Item_Button')"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                />
                <Cancelled
                  v-if="hasPermission('MRF_Slip_Cancelled_Button')"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                />
              </div>
            </div>

            <p
              v-if="items.mrfItems?.length == 0"
              class="text-red-500 font-bold text-center"
            >
              **No items found**
            </p>
          </div>
        </div>
        <div class="flex w-full overflow-auto p-2" v-else>
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid">
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  <i class="fa fa-xl fa-check-square text-green-500"></i>
                </th>
                <th
                  scope="col"
                  width="20%"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Item Image
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  MRF No.
                </th> -->
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  MRF Manual No.
                </th> -->
                <!-- <th
                  scope="col"
                  title="Quantity per Unit"
                  class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Requester
                </th> -->
                <th
                  scope="col"
                  title="Quantity per Unit"
                  class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Warehouse Location
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Requested
                </th>
                <th
                  scope="col"
                  title="Remaining Quantity"
                  v-if="hasPermission('MRF_Available_Column')"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Available
                </th>
                <th
                  scope="col"
                  title="Released Quantity"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Released
                </th>
                <th
                  scope="col"
                  v-if="hasPermission('MRF_PR_Column')"
                  title="Remaining Quantity"
                  class="px-2 py-3 border text-center text-sm font-medium tracking-wider"
                >
                  PR'ed
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Sample /Damage Item /Comparison
                </th> -->
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                  Remark
                </th>

                <th
                  scope="col"
                  class="px-2 py-3 text-center text-sm border font-medium uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <!-- Loop through products and display them -->
              <tr
                v-for="(mrf, index) in items.mrfItems"
                v-if="items.mrfItems?.length > 0"
                :key="mrf.id"
                :title="'Requested By:' + mrf.userName"
              >
                <td class="px-2 py-3 border">
                  <div class="text-center">
                    <input
                      type="checkbox"
                      class="h-5 w-5 text-slate-600"
                      v-model="mrf.selected"
                      @change.prevent="selectedItemID(mrf, mrf.selected)"
                    />
                  </div>
                </td>
                <td class="px-2 py-3 border">
                  <ItemTitle
                    :item_id="mrf.itemId"
                    :item_name="mrf.ingredientIdNumber + ' - ' + mrf.itemName+' ['+mrf.unitAbbre+']'"
                    :is_fixed="mrf.isFixed" 
                  />
                </td>
                <td class="px-2 py-3 border">
                  <ItemImageViewer v-if="mrf.itemId" :item_id="mrf.itemId" :thumbnail="mrf.thumbnail" :canDeleteImage="false"/>
                </td>
                <!-- <td class="px-2 py-3 border">{{ mrf.mrfManualNumber }} {{ mrf.mrfNumber }}</td> -->
                <!-- <td class="px-2 py-3 border">{{ mrf.mrfManualNumber }}</td> -->
                <!-- <td class="px-2 py-3 border text-left hover:bg-green-200">
                  {{ mrf.userName }}
                </td> -->
                <td class="px-2 py-3 border text-left hover:bg-green-200">
                  {{ mrf.releaseFromWarehouseName }}
                </td>
                <td
                  class="px-2 py-3 border text-white text-xl text-nowrap hover:bg-green-200 bg-red-500 font-bold"
                >
                  {{ Number(mrf.quantity).toLocaleString() }}
                  {{ mrf.unitAbbre }}
                </td>
                <td
                  v-if="hasPermission('MRF_Available_Column')"
                  class="px-2 py-3 border text-white text-xl text-nowrap hover:bg-green-200 bg-green-500 font-bold"
                >
                  {{ Number(mrf.allStocks).toLocaleString() }}
                  {{ mrf.unitAbbre }}
                </td>
                <td
                  class="px-2 py-3 border text-white text-xl text-nowrap hover:bg-blue-200 border-white bg-blue-500 font-bold"
                >
                  {{ Number(mrf.releasedQuantity).toLocaleString() }}
                  {{ mrf.unitAbbre }}
                </td>
                <td
                  v-if="hasPermission('MRF_PR_Column')"
                  class="px-2 py-3 border text-white text-xl text-nowrap hover:bg-orange-200 border-white bg-orange-500 font-bold"
                >
                  {{ Number(mrf.unpaidQuantity).toLocaleString() }}
                  {{ mrf.unitAbbre }}
                </td>
                <!-- <td class="p-0 border text-right hover:bg-green-200 text-white">
                  <div class="flex justify-center">
                    <ProofImageViewer
                      v-if="mrf.id"
                      :mrf_id="mrf.id"
                      :thumbnail="mrf.proof"
                      :canDeleteImage="false"
                    />
                  </div>
                </td> -->
                  <!-- <td class="px-3 py-3 border bg-white/70 backdrop-blur-sm">
                    <div class="flex flex-col items-center space-y-2 text-center">
                      <div class="text-base font-semibold text-gray-900">
                        {{mrf.Status }}
                      </div>
                      <div
                        v-if="mrf.Status == 3"
                        class="flex justify-center items-center rounded-md bg-green-600 text-white font-semibold text-sm px-4 py-1.5 shadow-sm"
                      >
                        <i class=""></i> For Releasing
                      </div>

                      <div
                        v-else-if="mrf.Status == 4"
                        class="flex justify-center items-center rounded-md bg-blue-500 text-white font-semibold text-sm px-4 py-1.5 animate-pulse shadow-sm"
                      >
                        <i class=""></i> Issued
                      </div>

                      <div
                        v-else
                        class="flex justify-center items-center rounded-md bg-green-400 text-white font-bold text-lg px-4 py-1.5 animate-pulse shadow-sm"
                      >
                        <i class=""></i> Pending...
                      </div>

                    </div>
                  </td> -->
                    <td class="px-3 py-3 border bg-white/70 backdrop-blur-sm">
                      <div class="flex flex-col items-center space-y-2 text-center">
                        <div
                          v-if="mrf.Status == 3"
                          class="flex items-center justify-center gap-2 rounded-md bg-green-400 text-white font-semibold text-sm px-4 py-1.5 shadow-sm"
                        >
                          <i class=""></i>
                          For Releasing
                        </div>

                        <!-- Issued -->
                        <div
                          v-else-if="mrf.Status == 4"
                          class="flex items-center justify-center gap-2 rounded-md bg-blue-400 text-white font-semibold text-sm px-4 py-1.5 animate-pulse shadow-sm"
                        >
                          <i class=""></i>
                          Issued
                        </div>

                        <!-- Pending -->
                        <div
                          v-else
                          class="flex items-center justify-center gap-2 rounded-md bg-yellow-300 text-white font-semibold text-sm px-4 py-1.5 shadow-sm"
                        >
                          <i class=""></i>
                          Pending...
                        </div>

                      </div>
                    </td>
                <td class="px-2 py-3 border">{{ mrf.remarks }}</td>
                <!-- <td class="px-2 py-3 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
                <td class="px-2 py-3 border">
                  <div class="flex justify-center">
                    <!-- <ReleaseFromLocation
                      v-if="hasPermission('Direct_Release_Button')"
                      :warehouse_id="props.warehouse_id"
                      :data="mrf"
                      @transaction_id="handleTransaction()"
                    /> -->
                    <DirectRelease
                      v-if="hasPermission('Direct_Release_Button')"
                      :warehouse_id="props.warehouse_id"
                      :data="mrf"
                      @transaction_id="handleTransaction()"
                    />
                    <!-- <ReleaseItemToBin
                      v-if="hasPermission('Release_Item_To_Bin_Button')"
                      :warehouse_id="props.warehouse_id"
                      :data="mrf"
                      @transaction_id="handleTransaction()"
                    /> -->
                    <Completed
                      v-if="hasPermission('Completed_MRF_Item_Button')"
                      :data="mrf"
                      @transaction_id="handleTransaction()"
                    />
                    <Cancelled
                      v-if="hasPermission('MRF_Slip_Cancelled_Button')"
                      :data="mrf"
                      @transaction_id="handleTransaction()"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="items.mrfItems?.length == 0">
                <td
                  class="px-2 py-3 border text-center text-red-500 font-bold"
                  colspan="16"
                >
                  ***No MRF Items Found***
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="flex justify-end">
          <button
            type="submit"
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
import { hasPermission } from "@/views/Utility/Permissions";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  typeFormatter,
  handleApiError,
} from "@/views/Utility/Helper";

import ReleaseItemToBin from "./ReleaseItemToBin.vue";
import DirectRelease from "./DirectRelease.vue";
import Completed from "./Completed.vue";
import ProofImageViewer from "@/views/Pages/Items/Actions/ProofImageViewer.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import ReleaseFromLocation from "../../MRFItemsForReleasing/Actions/ReleaseFromLocation.vue";
import ItemImageViewer from "@/views/Pages/Items/Actions/ItemImageViewer.vue";
import PurchaseRequest from "./PurchaseRequest.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  warehouse_id: Number,
});
const isViewModalOpen = ref(false);
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const companies = ref([]);
const expandedRows = ref([]);
const items = ref([]);
const mrf_data = ref([]);
const item_array = ref([]);
const mrf_item_array = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  items: [
    {
      item_id: 0,
      item_name: "",
      quantity: 0,
      description: "",
      remarks: "",
      room_location_number: 0,
    },
  ],
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  mrf_id: 0,
});
const editMRFBehavior = () => {
  console.log("editMRFBehavior");
  console.log(props.data);
  resetForm();
  companiesDropdown();
  fillForm(props.data);
};
const resetForm = () => {
  mrfForm.value.building_id = 0;
  mrfForm.value.building_name = "";
  mrfForm.value.contact_info = "";
  mrfForm.value.address = "";
  mrfForm.value.geo_map = "";
  mrfForm.value.remarks = "";
};
const fillForm = () => {
  const data = props.data;

  mrfForm.value.mrf_id = data.id;
  mrfForm.value.date_now = data.dateOfmrf;
  mrfForm.value.our_company_id = data.ourCompanyId;
  mrfForm.value.our_company_name = data.ourCompanyName;
  mrfForm.value.remarks = data.remarks;
  mrfForm.value.mrf_manual_number = data.mrfManualNumber;
  mrfForm.value.mrf_number = data.mrfNumber;
  mrfForm.value.mrf_type = data.mrfType;
  mrfForm.value.requestor_employee = data.requestedByEmployeeName;

  listItemsPerMRF(mrfForm.value.mrf_id);
};

const activeIndex = ref(false);
const toggleDetails = (index) => {
  activeIndex.value = index;
  if (expandedRows.value.includes(index)) {
    expandedRows.value = expandedRows.value.filter((i) => i !== index);
  } else {
    expandedRows.value.push(index);
  }
};
const editMRF = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = FormDx(mrfForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/edit`,
      formData,
      BearToken(token)
    );

    // Close the processing dialog
    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const selectedItemID = (data, selected) => {
  if (!mrf_data.value) {
    mrf_data.value = []; // Initialize mrf_data.value as an array if it's not already defined
  }


  if (selected) {
    // If selected is true, push the item to mrf_data.value
    console.log(data);
    mrf_data.value.push({
      mrf_item_id: data.id,
      item_id: data.itemId,
      item_name: data.itemName,
      quantity_per_unit: data.quantityPerUnit,
      received_quantity: data.releasedQuantity - data.receivedQuantity,
      released_quantity: data.releasedQuantity,
      requested_quantity: data.quantity,
      brand_id: data.brandId,
      brand_name: data.brandName ?? "No Brand",
      brand_abbre: data.brandAbbre,
      requested_quantity: data.quantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: data.mrfItemCostPrice,
      pr_price: data.mrfItemCostPrice,
      remarks: data.remarks,
      total_quantity: 0,
    });

    // Add itemId to item_array.value if not already present
    if (!item_array.value.includes(data.itemId)) {
      item_array.value.push(data.itemId);
    }
    if (!mrf_item_array.value.includes(data.id)) {
      mrf_item_array.value.push(data.id);
    }
  } else {
    // If selected is false, remove the item from mrf_data.value
    // Find the index of the item to remove based on mrf_item_id
    const indexToRemove = mrf_data.value.findIndex(
      (item) => item.mrf_item_id === data.id
    );
    if (indexToRemove !== -1) {
      mrf_data.value.splice(indexToRemove, 1); // Remove item from mrf_data.value array
    }

    // Remove itemId from item_array.value if present
    const itemIndexToRemove = item_array.value.indexOf(data.itemId);
    if (itemIndexToRemove !== -1) {
      item_array.value.splice(itemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
    const mrfItemIndexToRemove = mrf_item_array.value.indexOf(data.id);
    if (mrfItemIndexToRemove !== -1) {
      mrf_item_array.value.splice(mrfItemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
  }
};

const listItemsPerMRF = async (id) => {
  try {
    search.value.mrf_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/get-items-per-mrf`,
      formData,
      BearToken(token)
    );
    items.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listItemsPerMRF(mrfForm.value.mrf_id);
};
const handleTransaction = (transaction_id) => {
  listItemsPerMRF(mrfForm.value.mrf_id);
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
//   mrfForm.value.items.push(item_data);
// };
// const removeItemField = (index) => {
//   // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
//   mrfForm.value.items.splice(index, 1);
// };
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
