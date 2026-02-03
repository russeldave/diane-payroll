<template>
  <button
    @click="(isViewModalOpen = true), editMRFBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
  <Modal :show="isViewModalOpen" :maxWidth="'fullscreen'" title="View MRF" @close="isViewModalOpen = false">
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
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >MRF Type</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
             <p class="mt-1 p-2 border rounded-md w-full bg-gray-200">{{  mrfForm.mrf_type == 1 ? 'Request Item' : 'Transfer Item' }}</p>
          </div>
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
              >MRF Manual No.</label
            >
            <!-- building_id,contact_info,address,geo_map,remarks. -->
            <input
              type="text"
              id="ProductName"
              v-model="mrfForm.mrf_manual_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4 col-span-2">
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
          </div>
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
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          ></textarea>
        </div>
        <h5 class="text-lg font-bold mb-4 mt-4">Items:</h5>
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
            </div>

            <p
             v-if="items.mrfItems?.length == 0"
              class="text-red-500 font-bold text-center"
            >
              **No items found**
            </p>
          </div>
        </div>
        <div class="flex w-full overflow-auto" v-else>
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class=" text-white shadow text-nowrap" :class="DEFAULT_BG">
              <tr class="border-b-2 border-solid">
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-center text-sm font-medium  uppercase tracking-wider"
                >
                  <i class="fa fa-xl fa-check-square text-green-500"></i>
                </th>
                <th
                  scope="col"
                  
                  width="20%"
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                  MRF No.
                </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                  MRF Manual No.
                </th>
                <th
                scope="col"
                title="Quantity per Unit"
                class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Requester
              </th>
              <th
                scope="col"
                title="Quantity per Unit"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Location
              </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-center text-sm font-medium  uppercase tracking-wider"
                >
                  Requested
                </th>
                <th
                scope="col"
                 v-if="hasPermission('MRF_Available_Column')"
                title="Remaining Quantity"
                class="px-2 py-3 border text-right text-sm font-medium  uppercase tracking-wider"
              >
              Available
              </th>
                <th
                  scope="col"
                  
                  title="Released Quantity"
                  class="px-2 py-3 border text-right text-sm font-medium  uppercase tracking-wider"
                >
                Released
                </th>
                <th
                  scope="col"
                   v-if="hasPermission('MRF_PR_Column')"
                  title="Remaining Quantity"
                  class="px-2 py-3 border text-right text-sm font-medium tracking-wider"
                >
                  PR'ed
                </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                Sample /Damage Item /Comparison
                </th>
                <th
                  scope="col"
                  
                  class="px-2 py-3 border text-left text-sm font-medium  uppercase tracking-wider"
                >
                  Remark
                </th>
    
                <!-- <th
                  scope="col"
                  
                  class="px-2 py-3 text-left text-sm border font-medium  uppercase tracking-wider"
                >
                  Action
                </th> -->
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
                  <ItemTitle :item_id="mrf.itemId" :item_name="mrf.itemSku+' - '+mrf.itemName" :is_fixed="mrf.isFixed"  />
                </td>
                <td class="px-2 py-3 border">
                  {{ typeFormatter(mrf.isFixed) }}
                </td>
                <td class="px-2 py-3 border">{{ mrf.mrfNumber }}</td>
                <td class="px-2 py-3 border">{{ mrf.mrfManualNumber }}</td>
                <td class="px-2 py-3 border text-left hover:bg-green-200">
                  {{ mrf.userName }}
                </td>
                <td class="px-2 py-3 border text-left hover:bg-green-200">
                  {{ mrf.releaseFromWarehouseName }}
                </td>
                <td class="px-2 py-3 border text-right text-white text-xl hover:bg-red-200 bg-red-500 font-bold">
                  {{ mrf.quantity ?? 0 }}
                  {{ mrf.subUnitId }}
                </td>
                <td 
                 v-if="hasPermission('MRF_Available_Column')"
                class="px-2 py-3 border text-right text-white text-xl hover:bg-green-200 bg-green-500 font-bold">
                  {{ mrf.allStocks }}
                  {{ mrf.unitAbbre }}
                </td>
                <td class="px-2 py-3 border text-right text-white text-xl hover:bg-blue-200 border-white bg-blue-500 font-bold">
                  {{ mrf.releasedQuantity ?? 0 }}
                  {{ mrf.unitAbbre }}
                </td>
                <td 
                 v-if="hasPermission('MRF_PR_Column')"
                class="px-2 py-3 border text-right text-white text-xl hover:bg-orange-200 border-white bg-orange-500 font-bold">
                  {{ mrf.unpaidQuantity ?? 0 }}
                  {{ mrf.unitAbbre }}
                </td>
                <td class="p-2 border text-right hover:bg-green-200 text-white">
                  <ProofImageViewer v-if="mrf.id" :mrf_id="mrf.id" :thumbnail="mrf.thumbnail" :canDeleteImage="false"/>
                </td>
                <td class="px-2 py-3 border">{{ mrf.remarks }}</td>
                <!-- <td class="px-2 py-3 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
                <!-- <td class="px-2 py-3 border">
                  <div class="flex justify-center">
                    <DirectRelease v-if="hasPermission('Direct_Release_Button')" :warehouse_id="props.warehouse_id" :data="mrf" @transaction_id="handleTransaction()"/>
                    <ReleaseItemToBin v-if="hasPermission('Release_Item_To_Bin_Button')" :warehouse_id="props.warehouse_id" :data="mrf" @transaction_id="handleTransaction()"/>
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
                </td> -->
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
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  typeFormatter,
  handleApiError
} from "@/views/Utility/Helper";

import ReleaseItemToBin from "./ReleaseItemToBin.vue";
import DirectRelease from "./DirectRelease.vue";
import Completed from "./Completed.vue";
import Cancelled from "./CancelMRFItem.vue";
import ProofImageViewer from "@/views/Pages/Items/Actions/ProofImageViewer.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  warehouse_id: Number,
});
const isMobile = ref(window.innerWidth < 768); // Assumes mobile if width < 768px
const isViewModalOpen = ref(false);
const companies = ref([]);
const items = ref([]);
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

  listItemsPerMRF(mrfForm.value.mrf_id);
};
const editMRF = async () => {
  try {
    const formData = FormDx(mrfForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/edit`,
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
}
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
