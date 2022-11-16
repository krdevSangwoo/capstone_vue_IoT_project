<template>
  <div class="col-12">
    <div class="card py-3">
      <div class="container">
        <div class="row">
          <div class="col" style='font-size: 12px;'>
            <span class="float-start mb-3">기상 정보 (갱신 주기: 5분)</span>
            <span class="float-end mb-3">날씨 : {{ outerWeather.weatherStatus }}</span>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-12" style='margin: auto'>
                    <table class="table table-hover mb-0" style='font-size: 10px;'>
                      <thead>
                        <tr>
                          <th scope="col">장소</th>
                          <th scope="col">온도</th>
                          <th scope="col">습도</th>
                          <th scope="col">미세먼지</th>
                          <th scope="col">초미세먼지</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">실내</th>
                          <td>{{ innerWeather.temp }}℃</td>
                          <td>{{ innerWeather.humid }}%</td>
                          <td>{{ outerWeather.pm10 }}㎍</td>
                          <td>{{ outerWeather.pm25 }}㎍</td>
                        </tr>
                        <tr>
                          <th scope="row">실외</th>
                          <td>{{ outerWeather.temp }}℃</td>
                          <td>{{ outerWeather.humid }}%</td>
                          <td>{{ outerWeather.pm10 }}㎍</td>
                          <td>{{ outerWeather.pm25 }}㎍</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      isNotNull: false,
      hourTmp: 0,
      innerWeather: {
        temp: 0,
        humid: 0,
        pm10: 0,
        pm25: 0
      },
      outerWeather: {
        temp: 0,
        humid: 0,
        pm10: 0,
        pm25: 0,
        weatherStatus: ''
      },
      dateTime: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: ''
      },
      weatherInterval: null
    }
  },
  props: {
    timeStamp: String
  },
  computed: {
    email () {
      return this.$store.getters.getUser.email
    }
  },
  created () {
    this.getNow()
    this.getDustData()
    this.getWeatherData()
    this.getDhtSensorData()
    this.hourTmp = this.dateTime.hour
    console.log(this.hourTmp)
  },
  mounted () {
    // 한시간마다(hour이 바뀔때마다) DB에 온습도 데이터 insert
    this.weatherInterval = setInterval(() => {
      this.getNow()
      this.getWeatherData()
      this.getDustData()
      this.getDhtSensorData()
      console.log(this.isNotNull)
      console.log(this.hourTmp)
      console.log(this.dateTime.hour)
      console.log(this.hourTmp !== this.dateTime.hour)
      if (this.isNotNull && (this.hourTmp !== this.dateTime.hour)) {
        this.hourTmp = this.dateTime.hour
        this.$api('/api/insertRoomData', {
          param: [
            this.email,
            this.dateTime.year,
            this.dateTime.month,
            this.dateTime.day,
            this.dateTime.hour,
            this.dateTime.minute,
            this.innerWeather.temp,
            this.innerWeather.humid
          ]
        })
      }
    }, 300000)
  },
  watch: {
  },
  methods: {
    getNow () {
      this.dateTime.year = this.timeStamp.slice(0, 4)
      this.dateTime.month = this.timeStamp.slice(5, 7)
      this.dateTime.day = this.timeStamp.slice(8, 10)
      this.dateTime.hour = this.timeStamp.slice(11, 13)
      this.dateTime.minute = this.timeStamp.slice(14, 16)
      console.log(this.dateTime)
    },
    getDhtSensorData () {
      console.log('센서 데이터 읽기 메소드 실행 됨')
      axios.get('http://192.168.137.170:3050/getDht')
        .then((res) => {
          this.innerWeather.temp = res.data.temperature
          this.innerWeather.humid = res.data.humidity
          this.isNotNull = true
        }).catch((err) => {
          this.innerWeather.temp = 0
          this.innerWeather.humid = 0
          console.log(err)
          this.isNotNull = false
        })
    },
    getWeatherData () {
      axios.get('https://api.openweathermap.org/data/2.5/weather?lat=37.568&lon=126.978&appid=cbe5bdc9b8d6bb30982a8e86f3473069&units=metric')
        .then((res) => {
          this.outerWeather.temp = parseInt(res.data.main.temp)
          this.outerWeather.humid = parseInt(res.data.main.humidity)
          this.outerWeather.weatherStatus = res.data.weather[0].description
          switch (res.data.weather[0].description) {
            case 'clear sky':
              this.outerWeather.weatherStatus = '맑음'
              break
            case 'few clouds':
              this.outerWeather.weatherStatus = '약간 흐림'
              break
            case 'overcast clouds':
              this.outerWeather.weatherStatus = '흐림'
              break
            case 'broken clouds':
              this.outerWeather.weatherStatus = '옅은 구름'
              break
            case 'scatter clouds':
              this.outerWeather.weatherStatus = '구름 많음'
              break
            case 'fog':
              this.outerWeather.weatherStatus = '안개'
              break
            case 'mist':
              this.outerWeather.weatherStatus = '옅은 안개'
              break
            case 'light rain':
              this.outerWeather.weatherStatus = '약한 비'
              break
            case 'rain':
              this.outerWeather.weatherStatus = '비'
              break
            case 'moderate rain':
              this.outerWeather.weatherStatus = '비'
              break
          }
        })
    },
    getDustData () {
      axios.get('http://api.openweathermap.org/data/2.5/air_pollution?lat=37.568&lon=126.978&appid=cbe5bdc9b8d6bb30982a8e86f3473069')
        .then((res) => {
          this.outerWeather.pm10 = parseInt(res.data.list[0].components.pm10)
          this.outerWeather.pm25 = parseInt(res.data.list[0].components.pm2_5)
        })
    }
  },
  unmounted () {
    clearInterval(this.weatherInterval)
  }
}
</script>
