<template>
  <div class="flex items-center justify-center w-screen h-screen bg-gray-100 text-gray-800">
    <div class="text-center p-8 bg-yellow-500 rounded-lg shadow-lg">
      <h1 class="text-6xl font-bold mb-4 animate-pulse">Payment Successful!</h1>
      <p class="text-2xl mb-4">Your payment has been processed successfully.</p>
      <div class="mb-4">
        <img 
          src="https://media.giphy.com/media/26xBUDjLUpRwaV7wA/giphy.gif" 
          alt="Payment Success GIF" 
          class="mx-auto w-64 h-auto"
        />
      </div>
      <p class="text-lg mb-4">Thank you for your payment! You are now ready to move forward.</p>
      <router-link 
        to="/dashboard" 
        class="text-lg underline mt-4 hover:text-yellow-700 transition-colors"
      >
        Go to Dashboard
      </router-link>
      <p class="text-sm mt-6 text-gray-600">If you need any assistance, feel free to reach out to our support team.</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional additional styling specific to success page */
</style>
