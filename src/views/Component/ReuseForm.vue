<script setup>
import { reactive, ref, toRefs, watch } from 'vue'
import axios from 'axios'

defineProps({
  fields: {
    type: Object,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    default: 'post'
  }
})

const emit = defineEmits(['success'])

const form = reactive({})
const errors = ref({})
const loading = ref(false)
const success = ref(false)

// Initialize form with props.fields
watch(
  () => fields,
  () => {
    Object.assign(form, JSON.parse(JSON.stringify(fields)))
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  errors.value = {}

  try {
    const response = await axios({
      method,
      url: endpoint,
      data: form
    })

    success.value = true
    emit('success', response.data)
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Unexpected error:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div v-for="(value, key) in form" :key="key">
      <label :for="key" class="capitalize block">{{ key }}:</label>
      <input
        :id="key"
        v-model="form[key]"
        type="text"
        class="border p-2 w-full"
      />
      <p v-if="errors[key]" class="text-red-500 text-sm">{{ errors[key][0] }}</p>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {{ loading ? 'Submitting...' : 'Submit' }}
    </button>

    <p v-if="success" class="text-green-500 mt-2">Submitted successfully!</p>
  </form>
</template>
