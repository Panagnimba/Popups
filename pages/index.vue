<template>
  <div class="w-full h-screen relative" v-if="this.timeoutEnd && this.isOpen">
    <component
      :is="this.currentPopup.componentName"
      @closePopup="isOpen = false"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPopup: "",
      timeoutEnd: false,
      isOpen: true,
    };
  },
  mounted() {
    this.currentPopup = this.$store.state.currentPopup;
    // COUNT DOWN FOR DISPLAY POPUP TO THE USER
    //BEFORE CHECK IF THE USER NOT ALREADY FILL THE POPUP
    if (this.getCookie("fill") == null) this.countdown();
  },
  methods: {
    countdown() {
      let timeout = parseInt(this.currentPopup.config.timeout) * 1000; // IN SECONDS
      setTimeout(() => {
        this.timeoutEnd = true;
      }, timeout);
    },
    getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
  },
};
</script>
