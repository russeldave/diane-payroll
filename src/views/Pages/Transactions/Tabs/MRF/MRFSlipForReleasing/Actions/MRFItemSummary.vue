<template>
    <div>
      <!-- Popper component with a check for the loading state -->
      <Popper :arrow="true" placement="auto">
        <!-- Step title and icons based on the step -->
        <b @click.prevent="handleHover()" class="hover:text-red-500 animate-pulse">{{ props.mrf_text }} <i class="fa fa-external-link-alt text-red-500"></i></b>
        <!-- Step content inside Popper -->
        <template #content>
            <div class="block overflow-x-auto p-4 rounded-lg shadow-md bg-white">
                <h5 class="text-black">Requested Items:</h5>
                <table class="min-w-full table-auto">
                <thead :class="DEFAULT_BG">
                    <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium border">Item Name</th>
                    <th class="px-4 py-2 text-right text-sm font-medium border">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(mrf, index) in items" v-if="items.length > 0 && !loading" :key="mrf.id" class="border-b">
                        <td class="px-4 py-2 border text-black">
                            <ItemTitle
                            :item_id="mrf.itemId"
                            :item_name="mrf.itemSku + ' - ' + mrf.itemName"
                            :is_fixed="mrf.isFixed"
                            />
                        </td>
                        <td class="px-4 py-2 border text-black text-right">
                            {{ mrf.quantity ?? 0 }} {{ mrf.unitAbbre }}
                        </td>
                    </tr>
                    <tr v-if="loading" class="border-b">
                        <td class="px-4 py-2 border text-blue-500 text-center" colspan="2">
                           <i class="fa fa-spinner fa-spin"></i> Fetching Items..
                        </td>
                    </tr>
                    <tr v-if="items.length == 0 && !loading" class="border-b">
                        <td class="px-4 py-2 border text-red-500 text-center" colspan="2">
                            No Items Found
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </template>
      </Popper>
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted } from "vue";
    import axios from "axios";
    import {
        VUE_APP_API_URL,
        DATE_NOW,
        COMPANIES,
        DEFAULT_BG,
    } from "@/views/Utility/Global";
    import {
        FormDx,
        BearToken,
    } from "@/views/Utility/Helper";
    import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";

    const token = localStorage.getItem("token");
  
    const props = defineProps({
      mrf_text: String,
      mrf_id: {
        type: Number,
        required: true,
      },
    });
  
    const search = ref({
      search: "",
      page_num: 1,
      itemsperpage: 10,
      mrf_id: 0,
    });
  
    const items = ref([]);
    const loading = ref(false);  // Loading flag to control whether the popper is shown
  
    // onMounted(() => {
    //     handleHover();
    // })
    // Handle the hover event and call listItemsPerMRF
    const handleHover = async () => {
      loading.value = true; // Set loading to true before calling the listItemsPerMRF function
      search.value.mrf_id = props.mrf_id;
      await listItemsPerMRF();
    };
  
    // Fetch items for the given mrf_id
    const listItemsPerMRF = async () => {
      try {
        const formData = FormDx(search.value);
        const response = await axios.post(
          `${VUE_APP_API_URL}mrfs/get-items-per-mrf-name-only`,
          formData,
          BearToken(token)
        );
        items.value = response.data.mrfItems ?? []; // Update items once data is fetched
      } catch (error) {
        console.log(error);
        items.value = [];  // Clear the items if an error occurs
      } finally {
        loading.value = false;  // Set loading to false once the request is finished
      }
    };
  </script>
  