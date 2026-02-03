<template>
  <button
    @click="itemBehavior()"
    class="bg-purple-500 text-white font-bold rounded-l relative text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-list-check"></i>
    Menu
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isMenuModalOpen"
    :maxWidth="'fullscreen'"
    :title="`${props.data.name}`"
    @close="isMenuModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-2 px-6">
      <div class="flex justify-between items-center px-0 py-2" v-if="props.data">
        <div class="flex justify-start items-center gap-2">
          <SnapShotCostPrice
            :buffet_id="props.data?.id"
            :key="props.data?.id"
            @transaction_id="handleTransaction"
          />

          <p class="text-xs ml-2 text-red-600" v-if="data.isSnapShot">
            {{ data.snapShotMessage ?? "Last Snapshot: May 99, 2199" }}
          </p>
        </div>
        <div>
          <a
            target="_blank"
            :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/buffet-dishes-list/${props.data.id}`"
            class="bg-lime-500 text-xs md:text-sm hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
          >
            <i class="fa fa-file-excel"></i>
            <span>Generate as Excel</span>
          </a>
        </div>
      </div>
      <div
        class="overflow-auto block rounded-lg shadow-lg"
        v-if="data.menus?.length > 0 && !loading"
      >
        <table class="min-w-full divide-y divide-gray-200 border-collapse">
          <!-- Header Section -->
          <thead class="bg-black text-white">
            <tr class="text-nowrap">
              <!-- Main Headers -->
              <th
                scope="col"
                rowspan="2"
                width="20%"
                class="sticky top-0 left-0 z-30 px-6 px-3 border text-left bg-gradient-to-tr from-black via-black to-slate-700 font-semibold tracking-wider"
              >
                Menu Name
              </th>

              <th
                scope="col"
                rowspan="2"
                class="sticky top-0 z-20 px-6 px-3 border text-center font-semibold"
              >
                <div class="flex flex-col items-center">
                  <span>Current Stocks</span>
                  <span class="text-sm text-yellow-500 mt-1">-</span>
                </div>
              </th>

              <th
                scope="col"
                rowspan="2"
                class="sticky top-0 z-20 px-6 px-3 border text-center font-semibold"
              >
                <div class="flex flex-col items-center">
                  <span>Cost Price Per Item</span>
                  <span class="text-sm text-yellow-500 mt-1"> - </span>
                </div>
              </th>

              <th
                scope="col"
                rowspan="2"
                class="sticky top-0 z-20 px-6 px-3 border text-center font-semibold"
              >
                <div class="flex flex-col items-center">
                  <span>Total Served Price</span>
                  <span class="text-sm text-yellow-500 mt-1">{{
                    moneyFormatter(data.grandTotalServedPrice ?? 0)
                  }}</span>
                </div>
              </th>
              <th
                scope="col"
                rowspan="2"
                class="sticky top-0 z-20 px-6 px-3 border text-center font-semibold"
              >
                <div class="flex flex-col items-center text-rose-300">
                  <span>Scrap Loss</span>
                  <span class="text-sm text-yellow-500 mt-1"
                    >({{ moneyFormatter(data.grandTotalScrapLoss ?? 0) }})</span
                  >
                </div>
              </th>
              <!-- Dynamic Date Headers -->
              <th
                v-for="(b, bb) in data.dates"
                :key="'date-' + bb"
                colspan="4"
                :style="{ backgroundColor: b.hexColor }"
                class="sticky top-0 z-20 px-6 px-3 border text-center font-semibold"
              >
                {{
                  new Date(b.buffetDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }}
              </th>
            </tr>

            <!-- Subheaders -->
            <tr class="text-sm">
              <template v-for="(b, bb) in data.dates" :key="'date-data-' + bb">
                <th class="px-4 py-1 text-center font-medium border">
                  <div class="flex flex-col items-center">
                    <span>Price</span>
                    <span class="text-xs text-yellow-500 mt-1"
                      >({{ moneyFormatter(b.totalServedPricePerDay ?? 0) }})</span
                    >
                  </div>
                </th>
                <th class="px-4 py-1 text-center font-medium border">
                  <div class="flex flex-col items-center">
                    <span>Serve</span>
                    <span class="text-xs text-yellow-500 mt-1">&nbsp;</span>
                  </div>
                </th>
                <th class="px-4 py-1 text-center font-medium border">
                  <div class="flex flex-col items-center">
                    <span>Leftover</span>
                    <span class="text-xs text-yellow-500 mt-1">&nbsp;</span>
                  </div>
                </th>
                <th class="px-4 py-1 text-center text-rose-300 font-medium border">
                  <div class="flex flex-col items-center">
                    <span>Scrap/Staff</span>
                    <span class="text-xs text-yellow-500 mt-1"
                      >({{ moneyFormatter(b.totalScrapPricePerDay ?? 0) }})</span
                    >
                  </div>
                </th>
              </template>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(buff, ii) in data.menus"
              v-if="data.menus?.length > 0 && !loading"
              :key="buff.id"
              class="hover:bg-purple-50 transition-colors duration-150"
            >
              <!-- Menu Name Column -->
              <td
                class="sticky left-0 z-20 px-6 text-nowrap py-4 whitespace-nowrap bg-white border-r"
              >
                <div class="flex">
                  <div class="">
                    <Prepare
                      v-if="buff.isProduction"
                      :key="buff.id"
                      :data="buff"
                      @transaction_id="handleTransaction()"
                    />
                    <p v-else class="text-sm font-medium text-gray-900">
                      {{ buff.dishesName }}
                      <span class="text-xs text-gray-500">({{ buff.dishesId }})</span>
                    </p>
                  </div>
                </div>
              </td>

              <!-- Stock Info -->
              <td class="px-6 px-3 border text-center">
                <span
                  class="text-sm font-medium rounded-full text-nowrap"
                  :class="[
                    buff.currentStocks > 10
                      ? 'text-green-500'
                      : buff.currentStocks > 5
                      ? 'text-yellow-500'
                      : 'text-red-500',
                  ]"
                >
                  <p></p>
                  {{ buff.currentStocks ?? "0" }} <sub>{{ buff.unitAbbre ?? "-" }}</sub>
                </span>
              </td>

              <!-- Cost & Price Info -->
              <td class="px-6 px-3 border text-center text-sm text-gray-900">
                {{ moneyFormatter(buff.dishesCostPrice ?? 0) }}
                <!-- <sub>{{ buff.unitAbbre ?? "-" }}</sub> -->
              </td>
              <td class="px-6 px-3 border text-center text-sm text-gray-900">
                {{ moneyFormatter(buff.totalServedPrice ?? 0) }}
                <!-- <sub>{{ buff.unitAbbre ?? "-" }}</sub> -->
              </td>
              <td class="px-6 px-3 border text-center text-sm text-rose-500">
                {{ moneyFormatter(buff.totalScrapLoss ?? 0) }}
                <!-- <sub>{{ buff.unitAbbre ?? "-" }}</sub> -->
              </td>
              <!-- Dynamic Date Data -->
              <template v-for="(b, bb) in data.dates" :key="'date-data-' + bb">
                <td
                  class="px-6 px-3 border text-center text-nowrap text-sm text-gray-900 border-l"
                >
                  {{
                    moneyFormatter(
                      buff.buffetDates.find((ib) => ib.buffetDateId === b.id)
                        ?.servedPrice ?? 0
                    ) ?? "-"
                  }}
                  <!-- <sub>{{ buff.unitAbbre ?? "-" }}</sub> -->
                </td>
                <td class="px-4 px-3 text-center border">
                  <AddServe
                    :key="b.id"
                    :data="buff"
                    @transaction_id="handleTransaction()"
                    :dateData="buff.buffetDates.find((ib) => ib.buffetDateId === b.id)"
                  />
                  <!-- {{ buff.buffetDates.find((ib) => ib.buffetDateId === b.id) }} -->
                </td>
                <td class="px-4 px-3 text-center border">
                  <AddLeftOver
                    :key="b.id"
                    :data="buff"
                    @transaction_id="handleTransaction()"
                    :dateData="buff.buffetDates.find((ib) => ib.buffetDateId === b.id)"
                  />
                </td>
                <td class="px-4 px-3 text-center border">
                  <AddScrap
                    :key="b.id"
                    :data="buff"
                    @transaction_id="handleTransaction()"
                    :dateData="buff.buffetDates.find((ib) => ib.buffetDateId === b.id)"
                  />
                </td>
              </template>
            </tr>

            <!-- Empty State -->
            <tr v-if="data.menus?.length == 0 && !loading">
              <td :colspan="data?.dates?.length * 4 + 4" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-gray-500">
                  <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                  <p class="text-lg font-medium">No buffet items found</p>
                  <p class="text-sm">Add some items to get started</p>
                </div>
              </td>
            </tr>

            <!-- Loading State -->
            <tr v-if="loading">
              <td :colspan="data?.dates?.length * 4 + 4" class="px-6 py-8 text-center">
                <Loader />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading" class="flex justify-center items-center mt-4">
        <Loader />
      </div>
      <div
        v-if="data.menus?.length == 0 && !loading"
        class="flex justify-center pt-4 min-h-screen"
      >
        <p>No data found...</p>
      </div>
      <div class="flex w-full overflow-auto">
        <Paginator
          v-if="data.totalrows"
          :page_number="search.page_num"
          :total_rows="data.totalrows"
          :itemsperpage="search.itemsperpage"
          @page_num="handlePagination"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Loader from "@/views/Component/Loader.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
  useDebounce,
  generateRandomHex,
  moneyFormatter,
} from "@/views/Utility/Helper";

import AddLeftOver from "@/views/Pages/Buffet/Tabs/Events/Actions/AddLeftOver.vue";
import AddServe from "@/views/Pages/Buffet/Tabs/Events/Actions/AddServe.vue";
import AddScrap from "@/views/Pages/Buffet/Tabs/Events/Actions/AddScrap.vue";
import Prepare from "@/views/Pages/Buffet/Tabs/Events/Actions/Prepare.vue";
import SnapShotCostPrice from "@/views/Pages/Buffet/Tabs/Events/Actions/SnapShotCostPrice.vue";

import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "@/views/Pages/Meals/Actions/MealImageViewer.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const isMenuModalOpen = ref(false);
const loading = ref(false);
const data = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  buffet_id: 0,
});

const itemBehavior = () => {
  fillForm();
  getBuffetMenus();
  isMenuModalOpen.value = true;
};
const fillForm = () => {
  const data = props.data;

  search.value.buffet_id = data.id ?? 0;
};
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getBuffetMenus();
  handlePagination(1);
}, 500);

const getBuffetMenus = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}buffets/get-menus`,
      formData,
      BearToken(token)
    );
    data.value = response.data;

    data.value.dates.forEach((b) => {
      b.hexColor = generateRandomHex();
    });

    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getBuffetMenus();
};
const handleTransaction = () => {
  getBuffetMenus();
};
</script>

<style scoped>
/* Add smooth scrolling */
.overflow-auto {
  scroll-behavior: smooth;
}

/* Add custom scrollbar */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
