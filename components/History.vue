<template>
  <div class="h-full">
    <Loader-Spinner v-if="this.showSpinner"></Loader-Spinner>
    <div class="m-2 p-5 bg-white flex flex-col gap-2" v-if="!this.showSpinner">
      <!-- TOP PAGINATION -->
      <div class="flex justify-between gap-2 items-center py-2 w-1/2">
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
        <!-- search box -->
        <div>
          <input
            type="search"
            placeholder="Search"
            class="border rounded-xl p-1 px-3 outline-none"
            v-model="searchInput"
            @input="searchEvent"
          />
        </div>
      </div>
      <table class="w-full border">
        <thead>
          <tr>
            <th v-for="(head, id) in this.headers" :key="id" class="border p-2">
              <div class="flex w-full justify-between items-center">
                <span>{{ head.text }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, id) in this.filterEntries"
            :key="id"
            class="cursor-default"
          >
            <td class="border p-2">
              {{
                new Date(user.timestamp * 1000).toLocaleString().slice(0, -3)
              }}
            </td>
            <td class="border p-2">{{ user.event }}</td>
            <td class="border p-2">
              {{ user.message ? user.message.headers.from : "" }}
              <!-- {{ user.createAt ? user.createAt.slice(0, -3) : "" }} -->
            </td>
            <td class="border p-2">
              {{ user.message ? user.message.headers.to : "" }}
            </td>
            <td class="border p-2">
              {{ user.event == "delivered" ? "Ok" : "" }}
            </td>
            <td
              class="border p-2 flex flex-wrap gap-2 justify-center"
              v-if="user.event != 'delivered'"
            >
              <!-- reSend btn -->
              <button
                @click="resendEmail(user)"
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
              <span>Resend</span>
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
              :class="[
                { active: page == currentPage },
                { hidde: page == '...' },
              ]"
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
  </div>
</template>
<script>
import { $array } from "alga-js";
export default {
  data() {
    return {
      users: [],
      headers: [
        { name: "timestamp", text: "Timestamp" },
        { name: "event", text: "Event" },
        { name: "sender", text: "Sender" },
        { name: "recipient", text: "Recipient" },
        { name: "Delevery Status", text: "Delevery Status" },
        { name: "Action", text: "Action" },
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
      //SPINNER
      showSpinner: true,
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

    //  When click on the resend btn to resend a default email
    async resendEmail(mailObject) {
      if (confirm("Resend email to the user")) {
        let resp = await this.$axios.post("/resendMail", mailObject);
        if (resp.status == 200 && !resp.data.error) {
          this.$store.dispatch("addNotification", {
            type: "success",
            message: "Email resend successfully",
          });
        } else {
          this.$store.dispatch("addNotification", {
            type: "error",
            message: "Fails Email not resend",
          });
        }
      }
    },
  },
  async fetch() {
    let result = await this.$axios.get("/history");
    this.filterEntries = result.data.items.reverse();
    this.users = result.data.items;
    this.allPages = $array.pages(this.users, this.currentEntries);
    this.showSpinner = false;
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
