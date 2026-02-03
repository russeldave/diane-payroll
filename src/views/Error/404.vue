<template>
  <div class="flex items-center w-screen justify-center h-screen bg-gray-200 text-gray-800">
    <div class="text-center p-8 bg-red-100 rounded-lg shadow-lg">
      <h1 class="text-6xl font-bold mb-4 animate-pulse">404 - Kitchen Mishap!</h1>
      <p class="text-2xl mb-4">Oops! Looks like we misplaced this dish in the kitchen!</p>
      <div class="mb-4">
        <img 
          src="https://media.giphy.com/media/26FPtwDhszNxlwP4U/giphy.gif" 
          alt="Funny Kitchen GIF" 
          class="mx-auto w-64 h-auto"
        />
      </div>
      <p class="text-lg mb-4">No worries, our chefs are working hard to get everything back on track!</p>
      <router-link 
        to="/cashier" 
        class="text-lg underline mt-4 hover:text-red-600 transition-colors"
      >
        Click here to return to the main order screen and avoid any more kitchen mishaps
      </router-link>
      <p class="text-sm mt-6 text-gray-600">Or just hit the back button and pretend you didn't see anything!</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional scoped styles here */
</style>
