<template>
  <button
    @click="(isViewModalOpen = true), editMRFBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
  <Modal :show="isViewModalOpen" :maxWidth="'fullscreen'" title="View Purchase Request" @close="isViewModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editMRF()">
        <div class="grid grid-cols-2 gap-6">
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
              v-model="prForm.pr_manual_number"
              disabled
              placeholder="Input MRF Number"
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
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
        <h5 class="text-lg font-bold mb-4 mt-4">Items:</h5>
        <div class="flex w-full overflow-auto">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-yellow-900 text-white shadow">
              <tr class="border-b-2 border-solid">
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Item
                </th>
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  PR No.
                </th> -->
                <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider"
                >
                  Units
                </th> -->
                <th
                  scope="col"
                  class="px-2 py-3 border text-right text-sm font-medium uppercase tracking-wider bg-red-500"
                >
                  PR'ed Quantity
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <!-- Loop through products and display them -->
              <tr
                v-for="(pr, index) in data.prItems"
                v-if="data.prItems?.length > 0"
                :key="pr.id"
                :title="'Requested By: ' + pr.requestedByUserName"
                class="text-nowrap hover:bg-gray-200"
              >
                <td class="px-2 py-3 border">
                  <span>
                    {{ pr.ingredientIdNumber }} &nbsp;
                  </span>
                  <span class="font-bold">
                    {{ pr.itemName }}
                  </span>
                  <span class="italic text-red-500">
                    [{{ pr.unitAbbre }}]
                  </span>
                </td>
                <!-- <td class="px-2 py-3 border">{{ pr.prNumber }}</td> -->
                <!-- <td class="px-2 py-3 border text-right">
                  {{ pr.quantityPerUnit ?? 0 }} /{{
                    pr.unitAbbre
                  }}
                </td> -->
                <td class="px-2 py-3 border text-right">
                  {{ pr.quantity ?? 0 }} 
                  <span class="italic text-red-500">
                    {{ pr.unitAbbre }}
                  </span>
                </td>
                <td class="px-2 py-3 border">
                  {{ pr.prRemarks === "null" ? "-" : pr.prRemarks }}
                </td>
                <!-- <td class="px-2 py-3 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
              </tr>
              <tr v-else>
                <td
                  class="px-2 py-3 border text-center text-red-500 font-bold"
                  colspan="9"
                >
                  ***No PR Items Found***
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex w-full overflow-auto">
          <Paginator
            v-if="data.totalrows"
            :page_number="search.page_num"
            :total_rows="data.totalrows ?? 0"
            :itemsperpage="search.itemsperpage"
            @page_num="handlePagination"
          />
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
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const isViewModalOpen = ref(false);
const companies = ref([]);
const data = ref([]);
const prForm = ref({
  pr_id: 0,
  date_now: DATE_NOW(),
  requested_to_user_id: 0,
  requested_to_user_name: "",
  requested_by_user_id: 0,
  requested_by_user_name: "",
  remarks: "",
  pr_manual_number: "",
  pr_number: "",
  items: [],
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
  prForm.value.pr_id = 0;
  prForm.value.date_now = DATE_NOW();
  prForm.value.requested_to_user_id = 0;
  prForm.value.requested_to_user_name = "";
  prForm.value.remarks = "";
  prForm.value.pr_manual_number = "";
  prForm.value.pr_number = "";
  prForm.value.items = [];
};
const fillForm = () => {
  const data = props.data;

  prForm.value.pr_id = data.id;
  prForm.value.date_now = data.dateOfPr;
  prForm.value.requested_to_user_id = data.requestedToUserId;
  prForm.value.requested_to_user_name = data.requestedToUserName;
  prForm.value.requested_by_user_id = data.requestedByUserId;
  prForm.value.requested_by_user_name = data.requestedByUserName;
  prForm.value.remarks = data.remarks;
  prForm.value.pr_manual_number = data.prManualNumber;
  prForm.value.pr_number = data.prNumber;
  prForm.value.items = [];

  listItemsPerPR(prForm.value.pr_id);
};
const editMRF = async () => {
  try {
    const formData = FormDx(prForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/edit`,
      formData,
      BearToken(token)
    );

    isViewModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
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
    data.value = response.data;
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
  isViewModalOpen.value = false;
  emits("transaction_id", Math.random());
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
// const removeItemField = (index) => {
//   // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
//   prForm.value.items.splice(index, 1);
// };
const companiesDropdown = async () => {
  companies.value = await COMPANIES();
};
</script>
