<template>
    <svg ref="barcodeSvg"></svg>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from "vue";
  import JsBarcode from "jsbarcode";
  
  const props = defineProps({
    barcodeValue: {
        type: [String, Number],
        required: true,
        default: "000000"
    }
  });
  
  const barcodeSvg = ref(null);
  
  // Generate barcode
  const generateBarcode = () => {
    if (!barcodeSvg.value) return;
    // console.log('generateBarcode in line: 21')
    // console.log(props.barcodeValue);
  
    JsBarcode(barcodeSvg.value, String(props.barcodeValue), {
      displayValue: true,
      lineColor: "#000",
      width: 2,
      height: 90,
      fontSize: 16,
      margin: 10
    });
  };
  
  onMounted(() => {
    generateBarcode();
  });
  
  watch(() => props.barcodeValue, () => {
    generateBarcode();
  });
  </script>
  
  <style scoped>
  svg {
    user-select: none;
  }
  </style>
  