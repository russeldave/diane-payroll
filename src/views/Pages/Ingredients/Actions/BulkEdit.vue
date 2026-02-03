<template>
  <button
    @click.prevent="openModal"
    type="button"
    :disabled="!hasSelection"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap',
      className,
      !hasSelection ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    title="Bulk edit selected ingredients"
  >
    <i class="fas fa-edit"></i>
    <span class="ml-2">Bulk Edit</span>
    <span v-if="hasSelection" class="ml-1 text-xs bg-white/40 px-2 py-0.5 rounded-full">
      {{ ingredient_ids.length }}
    </span>
  </button>

  <Modal :show="isOpen" maxWidth="lg" title="Bulk Edit Ingredients" @close="closeModal">
    <form class="p-4" autocomplete="off">
      <div class="grid grid-cols-1 gap-4">
        <!-- Warehouse Assignment -->
        <div class="px-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Select Warehouse</label
          >
          <div class="flex items-center space-x-2">
            <SearchDropdown
              apiEndpoint="warehouses/dropdown"
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
              type="button"
              @click="bulkEditWarehouse"
              :disabled="!hasSelection || !form.selectedWarehouseId"
              class="bg-lime-500 text-white font-bold px-2 py-2 text-nowrap text-md rounded hover:opacity-70"
              title="Apply warehouse changes only"
            >
              <i class="fas fa-check"></i>
              <span class="ml-1">Apply</span>
            </button>
          </div>
        </div>

        <!-- Allow To Receiving Checkbox -->
        <div
          class="flex justify-between bg-gray-50 items-center space-x-2 border-t py-4 px-2"
        >
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowToReceiving"
              v-model="form.selectedIsAllowToReceiving"
              true-value="1"
              false-value="0"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <label for="allowToReceiving" class="block text-sm font-medium text-gray-700">
              Allow Receiving
            </label>
          </div>
          <button
            type="button"
            @click="bulkEditAllowToReceiving"
            :disabled="!hasSelection"
            class="bg-lime-500 text-white font-bold px-2 py-2 text-nowrap text-md rounded hover:opacity-70"
            title="Apply allow to receiving changes only"
          >
            <i class="fas fa-check"></i>
            <span class="ml-1">Apply</span>
          </button>
        </div>

        <!-- Update Type Options -->
        <div class="border-t px-2">
          <label for="updateType" class="block text-sm font-medium text-gray-700 mb-2">
            Update Type
          </label>
          <div class="flex w-full items-center space-x-2">
            <select
              v-model="form.selectedUpdateType"
              id="updateType"
              class="flex w-full mt-1 p-2 border rounded-md"
            >
              <option value="0">--Select Type--</option>
              <option value="1">Ingredient</option>
              <option value="2">Production</option>
              <option value="3">Butcher</option>
            </select>
            <button
              type="button"
              @click="bulkEditUpdateType"
              :disabled="!hasSelection"
              class="bg-lime-500 text-white font-bold px-2 py-2 text-nowrap text-md rounded hover:opacity-70"
              title="Apply update type changes only"
            >
              <i class="fas fa-check"></i>
              <span class="ml-1">Apply</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </Modal>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id", "clear-ingredient-ids"]);
const props = defineProps({
  ingredient_ids: { type: Array, default: () => [] },
  className: { type: String, default: "" },
});

const token = localStorage.getItem("token");
const isOpen = ref(false);

const form = reactive({
  selectedWarehouseId: 0,
  selectedWarehouseName: "",
  selectedIsAllowToReceiving: "0", // default unchecked
  selectedUpdateType: "0", // default
});

const searchWarehouse = ref({ search: "", page_num: 1, itemsperpage: 10 });

const hasSelection = computed(
  () => Array.isArray(props.ingredient_ids) && props.ingredient_ids.length > 0
);

const openModal = () => {
  if (!hasSelection.value) return;
  isOpen.value = true;
  resetForm();
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.selectedWarehouseId = 0;
  form.selectedWarehouseName = "";
  form.selectedIsAllowToReceiving = "0";
  form.selectedUpdateType = "0";
};

const onWarehouseSelected = (item) => {
  form.selectedWarehouseId = item?.value ?? 0;
  form.selectedWarehouseName = item?.label ?? "";
};

const bulkEditUpdateType = async () => {
  try {
    if (!hasSelection.value) {
      Alert("warning", "No Ingredients", "Please select at least one ingredient.");
      return;
    }

    Swal.fire({
      title: "Processing...",
      text: "Applying update type changes...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    if (!form.selectedUpdateType) {
      Alert("warning", "No Update Type", "Please select an update type.");
      return;
    }
    const updateData = {
      ingredient_ids: props.ingredient_ids,
      type: Number(form.selectedUpdateType),
    };

    const formData = FormDx(updateData);

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/bulk-edit-update-type`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert(
      "success",
      "Updated",
      response?.data?.message || "Update type updated successfully."
    );
    emits("transaction_id", Math.random());
    emits("clear-ingredient-ids");
    closeModal();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
const bulkEditWarehouse = async () => {
  try {
    if (!hasSelection.value) {
      Alert("warning", "No Ingredients", "Please select at least one ingredient.");
      return;
    }
    if (!form.selectedWarehouseId) {
      Alert("warning", "No Warehouse", "Please select a warehouse.");
      return;
    }

    Swal.fire({
      title: "Processing...",
      text: "Applying warehouse changes...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const updateData = {
      ingredient_ids: props.ingredient_ids,
      warehouse_id: form.selectedWarehouseId,
    };

    const formData = FormDx(updateData);

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/bulk-edit-warehouse`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert(
      "success",
      "Updated",
      response?.data?.message || "Warehouse updated successfully."
    );
    emits("transaction_id", Math.random());
    emits("clear-ingredient-ids");
    closeModal();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const bulkEditAllowToReceiving = async () => {
  try {
    if (!hasSelection.value) {
      Alert("warning", "No Ingredients", "Please select at least one ingredient.");
      return;
    }

    Swal.fire({
      title: "Processing...",
      text: "Applying allow to receiving changes...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const updateData = {
      ingredient_ids: props.ingredient_ids,
      is_allow_to_receiving: Number(form.selectedIsAllowToReceiving),
    };

    const formData = FormDx(updateData);

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/bulk-edit-of-allow-in-receiving`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert(
      "success",
      "Updated",
      response?.data?.message || "Allow to receiving status updated successfully."
    );
    emits("transaction_id", Math.random());
    emits("clear-ingredient-ids");
    closeModal();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>
