<!-- src/App.vue -->
<template>
  <component class="bg-gray-900">
    <RouterView />
    <!-- <ChatBot /> -->
  </component>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import ChatBot from "./views/Component/ChatBot.vue";

const route = useRoute();
</script>
