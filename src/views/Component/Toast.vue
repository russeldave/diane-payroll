<template>
  <div v-if="visible" class="toast" :class="[type, positionClass]">
    <i :class="iconClass" class="toast-icon"></i>
    {{ message }}
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  message: String,
  type: String,
  duration: Number,
  position: {
    type: String,
    default: 'top-center'
  }
});

const visible = ref(false);

const positionClass = computed(() => {
  switch (props.position) {
    case 'top-left':
      return 'toast-top-left';
    case 'top-right':
      return 'toast-top-right';
    case 'bottom-left':
      return 'toast-bottom-left';
    case 'bottom-right':
      return 'toast-bottom-right';
    case 'top-center':
    default:
      return 'toast-top-center';
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'info':
      return 'fas fa-info-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    default:
      return '';
  }
});

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration || 3000);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  background-color: #333;
  z-index: 1000;
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.toast-icon {
  margin-right: 10px;
  font-size: 18px;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast.info {
  background-color: #2196f3;
}

.toast.warning {
  background-color: #ff9800;
}

.toast-top-left {
  top: 20px;
  left: 20px;
}

.toast-top-right {
  top: 20px;
  right: 20px;
}

.toast-bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast-top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
