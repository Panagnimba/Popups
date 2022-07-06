<template>
  <div class="container">
    <div
      class="bg-white rounded-xl absolute shadow-xl border"
      :class="[this.position, this.size]"
    >
      <div class="close absolute right-4 cursor-pointer text-xl">
        <span>&times;</span>
      </div>
      <div class="row gap-5 mb-2">
        <img :src="this.config.img" alt="" width="50px" height="50px" />
        <div class="col">
          <div v-html="this.config.description"></div>
        </div>
      </div>
      <form action="">
        <div class="row">
          <input
            v-if="this.config.showEmail"
            type="email"
            v-model="email"
            placeholder="Email"
            class="rounded-l-xl p-0.5 px-2 bg-gray-200 outline-none w-2/3"
          />
          <div
            @click="registerUserFromPopup"
            class="rounded-r-xl p-0.5 px-2 bg-primary text-white font-semibold flex items-center justify-center w-1/3"
          >
            {{
              this.config.submitText == "" ? "Envoyer" : this.config.submitText
            }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    configProps: {
      type: Object,
    },
  },
  data() {
    return {
      email: "",
      name: "",
      phone: "",
    };
  },
  computed: {
    config() {
      if (this.configProps == undefined)
        return this.$store.state.currentPopup.config;
      else return this.configProps.config;
    },
    position() {
      if (this.config.tl) {
        return "top-0 left-0";
      }
      if (this.config.tr) {
        return "top-0 right-0";
      }
      if (this.config.br) {
        return "bottom-0 right-0";
      }
      if (this.config.bl) {
        return "bottom-0 left-0";
      }
    },
    size() {
      if (this.config.min) {
        return "w-64";
      }
      if (this.config.moy) {
        return "w-96";
      }
      if (this.config.max) {
        return "w-1/2";
      }
    },
  },
  methods: {
    async registerUserFromPopup() {
      const user = {
        popId: this.$store.state.currentPopup._id,
        email: this.email,
        name: this.name,
        phone: this.phone,
      };

      let res = await this.$axios.post("/registerUser", user);
      if (res.status == 200 && !res.data == "") {
        this.email = "";
        this.name = "";
        this.phone = "";
        alert("succeees");
      }
    },
  },
};
</script>
