<template>
  <div class="absolute bottom-5 right-1/3 flex flex-col gap-2">
    <Notifications-notificationMessage
      v-for="notif in allNotifications"
      :key="notif.id"
      :notification="notif"
    ></Notifications-notificationMessage>
  </div>
</template>
<script>
export default {
  computed: {
    allNotifications() {
      return this.$store.state.notifications;
    },
  },
};
</script>
