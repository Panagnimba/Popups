<template>
  <div class="h-full">
    <div
      class="h-full bg-second flex"
      v-if="this.$store.state.currentPopup._id"
    >
      <div
        class="customizer w-1/4 pt-4 px-2 bg-white flex flex-col items-center border"
      >
        <h2
          class="text-md text-center text-white bg-primary font-semibold w-full rounded"
        >
          customizer
        </h2>
        <!-- customizer form -->
        <form
          action=""
          class="w-full h-full bg-second flex flex-col gap-1 mt-2 pt-0 p-2 overflow-auto"
        >
          <!-- GLOBALS -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend>Globals</legend>
            <div class="row">
              <Editor
                api-key="kcjxbyyy3jp0zijxy5or1619nxx6le3lnlblhcba7lio3nnz"
                :init="{
                  plugins: 'lists link image table code help wordcount',
                }"
                v-model="description"
                @input="preview"
              />
            </div>
          </fieldset>
          <!-- IMAGE -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend>Image</legend>

            <input
              type="file"
              accept="image/*"
              name="image"
              hidden="hidden"
              id="upload"
              @change="uploadHandler"
            />
            <div
              class="row justify-center gap-2 mx-2 mb-2 border border-dashed border-blue-900 upload-wrapper"
              @click="clickOnFileInput"
            >
              <!-- IMAGE PREVIEW -->
              <img :src="this.img" alt="" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                width="80"
                height="40"
                v-if="!this.img"
              >
                <path
                  d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM223 263C213.7 272.4 213.7 287.6 223 296.1C232.4 306.3 247.6 306.3 256.1 296.1L296 257.9V392C296 405.3 306.7 416 320 416C333.3 416 344 405.3 344 392V257.9L383 296.1C392.4 306.3 407.6 306.3 416.1 296.1C426.3 287.6 426.3 272.4 416.1 263L336.1 183C327.6 173.7 312.4 173.7 303 183L223 263z"
                />
              </svg>
              <div v-if="!this.img">Upload</div>
            </div>
          </fieldset>
          <!--   APPEARENCE -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend>Appearence</legend>
            <div class="row gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                id="showpopup"
                :checked="showPopup"
                v-model="showPopup"
                @change="preview"
              />
              <label for="showpopup">Show popup</label>
            </div>
            <div class="row gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                id="showmail"
                :checked="showEmail"
                v-model="showEmail"
                @change="preview"
              />
              <label for="showmail">Show email</label>
            </div>
            <div class="row gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                id="showname"
                :checked="showName"
                v-model="showName"
                @change="preview"
              />
              <label for="showname">Show name</label>
            </div>
            <div class="row gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                id="showphone"
                :checked="showPhone"
                v-model="showPhone"
                @change="preview"
              />
              <label for="showphone">Show phone</label>
            </div>
          </fieldset>
          <!-- POSITION -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend>Position</legend>
            <div class="row gap-4">
              <div class="flex flex-col gap-4">
                <div class="flex flex-nowrap gap-2">
                  <input
                    type="radio"
                    class="w-5 h-5"
                    name="position"
                    id="tl"
                    :checked="this.tl"
                    @change="preview"
                  />
                  <label for="tl">Top-Left</label>
                </div>
                <div class="flex flex-nowrap gap-2">
                  <input
                    type="radio"
                    class="w-5 h-5"
                    name="position"
                    id="bl"
                    :checked="this.bl"
                    @change="preview"
                  />
                  <label for="bl">Bottom-Left</label>
                </div>
                <div class="flex flex-nowrap gap-2">
                  <input
                    type="radio"
                    class="w-5 h-5"
                    name="position"
                    id="ctr"
                    :checked="this.ctr"
                    @change="preview"
                  />
                  <label for="ctr">Center</label>
                </div>
              </div>
              <div class="flex flex-col gap-4 self-start">
                <div class="flex flex-nowrap gap-2">
                  <input
                    type="radio"
                    class="w-5 h-5"
                    name="position"
                    id="tr"
                    :checked="this.tr"
                    @change="preview"
                  />
                  <label for="tr">Top-Right</label>
                </div>
                <div class="flex flex-nowrap gap-2">
                  <input
                    type="radio"
                    class="w-5 h-5"
                    name="position"
                    id="br"
                    :checked="this.br"
                    @change="preview"
                  />
                  <label for="br">Bottom-Right</label>
                </div>
              </div>
            </div>
          </fieldset>
          <!-- SIZE -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend>SIZE</legend>
            <div class="row flex-wrap justify-evenly gap-4 w-full">
              <div class="flex flex-nowrap gap-2">
                <input
                  type="radio"
                  class="w-5 h-5"
                  name="size"
                  :checked="this.min"
                  id="min"
                  @change="preview"
                />
                <label for="min">Min</label>
              </div>
              <div class="flex flex-nowrap gap-2">
                <input
                  type="radio"
                  class="w-5 h-5"
                  name="size"
                  id="moy"
                  :checked="this.moy"
                  @change="preview"
                />
                <label for="moy">Moy</label>
              </div>
              <div class="flex flex-nowrap gap-2">
                <input
                  type="radio"
                  class="w-5 h-5"
                  name="size"
                  id="max"
                  :checked="this.max"
                  @change="preview"
                />
                <label for="max">Max</label>
              </div>
            </div>
          </fieldset>
          <!-- TIMING -->
          <fieldset class="border text-primary bg-white mx-1">
            <legend class="text-sm">Timing</legend>
            <div class="row gap-2">
              <span>Timeout(s)</span>
              <input
                type="number"
                min="0"
                v-model="timeout"
                @change="preview"
                step="5"
                class="w-full px-2 border rounded outline-none"
              />
            </div>
          </fieldset>
          <fieldset class="border text-primary bg-white mx-1">
            <legend>Sending</legend>
            <div class="row gap-2">
              <span class="text-sm">Text</span>
              <input
                type="text"
                v-model="submitText"
                @input="preview"
                placeholder="Envoyer"
                class="w-full px-2 border rounded outline-none"
              />
            </div>
          </fieldset>
          <!-- SUBMIT BUTTON TO UPDATE -->
          <!-- <div> -->
          <input
            type="submit"
            value="UPDATE"
            @click.prevent="updatebtn"
            class="text-white font-semibold bg-primary rounded-lg p-2 mt-2"
          />
          <!-- </div> -->
        </form>
      </div>
      <div class="preview w-full relative">
        <component
          :is="componentName"
          v-if="this.$store.state.currentPopup.config.showPopup"
        ></component>
        <!-- SUBMIT BUTTON TO UPDATE -->
        <div class="absolute right-2 top-0">
          <input
            type="submit"
            value="UPDATE"
            @click.prevent="updatebtn"
            class="text-white font-semibold bg-primary rounded-lg p-2 mt-2"
          />
        </div>
      </div>
    </div>
    <div v-else class="h-full flex flex-col col justify-center">
      <h3 class="font-bold text-3xl">NO POPUP HAS BEEN SELECTED</h3>
      <p>Please select a popup before to manage</p>
    </div>
  </div>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  components: { Editor },

  data() {
    return {
      currentConfig: this.$store.state.currentPopup, //REPRESENTE THE CURRENT POP WHEN UPDATE BTN CLICK
      id: this.$store.state.currentPopup._id,
      componentName: this.$store.state.currentPopup.componentName,
      img: this.$store.state.currentPopup.config.img,
      description: this.$store.state.currentPopup.config.description,
      showPopup: this.$store.state.currentPopup.config.showPopup,
      showEmail: this.$store.state.currentPopup.config.showEmail,
      showName: this.$store.state.currentPopup.config.showName,
      showPhone: this.$store.state.currentPopup.config.showPhone,
      // POSITION ATTIBUTE
      tr: this.$store.state.currentPopup.config.tr,
      tl: this.$store.state.currentPopup.config.tl,
      br: this.$store.state.currentPopup.config.br,
      bl: this.$store.state.currentPopup.config.bl,
      ctr: this.$store.state.currentPopup.config.ctr,
      // SIZE ATTRIBUTE
      min: this.$store.state.currentPopup.config.min,
      moy: this.$store.state.currentPopup.config.moy,
      max: this.$store.state.currentPopup.config.max,
      // TIME ATTRIBUTE
      timeout: this.$store.state.currentPopup.config.timeout,
      submitText: this.$store.state.currentPopup.config.submitText,
    };
  },
  methods: {
    preview() {
      this.currentConfig = {
        _id: this.id,
        componentName: this.componentName,
        config: {
          img: this.img,
          description: this.description,
          showPopup: this.showPopup,
          showEmail: this.showEmail,
          showName: this.showName,
          showPhone: this.showPhone,
          // POSITION ATTRIBUTES
          tr: tr.checked,
          tl: tl.checked,
          br: br.checked,
          bl: bl.checked,
          ctr: ctr.checked,
          // SIZE ATTRIBUTE
          min: min.checked,
          moy: moy.checked,
          max: max.checked,
          // TIME ATTRIBUTE
          timeout: this.timeout,
          submitText: this.submitText,
        },
      };
      this.$store.commit("setCurrentPopup", this.currentConfig);
      console.log("preview");
      console.log(this.currentConfig);
    },
    async updatebtn() {
      let data = {
        _id: this.currentConfig._id,
        componentName: this.currentConfig.componentName,
        config: this.currentConfig.config,
      };
      console.log("update btn");
      console.log(this.currentConfig);
      let resp = await this.$axios.post("/updatePopup", this.currentConfig);
      // notification
      if (resp.status == 200) {
        this.$store.dispatch("addNotification", {
          type: "success",
          message: "Successfuly updated",
        });
      } else {
        this.$store.dispatch("addNotification", {
          type: "error",
          message: "Update fails",
        });
      }
    },
    getEditorContent() {
      return tinymce.activeEditor.getContent();
    },
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
          this.$store.commit("setCurrentPopupImage", this.img);
        };
      }
    },
  },
};
</script>
<style scoped>
svg {
  fill: var(--primary-color);
}
.upload-wrapper:hover {
  background-color: var(--bg-second);
  cursor: pointer;
}
</style>
