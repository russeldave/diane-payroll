<template>
  <div class="flex items-center justify-center w-screen h-screen bg-gray-200 text-gray-800">
    <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h1 class="text-4xl font-bold mb-4">A Farewell Message</h1>
      <p class="text-xl mb-4">Hello! I want to share some important news with you.</p>
      <div class="mb-4">
        <img 
          src="https://media.giphy.com/media/3o6Zt5m4FdcT2PujG0/giphy.gif" 
          alt="Goodbye GIF" 
          class="mx-auto w-64 h-auto"
        />
      </div>
      <p class="text-lg mb-4">
        After much consideration, I have decided to resign from my position at Tancor Realty And Development.
        My time here has been incredibly rewarding, and I am truly grateful for the experiences and
        connections I’ve made. It has been a pleasure working with you, and I want to thank you for your
        support and collaboration.
      </p>
      <p class="text-lg mb-4">
        As I transition to new opportunities, I want to ensure a smooth handover. If you have any questions
        or need assistance during this period, please don't hesitate to reach out. I’m here to help with
        any concerns you might have.
      </p>
      <router-link 
        to="/" 
        class="text-lg underline mt-4 hover:text-blue-600 transition-colors"
      >
        Return to the main page
      </router-link>
      <p class="text-sm mt-6 text-gray-600">Thank you for everything, and I wish you all the best!</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional scoped styles here */
</style>
