<template>
  <button
    @click="handleUpdate"
    class="px-3 py-2 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="isUpdating || !hasChanges"
  >
    <i v-if="!isUpdating" class="fa-solid fa-floppy-disk"></i>
    <svg v-else class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { VUE_APP_API_URL } from '@/views/Utility/Global'
import Swal from 'sweetalert2'
import { Alert } from '@/views/Utility/Helper'

// Define props
const props = defineProps({
  itemId: {
    type: [String, Number],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  }
})

// Define emits
const emit = defineEmits(['update-success', 'update-error'])

// Refs
const isUpdating = ref(false)

// Computed
const hasChanges = computed(() => {

  return props.newQuantity !== props.quantity

  
  
})

// Methods
const handleUpdate = async () => {
  if (!hasChanges.value) return

  const result = await Swal.fire({
    title: 'Update Quantity',
    text: `Change quantity from ${props.quantity} to ${props.newQuantity}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280'
  })

  if (!result.isConfirmed) {
    emit('update-error', 'Update cancelled')
    return
  }

  isUpdating.value = true

  try {
    // Simplified payload - only ID and quantity
    const payload = {
      dish_id: props.itemId,
      new_quantity: props.newQuantity
    }
    
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-update-submitted-item-quantity`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.error) {
      throw new Error(response.data.message || 'Update failed')
    }

    // Emit success event with new quantity
    emit('update-success', {
      id: props.itemId,
      quantity: props.newQuantity
    })
    
    Alert("success", "Updated!", `Quantity updated to ${props.newQuantity}`)

  } catch (error) {
    console.error("Error updating item quantity:", error)
    emit('update-error', error.message || 'Failed to update quantity')
    Alert("error", "Update Failed", error.message || "Failed to update quantity. Please try again.")
  } finally {
    isUpdating.value = false
  }
}
</script>