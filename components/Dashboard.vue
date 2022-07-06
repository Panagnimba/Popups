<template>
  <div class="">
    <!-- LEFT SIDE MENU -->
    <div
      :class="`w-${this.rightSize}`"
      class="h-screen bg-primary flex flex-col items-center gap-12 rounded-2xl py-5 text-white fixed left-0 top-0 z-20"
    >
      <div
        class="absolute -right-3.5 top-12 bg-white text-black font-bold rounded-full w-7 h-7 flex justify-center items-center shadow-md cursor-pointer"
        @click="slideRight"
      >
        <i class="fa-solid fa-angle-right" ref="icon"></i>
      </div>
      <h3 class="font-bold">Admin</h3>
      <div class="h-1/2 w-full flex flex-col gap-5 justify-evenly items-start">
        <div
          :class="this.rightItemStyle"
          @click="selectMenu($event)"
          title="home"
        >
          <i class="fa-solid fa-house"></i>
          <span v-if="rightSize == '48'">Home</span>
        </div>
        <div
          :class="this.rightItemStyle"
          @click="selectMenu($event)"
          title="users"
        >
          <i class="fa-solid fa-users"></i>
          <span v-if="rightSize == '48'">Users</span>
        </div>
        <div
          :class="this.rightItemStyle"
          @click="selectMenu($event)"
          ref="popups"
          title="Popups"
        >
          <i class="fa-solid fa-list-check"></i>
          <span v-if="rightSize == '48'">Popups</span>
        </div>
        <div
          :class="this.rightItemStyle"
          @click="selectMenu($event)"
          ref="manage"
          title="Manager"
        >
          <i class="fa-brands fa-hive"></i>
          <span v-if="rightSize == '48'">Manage</span>
        </div>
      </div>
      <div class="h-1/2 w-full flex flex-col justify-end items-start gap-5">
        <div :class="this.rightItemStyle" @click="selectMenu($event)">
          <i class="fa-solid fa-id-card"></i>
          <span v-if="rightSize == '48'">Profile</span>
        </div>
        <div :class="this.rightItemStyle" @click="selectMenu($event)">
          <i class="fa-solid fa-gear"></i>
          <span v-if="rightSize == '48'">Settings</span>
        </div>
      </div>
    </div>
    <!-- RIGHT SIDE WRAPPER -->
    <div
      class="w-full h-full absolute right-0 flex flex-col"
      :class="`pl-${this.rightSize}`"
    >
      <!-- HEADER TOP FOR ADMIN -->
      <div class="w-full flex flex-col flex-wrap bg-white z-10">
        <header class="flex w-ful justify-between items-center gap-5 p-1">
          <div></div>
          <div class="text-xl text-primary">Welcome: {{ this.username }}</div>
          <button
            class="flex gap-2 items-center bg-primary text-white p-1 px-3 rounded w-24"
            @click="logout"
          >
            <i
              class="fa-solid fa-power-off"
              :class="{ 'text-green-400': isloggin, 'text-red-400': !isloggin }"
            ></i>
            <span class="font-semibold">{{ this.loginText }}</span>
          </button>
        </header>
        <div
          class="flex flex-wrap justify-center items-center gap-5 p-3 border"
        >
          <button
            class="flex flex-col items-center text-primary text-xl font-semibold p-1 px-3 rounded shadow"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-users"></i>
              <div class="">{{ this.nbreUser }}</div>
              <span>Users</span>
            </div>
          </button>
          <button
            class="flex flex-col items-center text-primary text-xl font-semibold p-1 px-3 rounded shadow"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-list-check"></i>
              <div class="">{{ this.nbrePopup }}</div>
              <span>Pop-ups</span>
            </div>
          </button>
          <button
            class="flex flex-col items-center text-primary text-xl font-semibold p-1 px-3 rounded shadow"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-users"></i>
              <div class="">87</div>
              <span>Receivers</span>
            </div>
          </button>
          <button
            class="flex flex-col items-center text-primary text-xl font-semibold p-1 px-3 rounded shadow"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-users"></i>
              <div class="">87</div>
              <span>Receivers</span>
            </div>
          </button>
        </div>
      </div>
      <!-- PRINCIPAL CONTENT DISPLAYS HERE -->
      <main class="h-full w-full bg-second overflow-auto">
        <component
          :is="this.mainComponent"
          @eventFromCarousel="manageSelected"
        ></component>
      </main>
    </div>
  </div>
</template>
<script>
import FourPopup from "./FourPopup.vue";
import SecondPopup from "./SecondPopup.vue";
import SimplePopup from "./SimplePopup.vue";
export default {
  components: { SecondPopup, FourPopup, SimplePopup },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
        },
      ],
    };
  },
  async fetch() {
    let resp = await this.$axios.get("/getDashboardInfo");
    this.nbreUser = resp.data.nbreUser;
    this.nbrePopup = resp.data.nbrePopup;
  },
  mounted() {
    this.$refs.popups.click();
  },
  data() {
    return {
      username: this.$store.state.auth.username,
      isloggin: true,
      loginText: "Logout",
      rightSize: "24",
      rightItemStyle:
        "menuItem flex w-full flex-wrap justify-center items-center gap-2 text-xl cursor-pointer p-2 hover:bg-white hover:text-black rounded-l-2xl menuItem",
      mainComponent: "popup-carousel",
      // HEADER INFOS
      nbreUser: 0,
      nbrePopup: 0,
    };
  },
  methods: {
    slideRight() {
      if (this.rightSize == "24") {
        this.rightSize = "48";
        this.$refs.icon.style.transform = "rotate(180deg)";
      } else {
        this.rightSize = "24";
        this.$refs.icon.style.transform = "rotate(0deg)";
      }
    },
    logout() {
      this.isloggin = !this.isloggin;
      if (this.isloggin == true) this.loginText = "Logout";
      else this.loginText = "login";

      //   location.assign("/admin");
      this.$router.push("/login");
    },
    selectMenu(event) {
      var links = document.querySelectorAll(".menuItem");
      // PreventDefault to prevent redirect
      event.preventDefault();
      links.forEach(function (element) {
        element.classList.remove("active");
      });
      //   Apply style and handle menu item click
      if (event.target.classList.contains("menuItem")) {
        event.target.classList.add("active");
        this.displayMainContent(event.target);
      } else {
        event.target.parentNode.classList.add("active");
        this.displayMainContent(event.target.parentNode);
      }
    },
    displayMainContent(activeMenu) {
      if (activeMenu.title.toLowerCase().includes("home"))
        this.$router.push("/");
      if (activeMenu.title.toLowerCase().includes("users"))
        this.mainComponent = "users-table";
      if (activeMenu.title.toLowerCase().includes("popups"))
        this.mainComponent = "popup-carousel";

      if (activeMenu.title.toLowerCase().includes("manager"))
        this.mainComponent = "manage-popup";
    },
    // HANDLE THE EVENT FROM CAROUSEL COMPONENT
    // WHEN A POPUP IS SELECTED FOR MANAGE
    manageSelected() {
      this.mainComponent = "manage-popup";
      var links = document.querySelectorAll(".menuItem");
      links.forEach(function (element) {
        element.classList.remove("active");
      });
      this.$refs.manage.classList.add("active");
    },
  },
};
</script>
<style scoped>
.active {
  background-color: white;
  color: black;
}
</style>
