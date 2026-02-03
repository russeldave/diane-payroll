<template>
  <span
    class="inline-block hover:scale-110 transition-transform duration-300 ease-in-out"
    :class="['max-h-12', 'max-w-[180px]', 'w-auto', 'h-full']"
  >
    <svg
      v-if="!isAlter"
      viewBox="0 0 180 50"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full"
      preserveAspectRatio="xMinYMin meet"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="1"
            dy="1"
            stdDeviation="0.5"
            flood-color="#CCCCCC"
            flood-opacity="0.5"
          />
        </filter>
      </defs>
      <g font-family="Helvetica, Arial, sans-serif" text-anchor="start">
        <!-- Shadow text for 3D effect -->
        <text
          x="5"
          y="30"
          font-size="35"
          font-weight="bold"
          fill="#CCCCCC"
          letter-spacing="1"
          filter="url(#shadow)"
        >
          brixe
        </text>
        <text
          x="5"
          y="45"
          font-size="14"
          font-weight="lighter"
          fill="#CCCCCC"
          letter-spacing="1.5"
          filter="url(#shadow)"
        >
          bistro + cafe
        </text>
        <!-- Main text -->
        <text
          x="4"
          y="29"
          font-size="35"
          font-weight="bold"
          fill="#FFFFFF"
          letter-spacing="1"
        >
          brixe
        </text>
        <text
          x="4"
          y="44"
          font-size="14"
          font-weight="lighter"
          fill="#FFFFFF"
          letter-spacing="1.5"
        >
          bistro + cafe
        </text>
      </g>
    </svg>
    <svg
      v-else
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      class="w-auto h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="shadowAlt" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0.5"
            dy="0.5"
            stdDeviation="0.3"
            flood-color="#999999"
            flood-opacity="0.4"
          />
        </filter>
      </defs>
      <g font-family="Courier New, monospace" text-anchor="middle">
        <!-- Shadow B -->
        <text
          x="30"
          y="38"
          font-size="48"
          font-weight="bold"
          fill="#999999"
          filter="url(#shadowAlt)"
        >
          B
        </text>
        <!-- Main B -->
        <text x="29" y="37" font-size="48" font-weight="bold" fill="#F59E0B">B</text>
      </g>
    </svg>
  </span>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  isAlter: {
    type: Boolean,
    default: false,
  },
});
</script>
