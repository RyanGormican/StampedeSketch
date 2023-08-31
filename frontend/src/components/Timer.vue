<template>
  <div>
    {{ remainingTime }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'Timer',
  components: {
    Icon,
  },
  props: {
    duration: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      remainingTime: this.duration,
      timerInterval: null,
    };
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    this.stopTimer();
  },
});
</script>

<style scoped>
@import '@/assets/styles.css';
</style>
