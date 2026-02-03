<template>
    <div>
      <!-- Select2 component with v-model, options (passed as prop), and settings -->
      <Select2 v-model="myValue" :options="myOptions" :settings="select2Settings" @change="handleChange" @select="handleSelect" />
      <h4>Value: {{ myValue }}</h4>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import Select2 from 'vue3-select2-component';
  
  // Define props received by the component
  const props = defineProps({
    options: {
      type: Array, // Type of the prop (Array in this case)
      required: true // Whether the prop is required
    }
  });
  
  // Reactive state for selected value
  const myValue = ref('');
  
  // Settings for Select2 component
  const select2Settings = {
    settingOption1: value1,
    settingOption2: value2
  }; // Adjust with actual settings as needed
  
  // Event handlers
  const handleChange = (newValue) => {
    console.log(newValue);
    // Optionally emit event or perform other actions
  };
  
  const handleSelect = ({ id, text }) => {
    console.log({ id, text });
    // Optionally emit event or perform other actions
  };
  
  // Export components and variables for template
  export { myValue, select2Settings, handleChange, handleSelect, Select2 };
  </script>
  