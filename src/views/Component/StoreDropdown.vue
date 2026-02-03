<template>
  <div class="flex justify-start items-center gap-2">
    <select
      :class="user.store_id == 0 ? 'bg-gray-200' : 'bg-amber-200'"
      class="text-gray-800 px-2 py-1 rounded text-sm font-bold shadow-lg"
      v-model="user.store_id"
    >
      <option value="0">--Select Store--</option>
      <option v-for="store in stores" :key="store.id" :value="store.id">
        {{ store.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, PERMISSION } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  replaceSpaceWithUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");

const stores = ref([]);
const user = reactive({
  store_id: 0,
});

const loadStores = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}stores/dropdown`,
      { id: 0 }, // Assuming you want to fetch all stores
      BearToken(token)
    );
    stores.value = response.data.stores || [];
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};

onMounted(() => {
  loadStores();
});
</script>
