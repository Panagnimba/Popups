<template>
  <div class="container">
    <div
      class="bg-white rounded-xl absolute shadow-xl border"
      :class="[this.position, this.size]"
    >
      <!-- CLOSE BTN -->
      <div
        @click="closePopup"
        class="w-5 h-5 flex justify-center items-center absolute top-0 right-0 text-3xl text-white cursor-default bg-red-700 p-1"
      >
        &times;
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
        createAt: new Date().toLocaleString(),
      };
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (regexEmail.test(user.email)) {
        let res = await this.$axios.post("/registerUser", user);
        if (res.status == 200 && !res.data == "") {
          this.email = "";
          this.name = "";
          this.phone = "";
          // notif
          this.$store.dispatch("addNotification", {
            type: "success",
            message: "Informations save",
          });
          // SET COOKIE to avoid showing the popup
          //multiple time on the same user when reefressing
          this.setCookie("fill", true, 0);
          // close the popup
          this.closePopup();
        } else {
          this.$store.dispatch("addNotification", {
            type: "info",
            message: "Please try again",
          });
        }
      }
    },
    setCookie(name, value, days = 1) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },

    closePopup() {
      this.$emit("closePopup");
    },
  },
};
</script>
