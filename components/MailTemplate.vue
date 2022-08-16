<template>
  <div class="h-full">
    <!-- Default -->
    <div class="h-full flex flex-col col justify-center items-center p-8">
      <h3 class="font-bold text-3xl text-center">
        Manage and customize all your email template
      </h3>
      <p>Please how do you like to do</p>
      <div class="flex gap-4 p-4">
        <button
          class="text-white bg-primary text-xl font-semibold p-1 px-3 rounded shadow"
          @click="show = true"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-envelope-open-text"></i>
            <span>Emailing</span>
          </div>
        </button>
        <button
          @click="showDefault = true"
          class="text-white bg-primary text-xl font-semibold p-1 px-3 rounded shadow"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-at"></i>
            <span>Default Email</span>
          </div>
        </button>
      </div>
    </div>
    <!-- Start Email Template -->
    <ConfigEmail-Emailing
      v-if="show"
      @closeEvent="show = false"
    ></ConfigEmail-Emailing>
    <!--  -->
    <ConfigEmail-DefaultConfig
      v-if="showDefault"
      @closeEvent="showDefault = false"
    ></ConfigEmail-DefaultConfig>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  components: { Editor },
  data() {
    return {
      show: false,
      showDefault: false,
    };
  },

  mounted() {
    this.object = this.$store.state.default.object;
    this.content = this.$store.state.default.content;
  },
  methods: {
    // SELCECT THE FILE INPUT WHEN CLICKED ON UPLOAD ARREA
    clickOnFileInput() {
      let fileInput = document.querySelector("#upload");
      fileInput.click();
    },
    // UPLOAD HANDLER
    uploadHandler(e) {
      const file = e.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.img = e.target.result;
        };
      }
    },
    closeFullSendPopup() {
      this.show = false;
      this.showDefault = false;
    },
    clickOutSide(e) {
      if (!this.$refs.sendPopupForm.contains(e.target))
        this.closeFullSendPopup();
    },

    saveDefaultEmailConfig() {
      //
      this.$store.dispatch("setDefault", {
        object: this.object,
        content: this.content,
      });

      this.object = "";
      this.content = "";
      // Dispatch notification
      this.$store.dispatch("addNotification", {
        type: "success",
        message: "Succesfully update",
      });
    },
  },
};
</script>
<style scoped>
.fullPopup {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0%;
  left: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
