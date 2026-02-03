<template>
 <button
  @click.prevent="userBarcodeBehavior"
  type="button"
  class=" flex items-center justify-center"
>
  <i class="fa-solid fa-barcode text-3xl"></i>
</button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'6xl'"
    title="User QR code ID"
    @close="isAddModalOpen = false"
  >
    <div class=" flex justify-center items-center grid grid-cols-1">
      <div class="w-full h-60 md:h-80 mt-4 border-t-2 border-dashed flex justify-center">
        <Barcode :barcodeValue="user_qr_code" />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Barcode from "@/views/Component/Barcode.vue";

import {
  VUE_APP_API_URL,
} from "@/views/Utility/Global";
import {
  BearToken,
  handleApiError,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);

const user_qr_code = ref('NoValue');

const getUserQr = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-user-qr-code`,
      {},
      BearToken(token)
    );
    console.log("getUserQr in line: 53");
    console.log(response.data.userQrCode)
    user_qr_code.value = response.data.userQrCode;
  } catch (error) {
    handleApiError(error); //
  }
};

const userBarcodeBehavior = () => {
  getUserQr();
  isAddModalOpen.value = true;
};

    
</script>
