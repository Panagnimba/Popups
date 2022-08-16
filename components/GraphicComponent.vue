<template>
  <div class="h-full">
    <canvas id="myChart" class="w-full h-full"></canvas>
  </div>
</template>
<script>
export default {
  head() {
    return {
      script: [
        {
          hid: "chartjs",
          src: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js",
          defer: true,
          // Changed after script load
          callback: () => {
            this.isChartLoaded = true;
          },
        },
      ],
    };
  },
  data() {
    return {
      isChartLoaded: false,
      isFetchEnd: false,
      usersGraphicData: [],
      emailsGraphicData: [],
    };
  },
  async fetch() {
    //
    let usersResult = await this.$axios.get("/getUsers");
    let mailsResult = await this.$axios.get("/history");
    let users = usersResult.data.reverse();
    let mails = mailsResult.data.items.reverse();

    // //
    this.usersGraphicData = this.getMonthGraphicData(users);
    this.emailsGraphicData = this.getMonthGraphicData(mails);
    //
    this.isFetchEnd = true;
  },
  methods: {
    getMonthGraphicData(users) {
      let tab = [];
      for (let nbMonth = 1; nbMonth <= 12; nbMonth++) {
        let count = 0;
        let createAt = "";
        users.forEach((el1) => {
          if (el1.createAt) {
            createAt = el1.createAt;
          } else {
            createAt = new Date(el1.timestamp * 1000)
              .toLocaleString()
              .slice(0, -3);
          }
          //
          let [dateValues, timeValues] = createAt.split(" ");
          let [day, month, year] = dateValues.split("/");
          if (month == nbMonth) count++;
        });
        tab[nbMonth - 1] = count;
      }
      // console.log(tab);
      return tab; // array containing the number of user per month
    },
    drawChart() {
      var xValues = [
        "janv",
        "feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            {
              label: "Users",
              data: this.usersGraphicData,
              borderColor: "blue",
              fill: true,
            },
            {
              label: "Email",
              data: this.emailsGraphicData,
              borderColor: "red",
              fill: true,
            },
          ],
        },
        options: {
          legend: { display: true },
        },
      });
    },
  },
  watch: {
    isChartLoaded(newValue) {
      if (newValue) {
        this.drawChart();
      }
    },
    isFetchEnd(newValue) {
      if (newValue) {
        this.drawChart();
      }
    },
  },
};
</script>
