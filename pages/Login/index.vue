<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <div
      class="w-1/2 lg:w-1/3 m-12 bg-white rounded-xl relative shadow-xl border"
    >
      <h3 class="text-xl font-semibold text-center mt-2">Login</h3>
      <form action="" class="w-full mt-2">
        <div class="row">
          <input
            type="text"
            placeholder="username"
            v-model="username"
            class="rounded-xl p-1 px-2 border-solid border-2 outline-none w-full"
          />
        </div>
        <div class="row">
          <input
            type="password"
            placeholder="password"
            v-model="password"
            class="rounded-xl p-1 px-2 border-solid border-2 outline-none w-full"
          />
        </div>
        <div class="row">
          <input
            type="submit"
            @click.prevent="handleLogin"
            class="rounded-xl p-1 px-2 bg-primary text-white font-semibold flex items-center justify-center w-full"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: "Admin login",
    };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    async handleLogin() {
      const user = {
        username: this.username,
        password: this.password,
      };
      //  EFFACER LES CHAMPS INPUTS
      (this.username = ""), (this.password = "");
      //   SEND THE REQUEST TO LOGIN
      let response = await this.$axios.post("/login", user);
      if (response.status == 200 && response.data.token != null) {
        // AUTHENTICATE USER IN THE STORE
        this.$store.commit("setAuthUser", response.data);
        this.$router.push("/dashboard");
      }
    },
  },
};
</script>
