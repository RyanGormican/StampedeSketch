<template>
  <div>
   {{remainingTime}}
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
  date() {
  return {
  remainingTime: this.duration,
  timeInterval: null,
  };
  },
  props: {
  duration: {
    type:Number,
    required: true,
  },
  methods : {
  startTimer(){
  this.timeInterval = setInterval(() => {
  if (this.remainingTime > 0) {
    this.remainingTime--;
  }
  },1000);
  }
  },
  mounted() {
  this.startTimer();
  },
  }});
</script>

<style scoped>
  @import '@/assets/styles.css';

</style>
