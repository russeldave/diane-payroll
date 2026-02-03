<template>
  <button
    @click="openSlideOver"
    class="bg-gray-500 p-2 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
    title="Open Apps Directory"
  >
    <i class="fa fa-solid fa-question-circle text-white"></i>
  </button>

  <SlideOver ref="slideOverRef" />
</template>

<script setup>
import { ref } from "vue";
import SlideOver from "./SlideOver.vue";

const slideOverRef = ref(null);

function openSlideOver() {
  slideOverRef.value?.open();
}
</script>
