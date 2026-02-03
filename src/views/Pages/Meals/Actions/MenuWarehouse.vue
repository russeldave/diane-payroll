<template>
  <button
    @click.prevent="openModal"
    type="button"
    :disabled="!hasSelection"
    :class="[
      'bg-yellow-500 text-white hover:opacity-70 focus:bg-yellow-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
      !hasSelection ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    title="Assign selected menus to a warehouse"
  >
    <i class="fas fa-warehouse"></i>
    <span class="ml-2">Assign Warehouse</span>
    <span v-if="hasSelection" class="ml-1 text-xs bg-white/40 px-2 py-0.5 rounded-full">{{
      menu_ids.length
    }}</span>
  </button>

  <Modal :show="isOpen" :maxWidth="'lg'" title="Assign Warehouse" @close="closeModal">
    <form class="p-4" @submit.prevent="assignWarehouse" autocomplete="off">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Select Warehouse</label
          >
          <div class="flex items-center gap-2">
            <SearchDropdown
              apiEndpoint="warehouses/dropdown-search"
              :searchModel="searchWarehouse"
              placeholder="Search Warehouse"
              itemLabel="name"
              itemId="id"
              inputId="warehouseName"
              formatLabel="none"
              dataKey="warehouses"
              returnName="['label']"
              @item-selected="onWarehouseSelected"
            />
            <button
              type="submit"
              :disabled="!selectedWarehouseId || !hasSelection"
              class="bg-orange-600 text-white font-bold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Assign to selected warehouse"
            >
              Assign
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Assigning to:
            <span class="font-semibold">{{
              selectedWarehouseName || "None selected"
            }}</span>
          </p>
        </div>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id", "clear-menu-ids"]);
const props = defineProps({
  menu_ids: { type: Array, default: () => [] },
  className: { type: String, default: "" },
});

const token = localStorage.getItem("token");
const isOpen = ref(false);
const selectedWarehouseId = ref(0);
const selectedWarehouseName = ref("");

const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const hasSelection = computed(
  () => Array.isArray(props.menu_ids) && props.menu_ids.length > 0
);

const openModal = () => {
  if (!hasSelection.value) return;
  isOpen.value = true;
  selectedWarehouseId.value = 0;
  selectedWarehouseName.value = "";
};
const closeModal = () => {
  isOpen.value = false;
};

const onWarehouseSelected = (item) => {
  selectedWarehouseId.value = item?.value ?? 0;
  selectedWarehouseName.value = item?.label ?? "";
};

const assignWarehouse = async () => {
  try {
    if (!hasSelection.value) {
      Alert("warning", "No Menus", "Please select at least one menu.");
      return;
    }
    if (!selectedWarehouseId.value) {
      Alert("warning", "No Warehouse", "Please select a warehouse first.");
      return;
    }

    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const formData = FormDx({
      menu_ids: props.menu_ids,
      warehouse_id: selectedWarehouseId.value,
    });

    // Adjust endpoint if needed in backend
    const response = await axios.post(
      `${VUE_APP_API_URL}menus/assign-warehouse-to-menus`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert(
      "success",
      "Assigned",
      response?.data?.message || "Warehouse assigned successfully."
    );
    emits("transaction_id", Math.random());
    emits("clear-menu-ids");
    closeModal();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>
