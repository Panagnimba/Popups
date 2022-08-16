<template>
  <!-- Start Email Template -->
  <div class="fullPopup z-40" @click="clickOutSide">
    <div class="w-1/2 bg-white p-6 rounded-xl absolute" ref="sendPopupForm">
      <h3 class="font-bold text-xl text-center text-primary">
        New Email Template
      </h3>
      <form class="flex flex-col gap-2">
        <div class="flex flex-col gap-1 w-full">
          <span class="text-primary text-xs">Description</span>
          <input
            name="description"
            type="text"
            placeholder="Description"
            class="border w-full p-0.5 px-2 rounded outline-none"
            v-model="description"
          />
        </div>
        <div class="flex gap-2">
          <div class="flex flex-col justify-between gap-1 w-3/4">
            <span class="text-primary text-xs">Name</span>
            <input
              name="title"
              type="text"
              placeholder="Title"
              class="border w-full p-0.5 px-2 rounded outline-none"
              v-model="name"
            />
            <span class="text-primary text-xs">Object</span>
            <input
              name="object"
              type="text"
              placeholder="Object"
              class="border w-full p-0.5 px-2 rounded outline-none"
              v-model="object"
            />
          </div>
          <div class="flex flex-col gap-1 w-1/4">
            <span class="text-primary text-xs">Image</span>
            <input
              type="file"
              accept="image/*"
              name="image"
              hidden="hidden"
              id="upload"
              @change="uploadHandler"
            />
            <!--  -->
            <div
              @click="clickOnFileInput"
              class="w-full h-24 flex justify-center items-center gap-4 bg-second border p-0.5 px-2 rounded outline-none cursor-pointer"
            >
              <!-- IMAGE PREVIEW -->
              <div v-if="this.img" class="overflow-auo h-full flex">
                <img :src="this.img" alt="" class="w-full" />
              </div>
              <div
                v-if="!this.img"
                class="flex flex-wrap justify-center items-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  class="w-6"
                >
                  <path
                    d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM223 263C213.7 272.4 213.7 287.6 223 296.1C232.4 306.3 247.6 306.3 256.1 296.1L296 257.9V392C296 405.3 306.7 416 320 416C333.3 416 344 405.3 344 392V257.9L383 296.1C392.4 306.3 407.6 306.3 416.1 296.1C426.3 287.6 426.3 272.4 416.1 263L336.1 183C327.6 173.7 312.4 173.7 303 183L223 263z"
                  />
                </svg>
                <span class="text-primary text-sm">Upload</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 flex-nowrap items-start">
          <span class="text-primary text-xs">Template</span>
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
        <div class="flex justify-between">
          <span v-if="this.templates.length" class="text-primary text-xs">
            Choose a template
          </span>
          <div class="flex items-center gap-2 text-xs">
            <label for="defaultConfig">Default</label>
            <input
              type="checkbox"
              name=""
              id="defaultConfig"
              :checked="true"
              @change="defaultBtnHandle"
            />
          </div>
        </div>
        <div class="w-full flex gap-3 overflow-auto">
          <div
            v-for="(template, i) in this.templates"
            :key="i"
            class="h-24 w-24 border shadow relative tempWrap"
            :title="template.description"
            @click="chooseEmailTemplate($event, template)"
          >
            <img :src="template.image" alt="" class="w-full h-full" />
            <div class="labelforTemplate">{{ template.name }}</div>
          </div>
        </div>
        <!-- SEND BUTTON -->
        <button
          @click.prevent.stop="addTemplate"
          class="flex justify-center items-center self-end gap-4 bg-primary px-4 py-1 text-white rounded-md w-full h-10 mt-4"
        >
          <div class="font-semibold">ADD</div>
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
        @click.stop="closeFullSendPopup"
        class="w-5 h-5 flex justify-center items-center absolute top-0 right-0 text-3xl text-white cursor-default bg-red-700 p-1"
      >
        &times;
      </div>
    </div>
  </div>
  <!-- End Email Template -->
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  components: { Editor },
  data() {
    return {
      img: "",
      name: "",
      object: "",
      description: "",
      content: "",
      templates: [],
      choosenTemplateId: "",
    };
  },
  async fetch() {
    let resp = await this.$axios.get("/getEmailTemplate");
    this.templates = resp.data;
    console.log(resp.data);
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
      this.$emit("closeEvent");
    },
    clickOutSide(e) {
      if (!this.$refs.sendPopupForm.contains(e.target))
        this.closeFullSendPopup();
    },
    //
    async addTemplate() {
      let template = {
        name: this.name,
        object: this.object,
        description: this.description,
        image: this.img,
        content: this.content,
        id: this.choosenTemplateId,
      };
      // Send request
      if (template.image && template.name && template.content) {
        let resp = await this.$axios.post("/addEmailTemplate", template);
        // Dispatch notification
        if (resp.status == 200) {
          this.$store.dispatch("addNotification", {
            type: "success",
            message: resp.data,
          });
        } else {
          this.$store.dispatch("addNotification", {
            type: "warning",
            message: "Action fails",
          });
        }
        console.log(resp.data);
        this.closeFullSendPopup();
      }
    },
    chooseEmailTemplate(e, template) {
      this.content = template.content;
      this.img = template.image;
      this.name = template.name;
      this.object = template.object;
      this.description = template.description;
      this.choosenTemplateId = template._id;

      document.querySelectorAll(".tempWrap").forEach((temp) => {
        temp.classList.remove("currentTemplate");
      });

      e.target.parentNode.classList.add("currentTemplate");
      // unchecked the default config button
      document.querySelector("#defaultConfig").checked = false;
      console.log(template);
    },
    defaultBtnHandle(e) {
      if (e.target.checked) {
        document.querySelectorAll(".tempWrap").forEach((temp) => {
          temp.classList.remove("currentTemplate");
        });
        //
        this.content = "";
        this.img = "";
        this.name = "";
        this.object = "";
        this.description = "";
        this.choosenTemplateId = "";
      }
    },
  },
};
</script>
<style scoped>
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
