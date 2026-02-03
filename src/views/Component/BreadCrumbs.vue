<template>
  <!-- <nav class="breadcrumbs-container float-end absolute right-2 pt-2 md:pt-0 lg:pt-0 xl:pt-0">
    <ol class="breadcrumbs text-xs md:text-lg">
      <li>
        <router-link to="/" class="breadcrumb-link">Home</router-link>
        <span class="breadcrumb-separator">/</span>
      </li>
      <li>{{ page }}</li>
    </ol>
  </nav> -->
  <div></div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  page: String,
});
</script>

<style scoped>
.breadcrumbs-container {
  font-size: 14px;
  margin-bottom: 10px;
}

.breadcrumbs {
  display: flex;
  list-style-type: none;
  padding: 0;
}

.breadcrumbs li {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #007bff; /* Blue link color */
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #0056b3; /* Darker blue on hover */
}

.breadcrumb-separator {
  margin: 0 5px;
  color: #6c757d; /* Separator color */
}

/* Updated secondary colors */
.breadcrumb-link.secondary {
  color: #447b9d; /* Slate-900 */
}

.breadcrumb-link.secondary:hover {
  color: #1a4b5d; /* Darker Slate-900 on hover */
}
</style>
