// v-autocomplete-off.js
export default {
    mounted(el) {
      // Set autocomplete="off" for all input elements
      const inputs = el.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
      });
    }
  };
  