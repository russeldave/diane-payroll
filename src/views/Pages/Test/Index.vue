<script setup>
import { ref } from 'vue'
import axios from 'axios'
import ReusableForm from '@/views/Component/ReuseForm.vue'

const fields = ref({
  name: '',
  email: '',
  profile_image: null
});

const handleSuccess = (data) => {
  console.log('Upload success!', data)
}
</script>

<template>
<div
      class="p-4 min-h-screen rounded-lg dark:border-gray-700"
    >
  <ReusableForm
    :fields="fields"
    endpoint="/api/users"
    method="post"
    @success="handleSuccess"
  />
</div>
</template>
