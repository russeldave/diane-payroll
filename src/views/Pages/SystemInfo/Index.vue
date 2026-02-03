<template>
  <div class="system-info">
    <h1 class="text-2xl font-bold mb-4">Restaurant Inventory and POS System - Brixe</h1>
    <div class="system-details-section mt-6">
      <h2 class="text-xl font-semibold">Brixe Inventory and POS System</h2>
      <p>{{ systemDetails.description }}</p>
      <small class="text-red-500">The Owner and Developer does not authorize illegal replication of system and data within the system.</small>
      <ul class="mt-6">
        <li><strong>Version:</strong> {{ systemDetails.version }}</li>
        <li><strong>Last Update:</strong> {{ systemDetails.lastUpdate }}</li>
      </ul>
    </div>
    <div class="author-section mt-6">
      <h2 class="text-xl font-semibold">Owner</h2>
      <p>Jan Wilbur Tan</p>
    </div>
    <div class="author-section mt-6">
      <h2 class="text-xl font-semibold">Authors</h2>
      <p>{{ author?.name }}</p>
    </div>
    <div class="author-section mt-6">
      <h2 class="text-xl font-semibold">Contributors</h2>
      <p>{{ author.contributors }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemDetails: {
        description: 'Brixe Inventory and POS System is a comprehensive solution for managing restaurant inventory and point of sale efficiently.',
        version: '2.2.25',
        lastUpdate: '2025-02-03'
      },
      author: {
        name: 'John The Great, Aldrin and Wilbur Tan',
        contributors: 'Rica Aguirre, Ashbie Olandag and Joy Romero',
      }
    };
  }
};
</script>

<style scoped>
.system-info {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section, .system-details-section, .author-section {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
}
</style>
