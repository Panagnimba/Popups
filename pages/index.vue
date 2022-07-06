<template>
  <div class="w-full h-screen relative" v-if="this.timeoutEnd">
    <component :is="this.currentPopup.componentName" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPopup: "",
      timeoutEnd: false,
    };
  },
  mounted() {
    this.currentPopup = this.$store.state.currentPopup;
    // COUNT DOWN FOR DISPLAY POPUP TO THE USER
    this.countdown();
  },
  methods: {
    countdown() {
      let timeout = parseInt(this.currentPopup.config.timeout) * 1000; // IN SECONDS
      setTimeout(() => {
        this.timeoutEnd = true;
      }, timeout);
    },
  },
};
</script>
