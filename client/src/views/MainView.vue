<template>
  <div class="container">
    <div class="row pt-4">
      <div class="col">
        <p class="text-start fs-4">
          <span>DashBoard</span>
          <span style="float: right">{{ currentTime }}</span>
        </p>
        <Vue3DComponent></Vue3DComponent>
      </div>
    </div>
    <div class='row'>
      <WeatherComponent :timeStamp="timeStamp"></WeatherComponent>
    </div>
    <div>
      <ChartComponent></ChartComponent>
    </div>
    <div class="row">
      <BulbComponent :time="currentTime"></BulbComponent>
      <MotorComponent></MotorComponent>
    </div>
    <div class="row mt-3">
      <hr>
    </div>
  </div>
</template>

<script>
import Vue3DComponent from '@/components/dashboard/3DComponent.vue'
import WeatherComponent from '@/components/dashboard/weatherComponent.vue'
import BulbComponent from '@/components/dashboard/BulbComponent.vue'
import ChartComponent from '@/components/dashboard/chartComponent.vue'
import MotorComponent from '@/components/dashboard/motorComponent.vue'
import moment from 'moment'

export default {
  // beforeRouteLeave (to, from, next) {
  //   if (this.$store.state.userStatus) next()
  //   else {
  //     alert('로그인부터 하세요!')
  //     next(false)
  //   }
  // },
  data () {
    return {
      timeStamp: '',
      currentTime: '',
      timeInterval: null
    }
  },
  components: {
    Vue3DComponent,
    WeatherComponent,
    BulbComponent,
    ChartComponent,
    MotorComponent
  },
  created () {
    this.$store.commit('routePath', this.$router.currentRoute._value.fullPath)
    this.timeInterval = setInterval(() => {
      const date = new Date()
      // const offset = date.getTimezoneOffset() * 60000
      // const dateOffset = new Date(date.getTime() - offset)
      const momentDate = moment(date).format()
      this.currentTime = date.toTimeString().slice(0, 8)
      this.timeStamp = momentDate.slice(0, 19)
    }, 1000)
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  },
  unmounted () {
    clearInterval(this.timeInterval)
  }
}
</script>
<style>
  .custom-tooltip {
    --bs-tooltip-bg: var(--bs-primary);
    --bs-tooltip-color: white;
    --bs-tooltip-padding-x: 10px;
    --bs-tooltip-padding-y: 10px;
    --bs-tooltip-border-radius: 15px;
    --bs-tooltip-arrow-width: 10px;
    --bs-tooltip-arrow-height: 10px;
  }
</style>
