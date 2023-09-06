<template>
  <div>
    <ul>
      <li v-for="(user, index) in users" :key="index">{{ user }}</li>
    </ul>
  </div>
</template>


<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      port: null,
      currentuser: null,
      users: [],
    };
  },
  created() {
    this.port = this.$route.params.port;
    this.currentuser = this.$route.params.userToken;
    this.fetchUsers();
    this.startFetchingUsers();
    this.startHeartbeat();

   
  },
  methods: {
    fetchUsers() {
      fetch(`http://localhost:4000/get-users/${this.port}`)
        .then((response) => response.json())
        .then((data) => {
          this.users = data.users;
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    },
    startFetchingUsers() {
      setInterval(() => {
        this.fetchUsers();
      }, 1000);
    },
    startHeartbeat() {
      setInterval(() => {
        fetch('http://localhost:4000/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userToken: this.currentuser }),
        });
      }, 1000);
    },
  },
};
</script>

<style scoped>
  @import '@/assets/styles.css';
</style>
