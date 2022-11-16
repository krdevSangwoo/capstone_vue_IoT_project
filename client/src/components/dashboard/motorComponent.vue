<template>
  <div class="col-md-6 pt-2">
    <div class="card py-3">
      <div class="container">
        <div class="row mb-3">
          <div class="col" style='font-size: 12px;'>
            <span class="float-start mb-3">Servo 모터</span>
          </div>
        </div>
        <div class="row g-3">
          <div class='col-4'></div>
          <div class='col-2' style='margin: auto;'>
            <b-button size="sm" variant="outline-success" @click='motorOn()'>
              켜기
            </b-button>
          </div>
          <div class='col-2' style='margin: auto;'>
            <b-button size="sm" variant="outline-danger" @click='motorOn()'>
              끄기
            </b-button>
          </div>
          <div class='col-4'></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
    }
  },
  methods: {
    motorOn () {
      axios.post('http://192.168.137.170:3050/motorOn', {})
    }
  }
}
</script>
