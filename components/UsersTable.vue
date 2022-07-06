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
      <div>
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
        <tr v-for="(user, id) in this.filterEntries" :key="id">
          <td class="border p-2">{{ id + 1 }}</td>
          <td class="border p-2">{{ user.name }}</td>
          <td class="border p-2">{{ user.email }}</td>
          <td class="border p-2">{{ user.phone }}</td>
          <td class="border p-2 flex flex-wrap gap-2 justify-evenly">
            <button
              class="bg-red-700 text-sm text-white px-2 py-1 font-semibold rounded"
              :id="id"
              @click="deleteUser(user._id)"
            >
              Delete
            </button>
            <button
              class="bg-green-700 text-sm text-white px-2 py-1 font-semibold rounded"
            >
              Customize
            </button>
            <button
              class="bg-primary text-sm text-white px-2 py-1 font-semibold rounded"
            >
              Send
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
        { name: "Name", text: "NAME" },
        { name: "Email", text: "EMAIL" },
        { name: "Phone", text: "PHONE" },
        { name: "Action", text: "ACTION" },
      ],
      //
      showEntries: [5, 10, 15, 25, 50, 70, 100],
      currentEntries: 10,
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
        console.log(resp.data);
      }
    },
  },
  async fetch() {
    let result = await this.$axios.get("/getUsers");
    this.users = result.data;
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
</style>
