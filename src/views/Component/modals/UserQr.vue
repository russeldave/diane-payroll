<template>
  <button
    @click.prevent="userQrBehavior()"
    type="button"
    >
    <i class="fa-solid fa-qrcode text-3xl"></i>
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'6xl'"
    title="User QR code ID"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="block mt-4 border-t-2 border-dashed">
        <Qr :qrcodeValue="user_qr_code" :addNewClassName="'w-60 h-60 md:w-80 md:h-80'" />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Qr from "@/views/Component/QRCode.vue";

import {
  VUE_APP_API_URL,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const store = ref([]);
const parentIngredients = ref([]);
const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
  warehouse_id: 0,
  ingredient_name: '',
  ingredient_id_number: '',
  unit_abbre: '',
});

const user_qr_code = ref('');

const getUserQr = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-user-qr-code`,
      {},
      BearToken(token)
    );
    user_qr_code.value = response.data.userQrCode;
  } catch (error) {
    handleApiError(error); //
  }
};

const userQrBehavior = () => {
  isAddModalOpen.value = true;
  getUserQr();
};
</script>
