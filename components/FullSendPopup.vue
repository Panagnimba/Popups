<template>
  <div
    class="fullPopup z-40"
    v-show="fullSendPopup.active"
    @click="clickOutSide"
  >
    <div class="w-1/2 bg-white p-6 rounded-xl absolute" ref="sendPopupForm">
      <form
        method="POST"
        class="flex flex-col gap-4"
        @submit.prevent="sendMail"
      >
        <div class="flex gap-2 flex-nowrap justify-between items-center">
          <span class="w-16 text-sm">To:</span>
          <input
            name="recipient"
            type="text"
            placeholder="Destinataire"
            class="border w-full p-0.5 px-2 rounded outline-none"
            v-model="recipient"
          />
        </div>
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
        <!-- New add -->
        <div class="flex justify-between gap-2 h-24">
          <span
            v-if="this.templates.length"
            class="w-16 text-primary text-sm text-center"
            >Choose a template</span
          >
          <div class="w-full flex gap-3 overflow-auto">
            <div
              v-for="(template, i) in this.templates"
              :key="i"
              class="h-full w-24 border shadow relative tempWrap"
              :title="template.description"
              @click="chooseEmailTemplate($event, template)"
            >
              <img :src="template.image" alt="" class="w-full h-full" />
              <div class="labelforTemplate">{{ template.name }}</div>
            </div>
          </div>
          <!-- SEND BUTTON -->
        </div>
        <button
          @click.prevent.stop="sendMail"
          class="flex justify-center items-center self-end gap-4 bg-primary px-4 py-1 text-white rounded-md w-36 h-10"
        >
          <div class="font-semibold">SEND</div>
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
      </form>
      <!-- CLOSE BTN -->
      <div
        @click="closeFullSendPopup"
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
  computed: {
    fullSendPopup() {
      this.recipient = this.$store.state.fullSendPopup.email;
      // fill the form with the default content set in the store
      if (this.$store.state.default.active) {
        this.object = this.$store.state.default.object;
        this.content = this.$store.state.default.content;
      } else {
        this.object = "";
        this.content = "";
      }
      return this.$store.state.fullSendPopup;
    },
  },
  data() {
    return {
      recipient: "",
      object: "",
      content: "",
      templates: [],
    };
  },
  async mounted() {
    let resp = await this.$axios.get("/getEmailTemplate");
    this.templates = resp.data;
    console.log(resp.data);
  },
  methods: {
    closeFullSendPopup() {
      this.$store.dispatch("setFullSendPopup", {
        active: false,
        email: [],
      });
    },
    clickOutSide(e) {
      if (!this.$refs.sendPopupForm.contains(e.target))
        this.closeFullSendPopup();
    },
    chooseEmailTemplate(e, template) {
      this.content = template.content;
      this.object = template.object;

      document.querySelectorAll(".tempWrap").forEach((temp) => {
        temp.classList.remove("currentTemplate");
      });

      e.target.parentNode.classList.add("currentTemplate");
      console.log(template);
    },
    async sendMail() {
      let mailObject = {
        receivers: this.recipient,
        object: this.object,
        content: this.content,
      };
      // Clear the inputs after send email
      this.recipient = "";
      this.object = "";
      this.content = "";

      // Send request to the server for handle the mail sending
      let resp = await this.$axios.post("/sendMail", mailObject);
      if (resp.status == 200 && !resp.data.error) {
        this.$store.dispatch("addNotification", {
          type: "success",
          message: "Email send successfully",
        });
      } else {
        this.$store.dispatch("addNotification", {
          type: "error",
          message: "Fails Email not send",
        });
      }
      this.closeFullSendPopup();
    },
  },
};
</script>
<style scoped>
.fullPopup {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
}
.labelforTemplate {
  width: 100%;
  height: 0%;
  font-size: 12px;
  position: absolute;
  bottom: 0%;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.tempWrap:hover .labelforTemplate {
  align-items: center;
  height: 100%;
  height: 100%;
  color: white;
  background-color: var(--primary-color);
}
.currentTemplate {
  border: 2px solid red;
}
</style>
