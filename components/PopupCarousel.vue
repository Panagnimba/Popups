<template>
  <div class="h-full pb-5">
    <div class="h-full">
      <div class="swiper mySwiper h-full">
        <div class="swiper-wrapper h-full">
          <div
            class="swiper-slide h-full relative"
            v-for="popup in this.popupsList"
            :key="popup._id"
          >
            <button
              :id="popup._id"
              class="btn z-10 absolute right-0 p-1 px-2 rounded-bl-2xl text-md text-white font-semibold bg-primary"
              :class="{
                selected: $store.state.currentPopup._id == popup._id,
              }"
            >
              {{
                $store.state.currentPopup._id == popup._id ? "Manage" : "Select"
              }}
            </button>
            <component :is="popup.componentName" :configProps="popup" />
          </div>
        </div>
        <div class="swiper-button-next text-primary"></div>
        <div class="swiper-button-prev text-primary"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSwiperLoaded: false,
      popupsList: [],
      nbre: 3,
    };
  },
  async fetch() {
    let result = await this.$axios.get("/getPopups");
    this.popupsList = result.data;
  },

  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/swiper/swiper-bundle.min.css",
        },
      ],
      script: [
        {
          hid: "swiper",
          src: "https://unpkg.com/swiper/swiper-bundle.min.js",
          defer: true,
          // Changed after script load
          callback: () => {
            this.isSwiperLoaded = true;
          },
        },
      ],
    };
  },
  mounted() {
    // Handle the number of items(popup) to show
    // depending on the screen size
    if (window.innerWidth < 800) this.nbre = 1;
    else if (window.innerWidth >= 800 && window.innerWidth < 1000)
      this.nbre = 2;
    else if (window.innerWidth > 1200) this.nbre = 3;

    window.addEventListener("resize", (e) => {
      if (e.target.innerWidth < 800) this.nbre = 1;
      else if (e.target.innerWidth >= 800 && e.target.innerWidth < 1000)
        this.nbre = 2;
      else if (e.target.innerWidth > 1200) this.nbre = 3;
      this.createSwiperInstance();
      console.log(e.target.innerWidth);
    });
  },
  watch: {
    isSwiperLoaded(newValue) {
      if (newValue) this.createSwiperInstance();
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", this.selectPopup);
      });
    },
  },
  methods: {
    // methods for create the swiper instance
    createSwiperInstance() {
      new Swiper(".mySwiper", {
        slidesPerView: this.nbre,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: true,
        },
        // loopFillGroupWithBlank: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        on: {
          init() {
            this.el.addEventListener("mouseenter", () => {
              this.autoplay.stop();
            });

            this.el.addEventListener("mouseleave", () => {
              this.autoplay.start();
            });
          },
        },
      });
    },
    selectPopup(e) {
      if (e.target.classList.contains("selected")) {
        // emit event to change the main content
        // when popup already is selected : want to manage
        // if (confirm("Manage this popup"))
        this.$emit("eventFromCarousel");
        //
      } else if (confirm("Êtes vous sûr de vouloir selectionner ce popup ?")) {
        // change style of selected popup
        document.querySelectorAll(".btn").forEach((btn) => {
          btn.classList.remove("selected");
        });
        e.target.classList.add("selected");
        e.target.textContent = "Manage";
        // Update the store the set current popup
        let selectedpopup = this.popupsList.find(
          (popup) => popup._id == e.target.id
        );
        this.$store.dispatch("setCurrentPopup", selectedpopup);
        // notifification
        this.$store.dispatch("addNotification", {
          type: "success",
          message: "Popup selected",
        });
      }
    },
  },
};
</script>
<style scoped>
.selected {
  background-color: red;
}
</style>
