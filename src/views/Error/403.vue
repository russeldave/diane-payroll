<template>
  <div
    class="flex items-center w-screen justify-center h-screen bg-gray-100 text-gray-800"
  >
    <div class="text-center p-8 bg-red-200 rounded-lg shadow-lg">
      <h1 class="text-6xl font-bold mb-4 animate-pulse">403 - Access Denied!</h1>
      <p class="text-2xl mb-4">
        Uh-oh! It looks like you’re trying to access a restricted area in the kitchen!
      </p>
      <div class="mb-4">
        <img
          src="https://media.giphy.com/media/3o6ZsUlgVabHNYrF3S/giphy.gif"
          alt="Funny Kitchen GIF"
          class="mx-auto w-64 h-auto"
        />
      </div>
      <p class="text-lg mb-4">
        This section is only for the chefs and sous chefs. No peeking at our secret
        recipes!
      </p>
      <a
        @click.prevent="handleLogout()"
        class="text-lg underline mt-4 hover:text-red-600 transition-colors"
      >
        Click here to return to the login screen
      </a>
      <p class="text-sm mt-6 text-gray-600">
        Or just pretend you didn’t see anything and head back to your station.
      </p>
    </div>
  </div>
</template>
<script setup>
const handleLogout = () => {
  // Clear all related authentication data
  localStorage.removeItem("token");
  // Redirect to login page or handle other logout actions
  window.location.href = "/"; // Redirect to login page (adjust path as needed)
};
</script>
<style scoped>
/* Add any additional scoped styles here */
</style>
