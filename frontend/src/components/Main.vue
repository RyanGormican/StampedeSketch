<template>
  <div>
    <div className="links">
      <a href="https://www.linkedin.com/in/ryangormican/">
        <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
      </a>
      <a href="https://github.com/RyanGormican/StampedeSketch">
        <Icon icon="mdi:github" color="#e8eaea" width="60" />
      </a>
      <a href="https://ryangormicanportfoliohub.vercel.app/">
        <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
      </a>
    </div>
    <div class="title">
      <h1> StampedeSketch</h1>
    </div>
    <div class="buttons">
      <button type="button" class="btn btn-primary" @click="generatePort">Create </button>
      <input v-model="joinCode" type="number" placeholder="Join Code" />
      <button type="button" class="btn btn-primary" @click="joinPort">Join</button>
    </div>
    <Timer :duration="15"></Timer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '@iconify/vue';
  import Timer from '@/components/Timer.vue';
  import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import Board from '@/components/Board.vue';
  export default defineComponent({
  name: 'Main',
  components: {
  Icon,
  Timer,
  },
  data() {
  return {
  joinCode: '', // Bind this input field to joinCode
  };
  },
  methods: {
  generatePort() {
  const userToken = Math.random().toString(36).substring(2, 12);
  fetch('http://localhost:4000/generate-port', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify({userToken, joinCode: this.joinCode}),
  })
  .then((response) => response.json())
  .then((data) => {

  const { code, port } = data;
  this.$router.push(`/waitingroom/${port}/${userToken}`);
  })
  .catch((error) => {
  console.error('Error generating port:', error);
  });
  },
  joinPort() {
  const userToken = Math.random().toString(36).substring(2, 12);
  fetch('http://localhost:4000/join-port', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userToken, joinCode: this.joinCode }),
  })
  .then((response) => response.json())
  .then((data) => {
  const { port } = data;

  this.$router.push(`/waitingroom/${port}/${userToken}`);
  })
  .catch((error) => {
  console.error('Error joining port:', error);
  });
  },
  },
  });
</script>

<style scoped="">
  @import '@/assets/styles.css';

</style>
