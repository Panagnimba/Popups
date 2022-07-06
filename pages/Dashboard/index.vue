<template>
  <div v-if="isAuthenticated">
    <dashboard></dashboard>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  mounted() {
    // PREMIERE SOLUTION FOR CHECK AUTH USIN STORE
    if (!this.$store.state.auth.token) {
      this.$router.push("/login");
    } else {
      this.isAuthenticated = true;
    }
    // SECOND SOLUTION FOR CHECK AUTH WITH VUEX-PERSISTED STATE

    // let store = JSON.parse(window.localStorage.getItem("vuex"));
    // If the user is not authenticated
    // if (store == null || !store.auth.token) {
    //   this.$router.push("/login");
    // } else {
    //   this.isAuthenticated = true;
    // }
  },
};
</script>
