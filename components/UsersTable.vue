<template>
  <div class="m-2 p-5 bg-white flex flex-col gap-2">
    <!-- TOP PAGINATION -->
    <div class="flex justify-between gap-2 items-center py-2">
      <div class="flex gap-2 items-center">
        <span>Show</span>
        <select
          v-model="currentEntries"
          class="border p-1.5 px-2 rounded-xl outline-none"
          @change="paginateEntries"
        >
          <option v-for="entry in showEntries" :value="entry" :key="entry">
            {{ entry }}
          </option>
        </select>
        <span>entries</span>
      </div>
      <div>
        <input
          type="search"
          placeholder="Search"
          class="border rounded-xl p-1 px-3 outline-none"
          v-model="searchInput"
          @input="searchEvent"
        />
      </div>

      <div class="flex w-1/3 gap-4 justify-end">
        <button
          v-if="showcustomAllBtn"
          class="bg-green-700 text-sm text-white px-2 py-1 font-semibold rounded customAllBtn"
          @click="customizeEmail"
        >
          Customize all
        </button>
        <select
          @change="exportHandle"
          v-model="exportType"
          name="download"
          class="border outline-none p-1 px-3 rounded-xl"
        >
          <option value="">Export</option>
          <option value="json">Download JSON</option>
          <option value="csv">Download CSV</option>
        </select>
      </div>
    </div>
    <table class="w-full border">
      <thead>
        <tr>
          <td class="border p-2">
            <input
              type="checkbox"
              name="receivers"
              class="w-4 h-4"
              @change="selectAllCheckboxes"
            />
          </td>
          <th v-for="(head, id) in this.headers" :key="id" class="border p-2">
            <div class="flex w-full justify-between items-center">
              <span>{{ head.text }}</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  class="w-5 h-5"
                >
                  <path
                    d="M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"
                  />
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, id) in this.filterEntries"
          :key="id"
          @click="selectRow(user._id)"
          class="cursor-default"
        >
          <td class="border p-2">
            <input
              :id="user._id"
              :checked="user.checked"
              type="checkbox"
              name="receivers"
              class="w-4 h-4 selectList"
            />
          </td>
          <td class="border p-2">{{ id + 1 }}</td>
          <td class="border p-2">
            {{ user.createAt ? user.createAt.slice(0, -3) : "" }}
          </td>
          <td class="border p-2">
            {{ user.name != "" ? user.name : "- - - - - -" }}
          </td>
          <td class="border p-2">
            {{ user.email != "" ? user.email : "- - - - - -" }}
          </td>
          <td class="border p-2">
            {{ user.phone != "" ? user.phone : "- - - - - -" }}
          </td>
          <td class="border p-2 flex flex-wrap gap-2 justify-evenly">
            <!-- delete icon -->
            <button
              class="bg-red-700 text-sm text-white px-2 py-1 font-semibold rounded"
              :id="id"
              @click="deleteUser(user._id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-4 w-4"
                fill="white"
              >
                <path
                  d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"
                />
              </svg>
            </button>
            <!-- Customize btn -->
            <button
              class="bg-green-700 text-sm text-white px-2 py-1 font-semibold rounded"
              @click="customizeEmail(user.email)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="h-4 w-4"
                fill="white"
              >
                <path
                  d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"
                />
              </svg>
            </button>
            <!-- send btn -->
            <button
              @click="sendDefaultEmail(user.email)"
              class="bg-primary text-sm text-white px-2 py-1 font-semibold rounded"
            >
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
          </td>
        </tr>
      </tbody>
    </table>
    <!-- BOTTOM PAGINATION INFORMATIONS-->
    <div class="flex justify-between gap-2 items-center py-2">
      <span
        >Show {{ showInfo.from }} to {{ showInfo.to }} of
        {{ showInfo.of }} entries
      </span>
      <ul class="flex gap-2">
        <!-- Go to first -->
        <li
          :class="{ hidden: currentPage == 1 }"
          @click.prevent="(currentPage = 1), paginateEntries()"
        >
          <a class="border p-1.5">First</a>
        </li>
        <li
          @click.prevent="
            currentPage <= 1 ? (currentPage = 1) : (currentPage -= 1),
              paginateEntries()
          "
        >
          <a class="border p-1.5">Prev</a>
        </li>
        <!--  -->
        <li v-for="page in showPagination" :key="page">
          <a
            @click.prevent="changePage($event)"
            class="border p-1.5 link"
            :class="[{ active: page == currentPage }, { hidde: page == '...' }]"
          >
            {{ page }}
          </a>
        </li>
        <!-- Go to last -->
        <li
          @click.prevent="
            currentPage >= allPages
              ? (currentPage = allPages)
              : (currentPage += 1),
              paginateEntries()
          "
        >
          <a class="border p-1.5">Next</a>
        </li>
        <li
          :class="{ hidden: currentPage == allPages }"
          @click.prevent="(currentPage = allPages), paginateEntries()"
        >
          <a class="border p-1.5">Last</a>
        </li>
        <!--  -->
      </ul>
    </div>
    <a id="linkToExport" hidden>Export</a>
  </div>
</template>
<script>
import { $array } from "alga-js";
export default {
  data() {
    return {
      users: [],
      headers: [
        { name: "id", text: "ID" },
        { name: "date", text: "HORAIRE" },
        { name: "Name", text: "NAME" },
        { name: "Email", text: "EMAIL" },
        { name: "Phone", text: "PHONE" },
        { name: "Action", text: "ACTION" },
      ],
      //
      showEntries: [5, 10, 15, 25, 50, 70, 100],
      currentEntries: 50,
      filterEntries: [],
      //
      currentPage: 1,
      allPages: 1,
      // SERACH
      searchInput: "",
      searchEntries: [],
      // EXPORT
      exportType: "",
    };
  },
  computed: {
    showInfo() {
      const getCurrentEntries =
        this.searchEntries.length <= 0 ? this.users : this.searchEntries;
      return $array.show(
        getCurrentEntries,
        this.currentPage,
        this.currentEntries
      );
    },
    // Permet d'afficher le bouton customize all
    // Lorsque au moins 2 elements(rows) sont selectionnées
    showcustomAllBtn() {
      return (
        this.filterEntries.filter((item) => item.checked == true).length >= 2
      );
    },
    showPagination() {
      this.allPages = $array.pages(this.users, this.currentEntries);
      //
      if (this.currentPage > this.allPages) {
        this.currentPage = 1;
        this.paginateEntries();
      }
      return $array.pagination(this.allPages, this.currentPage, 3);
    },
  },
  methods: {
    paginateEntries() {
      if (this.searchInput.length >= 1) {
        this.searchEntries = $array.search(this.users, this.searchInput);
        this.filterEntries = $array.paginate(
          this.searchEntries,
          this.currentPage,
          this.currentEntries
        );
        this.allPages = $array.pages(this.searchEntries, this.currentEntries);
      } else {
        this.searchEntries = [];
        this.filterEntries = $array.paginate(
          this.users,
          this.currentPage,
          this.currentEntries
        );
        this.allPages = $array.pages(this.users, this.currentEntries);
      }
    },
    changePage(page) {
      if (!page.target.textContent.includes("...")) {
        this.currentPage = parseInt(page.target.textContent);
        this.paginateEntries();
      }
      // FOOTER BTN CLICK
      // let links = document.querySelectorAll(".link");
      // links.forEach((item) => {
      //   item.classList.remove("active");
      // });
      // page.target.classList.add("active");
    },
    searchEvent() {
      this.currentPage = 1;
      this.paginateEntries();

      console.log(this.searchInput);
    },
    async exportHandle(e) {
      const link = document.querySelector("#linkToExport");
      link.href = `http://localhost:5000/download/${this.exportType}`;
      // Send request to the server
      link.click();
      this.$store.dispatch("addNotification", {
        type: "warning",
        message: "Succesfully export users",
      });
    },
    async deleteUser(id) {
      if (
        confirm(
          "Voulez-vous supprimer cet utilisateur ?\n Votre action est irreversible !!"
        )
      ) {
        this.users = this.users.filter((user) => user._id != id);
        this.filterEntries = this.filterEntries.filter(
          (user) => user._id != id
        );
        this.searchEntries = this.searchEntries.filter(
          (user) => user._id != id
        );
        // send the request to delete the corresponding user
        let resp = await this.$axios.post("/deleteUser/", {
          id: id,
        });
        // notification
        if (resp.status == 200) {
          this.$store.dispatch("addNotification", {
            type: "success",
            message: resp.data,
          });
        } else {
          this.$store.dispatch("addNotification", {
            type: "warning",
            message: "Update fails",
          });
        }
      }
    },
    customizeEmail(email) {
      let receivers = [];
      if (email.target == undefined) {
        receivers.push(email); //means admin click on the costomize single
      } else {
        this.filterEntries.filter((item) => {
          if (item.checked) receivers.push(item.email); // find the emails of all the selected users for send multiple
        });
      }
      this.$store.dispatch("setFullSendPopup", {
        active: true,
        email: receivers,
      });
      this.$store.dispatch("setDefault", {
        active: false,
        object: this.$store.state.default.object,
        content: this.$store.state.default.content,
        id: this.$store.state.default.id, //Pour consever le id pour la mise à jour
      });
      console.log(this.$store.state.fullSendPopup);
      console.log(receivers);
    },
    //  When click on the send btn to send a default email
    sendDefaultEmail(email) {
      this.$store.dispatch("setFullSendPopup", {
        active: true,
        email: email,
      });

      this.$store.dispatch("setDefault", {
        active: true,
        object: this.$store.state.default.object,
        content: this.$store.state.default.content,
        id: this.$store.state.default.id, //Pour consever le id pour la mise à jour
      });
    },

    // SELECT LIST FOR SEND EMAIL
    selectRow(rowId) {
      //
      this.filterEntries.forEach((item) => {
        if (item._id == rowId) {
          item.checked = !item.checked;
          console.log(item);
        }
      });
      this.paginateEntries();
    },
    // WHEN CLICK TO SELECT ALL USER TO SEND EMAIL
    selectAllCheckboxes(e) {
      this.filterEntries.forEach((item) => {
        item.checked = e.target.checked;
        console.log(item);
      });
      this.paginateEntries();
    },
  },
  async fetch() {
    let result = await this.$axios.get("/getUsers");
    this.users = result.data.reverse();
    this.filterEntries = $array.paginate(this.users, 1, this.currentEntries);
    this.allPages = $array.pages(this.users, this.currentEntries);
  },
};
</script>
<style scoped>
/* FOOTER BTN CLICK */
.active {
  color: white;
  background-color: var(--primary-color);
}
tbody tr:hover {
  background-color: var(--bg-second);
}
ul li {
  cursor: default;
}
.customAllBtn {
  animation: blink 1.5s ease-in-out infinite;
}
@keyframes blink {
  0% {
    background-color: red;
  }
  100% {
    background-color: green;
  }
}
</style>
