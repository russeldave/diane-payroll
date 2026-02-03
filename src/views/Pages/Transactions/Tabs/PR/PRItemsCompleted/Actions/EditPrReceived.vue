<template>
  <div>
  <button
    title="Click to update PR'ed Item"
    class=" px-2 py-2 text-center text-md font-bold hover:bg-yellow-800 text-white bg-yellow-500"
    @click="editReceivedBehavior()"
  >
    <!-- {{ props.data.quantity ?? 0 }}
    <sub>{{ props.data.unitAbbre ?? "-" }}</sub> -->
    Edit Received
  </button>

  </div>
  <!-- Add Product Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Edit PR Received"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editRecievedQuantity()" autocomplete="off">
        <div class="mb-4">
          <label for="BuffetName" class="block text-sm font-medium text-gray-700"
            >Pr No.:</label
          >
          <input
            type="text"
            id="BuffetName"
            v-model="form.formatedprId"
            placeholder="Pr'ed item name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="BuffetName" class="block text-sm font-medium text-gray-700"
            >Item: </label
          >
          <div class="p-2 bg-gray-100 border border-2 border-gray-300 rounded-lg">
            <span class="italic text-sm">
              {{ form.item_id_number }} -&nbsp;
            </span>
            <span class="font-bold">
              {{ form.item_name }}
            </span>
            <span class="text-red-500 italic">
              [{{ form.unit_abbre }}]
            </span>
          </div>
        </div>

        <div class="mb-4">
          <label for="leftOver" class="block text-sm font-medium text-gray-700"
            >Received Quantity: <p class="text-red-500">{{ props.data.receivedQuantity }} <sub>{{ props.data.unitAbbre ?? "-" }}</sub></p></label
          >
          <input
            type="number"
            id="leftOver"
            v-model="form.received_quantity"
            step="any"
            required
            placeholder="Add or Minus Quantity"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            :class="loading ? 'bg-gray-400' : 'bg-blue-500'"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            {{ loading ? "Loading..." : "Update" }}
          </button>
        </div>
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
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION, ROLE } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  data: Object,
  dateData: Object,
});
const isAddModalOpen = ref(false);
const loading = ref(false);
const role = ref([]);
const form = ref({
  pr_item_id: 0,
  received_quantity: 0,
  formatedprId: '',
  item_name: '',
  item_id_number: '',
  unit_abbre:''
});
const editReceivedBehavior = () => {
  // console.log('editReceivedBehavior');
  // console.log(props.data)
  resetForm();
  fillForm();

  isAddModalOpen.value = true;
};
const resetForm = () => {
  form.value.pr_item_id = 0;
  form.value.received_quantity = 0;
  form.value.formatedprId = '';
  form.value.itemName = '';
  form.value.item_name = '',
  form.value.item_id_number = '',
  form.value.unit_abbre =''

};
const fillForm = () => {
  const data = props.data;
  const dateData = props.dateData;
  const itemName = `${data.ingredientName} [${data.unitAbbre}]`
  console.log(data);
  form.value.pr_item_id = data.id;
  form.value.received_quantity = '';
  form.value.formatedprId = data.prNumber ?? "";
  form.value.item_name = data.ingredientName ?? "";
  form.value.item_id_number = data.ingredientIdNumber ?? "";
  form.value.unit_abbre = data.unitAbbre ?? "";

};
const editRecievedQuantity = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the quantity.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(form.value);
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-item-in/edit-pr-received`,
      formData,
      BearToken(token)
    );

    if (!response.data.error) {
      const { token, userInfo } = response.data;

      // Close processing alert and show success
      Swal.close();
      isAddModalOpen.value = false;
      Alert("success", "Success", response.data.message);
      resetForm();
      emits("transaction_id", Math.random());
    } else {
      // Close processing alert and show warning
      Swal.close();
      Alert("warning", "Warning", response.data.message);
    }
    loading.value = false;
  } catch (error) {
    // Close processing alert and show error
    Swal.close();
    loading.value = false;
    handleApiError(error);
  }
};
</script>
