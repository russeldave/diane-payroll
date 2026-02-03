<template>
    <div class="flex items-center justify-center w-screen h-screen bg-gray-100 text-gray-800">
      <div class="text-center p-8 bg-white rounded-lg shadow-lg border-4 border-emerald-900">
        <h1 class="text-6xl font-bold mb-4 animate-pulse text-emerald-900">Payment Cancelled</h1>
        <p class="text-2xl mb-4">Oops! It looks like your payment was not processed.</p>
        <div class="mb-4">
          <img 
            src="https://media.giphy.com/media/26A3f9LMdRjfq9dI6/giphy.gif" 
            alt="Payment Cancelled GIF" 
            class="mx-auto w-64 h-auto"
          />
        </div>
        <p class="text-lg mb-4">Your transaction has been cancelled, but don't worry, you can try again anytime.</p>
        <router-link 
          to="/retry-payment" 
          class="text-lg underline mt-4 hover:text-emerald-600 transition-colors"
        >
          Retry Payment
        </router-link>
        <p class="text-sm mt-6 text-gray-600">Need help? Our support team is here to assist you.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Optional additional styling specific to cancelled page */
  </style>
  