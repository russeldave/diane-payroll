<template>
  <button
    @click="isViewModalOpen = true"
    class="border-2 border-white bg-green-500 rounded text-white p-1"
  >
    <i class="fa fa-money-bills"></i> Collect
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'2xl'"
    title="Collect Order Payment"
    @close="closeCollectionModal"
  >
      <CollectPaymentForm
        :menu_park_id="props.menu_park_id"
        :key="isViewModalOpen"
        :customer="props.customer"
      />
      <!-- @transaction_id="handleTransaction" -->
  </Modal>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
  Alert,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";

import CollectPaymentForm from "./CollectPaymentForm.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  menu_park_id: Number,
  customer: Object,
});
const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);

const closeCollectionModal = () => {
  isViewModalOpen.value = false;
  emits('transaction_id',Math.random());
}

const handleTransaction = (data) => {
  emits('transaction_id',data);
}
</script>
