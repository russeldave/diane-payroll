<template>
  <div>
    <input
      ref="dateRangeInput"
      v-model="dateTimeRange"
      class="shadow shadow-gray-700 flex w-full py-2 px-4 rounded mb-4 float-end"
    />
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default {
  props: {
    use24Hours: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: String,
      default: null,
    },
    enableTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dateTimeRange: null,
      previousDate: null,
    };
  },
  mounted() {
    this.initFlatpickr();
  },
  methods: {
    initFlatpickr() {
      const self = this;

      flatpickr(this.$refs.dateRangeInput, {
        mode: "single",
        altInput: true,
        altFormat: this.use24Hours ? "F j, Y H:i:s" : "F j, Y h:i:s K", // K adds AM/PM
        dateFormat: this.use24Hours ? "Y-m-d H:i:s" : "Y-m-d h:i:s K",
        defaultDate: this.defaultTime || Date.now(),
        enableTime: this.enableTime,
        time_24hr: this.use24Hours,
        minuteIncrement: 1,
        onChange(selectedDates, dateStr, instance) {
          self.$emit("dateSelected", dateStr);

          const selectedDate = selectedDates[0] ? selectedDates[0].toDateString() : null;
          if (self.previousDate !== selectedDate) {
            instance.close();
            self.previousDate = selectedDate;
          }
        },
      });
    },
  },
  watch: {
    use24Hours: {
      handler() {
        // Reinitialize flatpickr when time format changes
        this.$nextTick(() => {
          this.initFlatpickr();
        });
      },
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
