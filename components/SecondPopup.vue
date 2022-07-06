<template>
  <div class="container relative">
    <div
      class="bg-white rounded-xl absolute shadow-xl border"
      :class="[this.position, this.size]"
    >
      <div class="close absolute right-4 cursor-pointer text-2xl">
        <span>&times;</span>
      </div>
      <div class="col transform -translate-y-9">
        <img :src="this.config.img" alt="" class="mb-2 w-1/2" />
        <!-- <div>Save to</div>
        <div class="font-bold text-5xl text-red-700">30%</div>
        <div>For your first order</div> -->
        <div v-html="this.config.description"></div>
        <!--  -->
        <form action="" class="w-full mt-2">
          <div class="row">
            <input
              v-if="this.config.showEmail"
              type="email"
              v-model="email"
              placeholder="Email"
              class="rounded-xl p-0.5 px-2 border-solid border-2 outline-none w-full"
            />
          </div>
          <div class="row gap-2">
            <input
              v-if="this.config.showName"
              type="text"
              name="name"
              v-model="name"
              placeholder="Name"
              class="rounded-xl p-0.5 px-2 border-solid border-2 outline-none w-full"
            />
            <input
              v-if="this.config.showPhone"
              type="text"
              name="phone"
              v-model="phone"
              placeholder="Phone"
              class="rounded-xl p-0.5 px-2 border-solid border-2 outline-none w-full"
            />
          </div>
          <div class="row">
            <div
              @click.prevent="registerUserFromPopup"
              class="rounded-xl p-0.5 px-2 bg-primary text-white font-semibold flex items-center justify-center w-full"
            >
              {{
                this.config.submitText == ""
                  ? "Envoyer"
                  : this.config.submitText
              }}
            </div>
          </div>
        </form>
      </div>
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
        return "w-72";
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
