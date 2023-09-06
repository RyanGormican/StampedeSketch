<template>
<div>
  <div>
    <ul>
      <li v-for="(user, index) in users" :key="index">{{ user }}</li>
    </ul>
  </div>
  <div>
        <p>Current Round: {{ currentRound }}</p>
        <p>Current Mode: {{ currentMode }}</p>
        <p>Time Left: {{ roundTimeLeft }} seconds</p>
      </div>
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
      currentRound: null,
      currentMode: null,
      roundTimeLeft: null,
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
        }).then(() => {
          this.checkRound(); 
        });
      }, 1000);
    },
    checkRound() {
      fetch(`http://localhost:4000/check-game-state/${this.port}`)
        .then((response) => response.json())
        .then((data) => {
           this.currentRound = data.round;
            this.currentMode = data.mode;
            this.roundTimeLeft = data.time;
         
          } else {
        
          }
        })
        .catch((error) => {
          console.error('Error checking round:', error);
        });
    },
  },
};
</script>

<style scoped>
  @import '@/assets/styles.css';
</style>
