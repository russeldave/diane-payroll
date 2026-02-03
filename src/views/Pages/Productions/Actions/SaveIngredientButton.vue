<template>
  <button
    @click.prevent="saveIngredient()"
    type="button"
    :class="[
      'text-white p-1 px-2 rounded-full text-sm md:text-md',
      saving ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
    ]"
    :disabled="saving || !isValid"
    :title="tooltip"
  >
    <i :class="saving ? 'fa fa-spinner fa-spin' : ''"></i>
    <span  class="ml-0">Add</span>
  </button>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const props = defineProps({
  productionId: {
    type: [Number, String],
    required: true
  },
  ingredientId: {
    type: [Number, String],
    required: true
  },
  quantity: {
    type: [Number, String],
    required: true
  },
  warehouseId: {
    type: [Number, String],
    required: true
  },
  subId: {
    type: [Number, String],
    required: true
  },
  itemId: {
    type: [Number, String],
    required: true
  },
  ingredientName: {
    type: String,
    default: ""
  },
  productionName: {
    type: String,
    default: ""
  },
  warehouseName: {
    type: String,
    default: ""
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ""
  }
});

const emits = defineEmits(['saved', 'error']);

const saving = ref(false);
const token = localStorage.getItem("token");

const isValid = computed(() => {
  return props.productionId && 
         props.ingredientId && 
         props.quantity > 0 && 
         props.warehouseId > 0;
});

const tooltip = computed(() => {
  if (!isValid.value) {
    return "Please fill all required fields (ingredient, quantity, warehouse)";
  }
  return `Save ${props.ingredientName || 'ingredient'} to warehouse ${props.warehouseName || props.warehouseId}`;
});

const saveIngredient = async () => {
  if (!isValid.value) {
    Alert("error", "Validation Error", "Please fill all required fields before saving.");
    return;
  }

  try {
    saving.value = true;

    const confirmed = await Swal.fire({
      title: "Save Ingredient?",
      text: `Save ${props.ingredientName || 'this ingredient'} to warehouse ${props.warehouseName || props.warehouseId}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmed.isConfirmed) {
      saving.value = false;
      return;
    }

    // Use the new API endpoint for single ingredient save/update
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/add-to-Warehouse-Item`,
      {
        production_id: props.productionId,
        ingredient_id: props.ingredientId,
        quantity: props.quantity,
        warehouse_id: props.warehouseId,
        sub_id: props.subId,
        item_id: props.itemId,
      },
      BearToken(token)
    );

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    Alert("success", "Success", response.data.message);
    emits('saved', response.data.data);

  } catch (error) {
    console.error("Error saving ingredient:", error);
    handleApiError(error);
    emits('error', error);
  } finally {
    saving.value = false;
  }
};

// Expose save method for parent component
defineExpose({
  saveIngredient
});
</script>