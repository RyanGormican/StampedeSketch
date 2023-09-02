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
      StampedeSketch
    </div>
    <Timer :duration="10"></Timer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '@iconify/vue';
  import Timer from '@/components/Timer.vue';
  import Board from '@/components/Board.vue';
  export default defineComponent({
  name: 'Main',
  components: {
  Icon,
  Timer,
  },
  });
</script>

<style scoped>
  @import '@/assets/styles.css';

</style>
