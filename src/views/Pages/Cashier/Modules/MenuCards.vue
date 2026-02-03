<template>
  <div
    v-if="!props.isSimple"
    class="absolute inset-0 bg-cover bg-center"
    :style="{
      backgroundImage: props.data.thumbNail
        ? `url(data:image/jpeg;base64,${props.data.thumbNail})`
        : `url(${defaultImage})`,
    }"
  ></div>
  <div class="relative w-full h-40">
    <div
      class="absolute shadow-[4px_4px_0_rgba(0,0,0,0.25)] -top-1 left-0 bg-yellow-300 text-slate-600 text-nowrap text-[0.6em] font-bold px-2 py-1 rounded-r"
    >
      {{ props.data.menuCategoryName ?? "All" }}
    </div>
    <div
      class="absolute -top-1 right-0 text-white text-nowrap text-xs px-2 py-1 rounded-full"
      title="Warning: Insufficient Ingredients"
      v-if="props.data.isOutOfStocks"
    >
      <i
        class="fa fa-exclamation-triangle text-xl animate__animated animate__heartBeat animate__delay-2s animate__infinite text-red-500"
      ></i>
    </div>
    <div
      :class="props.isSimple ? 'h-full flex flex-col items-center justify-center' : ''"
      :style="props.isSimple ? { backgroundColor: 'rgb(149, 138, 133)' } : {}"
      class="absolute bottom-0 text-xs px-1 py-0 w-full text-wrap bg-black"
    >
      <h3
        :class="
          props.isSimple
            ? 'text-center text-[1.2em] font-bold'
            : 'text-[0.98em] font-semibold'
        "
        class="text-white uppercase text-wrap"
        :title="props.data.title"
      >
        {{ props.data.title }}
      </h3>
      <p class="text-yellow-500 text-right text-sm font-extrabold">
        {{ moneyFormatter(props.data.retailPrice ?? 0) }}
      </p>
    </div>    
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/views/Component/Loader.vue";
import Error403 from "@/views/Error/403.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  BearToken,
  FormDx,
  useDebounce,
  moneyFormatter,
} from "@/views/Utility/Helper.js";

import defaultImage from "@/assets/images/default/imageNotAvailable.jpg";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  isSimple: {
    type: Boolean,
    default: true,
  },
});
</script>
