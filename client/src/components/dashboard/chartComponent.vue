<template>
  <div class="row">
    <div class="col-md-6 pt-2">
      <div class="card py-3">
        <div class="container">
          <div class="row">
            <div class="col" style='font-size: 12px;'>
              <span class="float-start mb-3">온도 Data Chart</span>
            </div>
          </div>
          <div class="row g-3">
            <div class="col-12">
              <Datepicker class="mb-3" v-model="tempDate"></Datepicker>
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-12" style='margin: auto'>
                      <apexchart type="line" height="270" :options="tempChartOptions" :series="tempSeries"></apexchart>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 pt-2">
      <div class="card py-3">
        <div class="container">
          <div class="row">
            <div class="col" style='font-size: 12px;'>
              <span class="float-start mb-3">습도 Data Chart</span>
            </div>
          </div>
          <div class="row g-3">
            <div class="col-12">
              <Datepicker class="mb-3" v-model="humidDate"></Datepicker>
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-12" style='margin: auto'>
                      <apexchart type="line" height="270" :options="humidChartOptions" :series="humidSeries"></apexchart>
                    </div>
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
export default {
  data () {
    return {
      count: 0,
      tempDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      humidDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      selectedDate: [ // 0: temp chart, 1: humid chart
        { date: '', year: '', month: '', day: '', hour: '' },
        { date: '', year: '', month: '', day: '', hour: '' }
      ],
      tmpSeries: [],
      tempSeries: [{
        name: '시간 평균 온도',
        type: 'column',
        data: [0, 0, 0, 0]
      },
      {
        name: '일 평균 온도',
        type: 'line',
        data: [0, 0, 0, 0]
      }],
      tempChartOptions: {
        chart: {
          height: 300,
          type: 'line'
        },
        stroke: {
          width: [0, 2]
        },
        title: {
          text: '온도 데이터'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        legend: {
          fontSize: '8px',
          formatter: function (seriesName, opts) {
            return [seriesName, '℃']
          }
        },
        labels: ['00~05시', '06~11시', '12~17시', '17~23시'],
        tooltip: {
          style: {
            fontSize: '8px'
          },
          x: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
              return ((value * 6) - 4) + '시'
            }
          },
          y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
              return value + '℃'
            }
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: [{
          title: {
            text: '온도(℃)'
          }
        }]
      },
      humidSeries: [{
        name: '시간 평균 습도',
        type: 'column',
        data: [0, 0, 0, 0]
      },
      {
        name: '일 평균 습도',
        type: 'line',
        data: [0, 0, 0, 0]
      }],
      humidChartOptions: {
        chart: {
          height: 300,
          type: 'line'
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: '습도 데이터'
        },
        legend: {
          fontSize: '8px',
          formatter: function (seriesName, opts) {
            return [seriesName, '%']
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: ['00~05시', '06~11시', '12~17시', '17~23시'],
        tooltip: {
          style: {
            fontSize: '8px'
          },
          x: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
              return ((value * 6) - 4) + '시'
            }
          },
          y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
              return value + '%'
            }
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: [{
          title: {
            text: '습도(%)'
          }
        }]
      }
    }
  },
  props: {
  },
  computed: {
    email () {
      return this.$store.getters.getUser.email
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    tempDate: function (newVal, oldVal) {
      this.insertDate(newVal, 0)
    },
    humidDate: function (newVal, oldVal) {
      this.insertDate(newVal, 1)
    }
  },
  methods: {
    async insertDate (date, index) {
      this.selectedDate[index].date = date.toString()
      this.selectedDate[index].year = this.selectedDate[index].date.slice(11, 15)
      this.selectedDate[index].day = this.selectedDate[index].date.slice(8, 10)
      this.selectedDate[index].hour = this.selectedDate[index].date.slice(16, 18)
      switch (date.toString().slice(4, 7)) {
        case 'Jan':
          this.selectedDate[index].month = '01'
          break
        case 'Feb':
          this.selectedDate[index].month = '02'
          break
        case 'Mar':
          this.selectedDate[index].month = '03'
          break
        case 'Apr':
          this.selectedDate[index].month = '04'
          break
        case 'May':
          this.selectedDate[index].month = '05'
          break
        case 'Jun':
          this.selectedDate[index].month = '06'
          break
        case 'Jul':
          this.selectedDate[index].month = '07'
          break
        case 'Aug':
          this.selectedDate[index].month = '08'
          break
        case 'Sep':
          this.selectedDate[index].month = '09'
          break
        case 'Oct':
          this.selectedDate[index].month = '10'
          break
        case 'Nov':
          this.selectedDate[index].month = '11'
          break
        case 'Dec':
          this.selectedDate[index].month = '12'
          break
      }
      await this.getRoomDataInDayAVG(this.selectedDate[index].year, this.selectedDate[index].month, this.selectedDate[index].day, index)
      await this.getRoomDataInHourAVG(this.selectedDate[index].year, this.selectedDate[index].month, this.selectedDate[index].day, '00', '05', index)
      await this.getRoomDataInHourAVG(this.selectedDate[index].year, this.selectedDate[index].month, this.selectedDate[index].day, '06', '11', index)
      await this.getRoomDataInHourAVG(this.selectedDate[index].year, this.selectedDate[index].month, this.selectedDate[index].day, '12', '17', index)
      await this.getRoomDataInHourAVG(this.selectedDate[index].year, this.selectedDate[index].month, this.selectedDate[index].day, '18', '23', index)
      this.count = 0
    },
    async getRoomDataInHourAVG (year, month, day, start, end, index) {
      await this.$api('/api/selectRoomDataInHourAVG', { param: [this.email, year, month, day, start, end] })
        .then((res) => {
          if (index === 0) {
            if (res.length !== 0) {
              this.tempSeries[0].data[this.count] = res[0].temp.toFixed(1)
            } else this.tempSeries[0].data[this.count] = 0
          } else {
            if (res.length !== 0) {
              this.humidSeries[0].data[this.count] = res[0].humid.toFixed(1)
            } else this.humidSeries[0].data[this.count] = 0
          }
          this.count += 1
        })
    },
    async getRoomDataInDayAVG (year, month, day, index) {
      await this.$api('/api/selectRoomDataInDayAVG', { param: [this.email, year, month, day] })
        .then((res) => {
          console.log(res)
          for (let i = 0; i < 4; i++) {
            if (index === 0) {
              if (res.length !== 0) {
                this.tempSeries[1].data[i] = res[0].temp.toFixed(1)
              } else this.tempSeries[1].data[i] = 0
            } else {
              if (res.length !== 0) {
                this.humidSeries[1].data[i] = res[0].humid.toFixed(1)
              } else this.humidSeries[1].data[i] = 0
            }
          }
        })
    }
  },
  unmounted () {
  }
}
</script>
