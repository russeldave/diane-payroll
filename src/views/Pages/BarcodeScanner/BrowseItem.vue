<template>
<button
    @click.prevent="viewItemBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 w-[30%] focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-start"
  >
    <i class="fa fa-eye"></i> Browse Items
</button>
</template>

<script setup>
const viewItemBehavior = async () => {

};
</script>