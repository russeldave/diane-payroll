<template>
  <div class="system-statistics p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6">System Statistics</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Sales Card -->
      <div class="stat-card p-4 bg-green-100 rounded-lg shadow-md">
        <p class="text-lg font-medium">Total Sales</p>
        <p class="text-xl font-bold text-green-600">Php {{ totalSales }}</p>
      </div>
      
      <!-- Total Orders Card -->
      <div class="stat-card p-4 bg-indigo-100 rounded-lg shadow-md">
        <p class="text-lg font-medium">Total Orders</p>
        <p class="text-xl font-bold text-indigo-600">{{ totalOrders }}</p>
      </div>
      
      <!-- Active Users Card -->
      <div class="stat-card p-4 bg-yellow-100 rounded-lg shadow-md">
        <p class="text-lg font-medium">Active Users</p>
        <p class="text-xl font-bold text-yellow-600">{{ activeUsers }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalSales: 5000,  // example value
      totalOrders: 120,  // example value
      activeUsers: 25    // example value
    };
  },
};
</script>

<style scoped>
/* You can add custom styles here if needed */
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>
