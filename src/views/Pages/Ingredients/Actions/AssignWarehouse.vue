<template>
  <button
    @click.prevent="assignButtonBehavior()"
    type="button"
    :class="[
      'bg-[#0abde3] text-white hover:opacity-70 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110',
      className,
    ]"
  >
    <i class="fas fa-warehouse"></i>
    Warehouse
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'4xl'"
    title="Assign Warehouse"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="assignWarehouse()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Ingredient Name</label
            >
            <div class="flex p-2 bg-gray-200 rounded-lg border border-2 border-gray-500">
              <span class="font-bold">
                {{ ingredientForm.ingredient_name }}
              </span>
              <span class="text-red-500 italic">
                [{{ ingredientForm.unit_abbre }}]
              </span>
            </div>
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Assign warehouse</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="warehouses/dropdown-search"
                :searchModel="searchWarehouse"
                placeholder="Search Warehouse"
                itemLabel="name"
                itemId="id"
                inputId="warehouseName"
                formatLabel="none"
                @item-selected="(data) => fillWarehouseForm(data)"
                dataKey="warehouses"
                returnName="['label']"
              />
              <button
                type="submit"
                class="bg-orange-500 text-white font-bold p-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </form>
      <div class="block mt-4 border-t-2 border-dashed">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
              >
                Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
              >
                Limit Alarm Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-md font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="(i, ii) in warehouse_assigned?.warehouses"
              v-if="warehouse_assigned?.warehouses?.length > 0"
              :key="ii"
              :class="i.warehouseItemStatus === 7 ? 'bg-slate-400' : ''"
            >
              <td class="px-2 py-2 border">
                {{ i.warehouseName }}
              </td>
              <td class="px-2 py-2 border text-right">
                {{ i.stocks }}
              </td>
              <td class="px-2 py-2 border text-right">
                <div
                  class="flex"
                  >
                  <input 
                    class="p-2 rounded-l-md border border-[.2rem] m-0"
                    type="number"
                    v-model="i.limitAlarmStocks" 
                    >
                    <!-- v-if="hasPermission('Set_Limit_Stocks')" -->
                    <button
                      @click.prevent="setLimitStocks(i)"
                      type="button"
                      class="bg-red-500 hover:bg-red-600 text-white rounded-r-md font-bold text-lg md:text-md py-2 px-4 float-end text-nowrap"
                      >
                      set
                    </button>
                </div>
              </td>
              <td class="px-2 py-2 border ">
                <div class="flex justify-center">
                  <OverrideStocks
                    v-if="hasPermission('Override_Stocks_Button')"
                    :data="i"
                    @transaction_id="handleTransaction"
                  />
                  <button
                    v-if="hasPermission('Unassign_Warehouse_Item_Button')"
                    @click.prevent="deleteWarehouse(i)"
                    type="button"
                    class="ms-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                  >
                    Unassign
                  </button>
                  <div
                    v-if="hasPermission('hide_unhide_warehouse_item_button')"
                    >
                    <button
                      @click.prevent="unhideWarehouseIngredient(i)"
                      type="button"
                      class="ms-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                      v-if="i.warehouseItemStatus === 7"
                      >
                      Restore
                    </button>
                    <button
                      @click.prevent="hideWarehouseIngredient(i)"
                      type="button"
                      class="ms-2 bg-slate-600 hover:bg-slate-700 text-white rounded font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                      v-else
                      >
                      Hide
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td class="px-2 py-2 border" colspan="6">
                <p class="text-red-500 font-bold text-center">
                  **No Warehouse Assigned**
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
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  WAREHOUSE,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { hasPermission } from "@/views/Utility/Permissions";
//modules
import OverrideStocks from "@/views/Pages/Ingredients/Actions/OverrideStocks.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const store = ref([]);
const warehouse_assigned = ref([]);
const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  warehouse_id: 0,
});
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  ingredient_id_number: 0,
});
const assignButtonBehavior = () => {
  // console.log("assignButtonBehavior");
  // console.log(props.data);
  isAddModalOpen.value = true;

  resetForm();
  fillForm();
  listAssignedWarehouse();
};
const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.warehouse_id = "";

  // emits("transaction_id", Math.random());
};
const fillForm = () => {
  const data = props.data;

  ingredientForm.value.ingredient_id = data.id;
  ingredientForm.value.ingredient_name = data.name;
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.unit_abbre = data.unitAbbre ?? "";
  ingredientForm.value.warehouse_id = 0;

  searchWarehouse.value.ingredient_id_number = data.ingredientIdNumber ?? 0;
};
const listAssignedWarehouse = async () => {
  try {
    warehouse_assigned.value = [];
    const formData = FormDx(searchWarehouse.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/get-ingredient-warehouses`,
      formData,
      BearToken(token)
    );
    warehouse_assigned.value = response.data;
  } catch (error) {
    handleApiError(error); //
  }
};

const assignWarehouse = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx({
      ingredient_id_number: ingredientForm.value.ingredient_id_number,
      warehouse_id: ingredientForm.value.warehouse_id,
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/assign-to-warehouse`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert("success", "Success", response.data.message);
    listAssignedWarehouse();
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const deleteWarehouse = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to unassign this warehouse. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unassign it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Proceed with deletion using Axios
      const formData = FormDx({
        ingredient_id_number: ingredientForm.value.ingredient_id_number,
        ingredient_warehouse_id: data.id,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/unassign-to-warehouse`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Unassigned!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    listAssignedWarehouse();
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const hideWarehouseIngredient = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to Hide Ingredient in this warehouse..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Hide it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Proceed with deletion using Axios
      const formData = FormDx({
        ingredient_id_number: ingredientForm.value.ingredient_id_number,
        ingredient_warehouse_id: data.id,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}warehouse-has-ingredients/hide`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Unassigned!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    listAssignedWarehouse();
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const setLimitStocks = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to set Limit stocks.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Set Limit!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Proceed with deletion using Axios
      const formData = FormDx({
        warehouse_item_id: data.id,
        new_limit_stocks: data.limitAlarmStocks,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/set-limit-stocks`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Unassigned!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    listAssignedWarehouse();
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const unhideWarehouseIngredient = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to Restore Ingredient in this warehouse..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Restore it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Proceed with deletion using Axios
      const formData = FormDx({
        ingredient_id_number: ingredientForm.value.ingredient_id_number,
        ingredient_warehouse_id: data.id,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}warehouse-has-ingredients/unhide`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Unassigned!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    listAssignedWarehouse();
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};

const handleTransaction = (transactionId) => {
  emits("transaction_id", transactionId);
};

const fillWarehouseForm = (item) => {
  ingredientForm.value.warehouse_id = item.value;
  ingredientForm.value.name = item.label;

  searchWarehouse.value.search = "";
};
</script>
