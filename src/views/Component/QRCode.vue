<template>
  <div>
    <div v-if="qrCodeUrl" class="qr-code-container">
      <img :src="qrCodeUrl" :alt="'QR Code for ' + qrcodeValue" class="qr-code-image" :class="addNewClassName"/>
      <div class="sku-label mt-3">{{ qrcodeValue }}</div>
    </div>
    <div v-else>
      <p>Loading QR Code...</p>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { TOPSILOG } from '../Utility/Global';
export default {
  name: 'QRCodeComponent',
  props: {
    qrcodeValue: {
      type: String,
      required: true
    },
    addNewClassName:{
      type: String
    }
  },
  setup(props) {
    const qrCodeUrl = ref(null);

    // Function to fetch QR code URL
    const fetchQRCode = async () => {
      if (!props.qrcodeValue) return;

      const size = '200x200'; // Define size for the QR code
      const data = encodeURIComponent(props.qrcodeValue);
      
      qrCodeUrl.value = `${TOPSILOG}${data}`;
    };

    // Fetch QR code on component mount and whenever qrcodeValue changes
    onMounted(fetchQRCode);
    watch(() => props.qrcodeValue, fetchQRCode);

    return {
      qrCodeUrl
    };
  }
};
</script>

<style scoped>
.qr-code-container {
  text-align: center;
  margin: 20px;
}
.qr-code-image {
  display: block;
  margin: 0 auto;
}
.sku-label {
  margin-top: 10px;
  font-weight: bold;
}
</style>
