<template>
  <div class="fullPopup z-40" @click="clickOutSide">
    <div class="w-1/2 bg-white p-6 rounded-xl absolute" ref="sendPopupForm">
      <h3 class="font-bold text-xl text-center text-primary mb-4">
        Default Email to be send
      </h3>
      <form method="POST" class="flex flex-col gap-4">
        <div class="flex gap-2 flex-nowrap justify-between items-center">
          <span class="w-16 text-sm">Object:</span>
          <input
            name="object"
            type="text"
            placeholder="Object"
            class="border w-full p-0.5 px-2 rounded outline-none"
            v-model="object"
          />
        </div>
        <div class="flex gap-2 flex-nowrap items-start">
          <span class="w-16 text-sm">Content:</span>
          <div class="w-full">
            <Editor
              name="content"
              api-key="kcjxbyyy3jp0zijxy5or1619nxx6le3lnlblhcba7lio3nnz"
              :init="{
                plugins: 'lists link image table code help wordcount',
              }"
              placeholder="Your message goes here"
              class="border w-ful h-48 p-0.5 px-2 rounded outline-none"
              v-model="content"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <!-- SEND BUTTON -->
          <button
            @click.prevent.stop="saveDefaultEmailConfig"
            class="flex justify-center items-center gap-4 bg-primary px-4 py-1 text-white rounded-md w-36"
          >
            <div class="font-semibold">SAVE</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-4 h-4"
              fill="white"
            >
              <path
                d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
              />
            </svg>
          </button>
        </div>
      </form>
      <!-- CLOSE BTN -->
      <div
        @click.stop="closeFullSendPopup"
        class="w-5 h-5 flex justify-center items-center absolute top-0 right-0 text-3xl text-white cursor-default bg-red-700 p-1"
      >
        &times;
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  components: { Editor },
  data() {
    return {
      object: "",
      content: "",
    };
  },
  mounted() {
    this.object = this.$store.state.default.object;
    this.content = this.$store.state.default.content;
  },
  methods: {
    closeFullSendPopup() {
      this.$emit("closeEvent");
    },
    clickOutSide(e) {
      if (!this.$refs.sendPopupForm.contains(e.target))
        this.closeFullSendPopup();
    },
    async saveDefaultEmailConfig() {
      //
      this.$store.dispatch("setDefault", {
        object: this.object,
        content: this.content,
        id: this.$store.state.default.id, //Pour consever le id pour la mise à jour
      });

      this.object = "";
      this.content = "";

      this.closeFullSendPopup();
      // send request
      let resp = await this.$axios.post(
        "/updateDefaultEmailConfig",
        this.$store.state.default
      );
      // Dispatch notification
      if (resp.status == 200) {
        this.$store.dispatch("addNotification", {
          type: "success",
          message: "Succesfully update",
        });
      } else {
        this.$store.dispatch("addNotification", {
          type: "info",
          message: "Update fails",
        });
      }
    },
  },
};
</script>
