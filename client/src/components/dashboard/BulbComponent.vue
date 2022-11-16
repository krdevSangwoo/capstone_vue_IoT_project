<template>
  <div class="col-md-6 py-2">
    <div class="card py-3">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <span class="float-start fs-6">조명(Philipse Hue)</span>
          </div>
        </div>
        <div class="row g-3">
          <p v-if="!bulbs.length">연결이 불가능합니다!</p>
          <div :key="i" v-for="(bulb, i) in bulbs" class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-5 text-start" @click="popUp(i)" style='margin: auto; cursor: pointer;'>
                    {{ bulb.name }}
                  </div>
                  <div class="col-3" style='margin: auto'>
                    <img v-if="bulb.state.on" src="../../assets/bulb_on.png" style="width: 75%">
                    <img v-else src="../../assets/bulb_off.png" style="width: 75%">
                  </div>
                  <div class="col-4">
                    <div class="row mb-1">
                      <div class="col">
                        <b-button size="sm" variant="outline-success"
                          @click="light_onoff(i, true)" class="float-end">
                          켜기
                        </b-button>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <b-button size="sm" variant="outline-secondary"
                        @click="light_onoff(i, false)" class="float-end">
                          끄기
                        </b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="popUpStatus[i]" style="font-size: 8px;" @click="selectTimer(i)">
              <hr>
              <div class='row mb-2'>
                <div class='col-8 text-start'>
                  <span class="mb-2">조명 부가 기능({{ bulb.name }})</span>
                </div>
                <div class='col-4 text-end'>
                  <span v-if="timerStatus[i]" class="mb-2">알람: ON, {{ storedTime[i] }}</span>
                  <span v-else class="mb-2">알람: OFF</span>
                </div>
              </div>
              <div class='row mb-2'>
                <v-date-picker style='margin: auto' mode="time" v-model="date[i]"/>
              </div>
              <div>
                <b-form-radio-group
                  v-model="bulbSelected[i]"
                  :options="options">
                </b-form-radio-group>
              </div>
              <div class="form-check form-switch text-start" style='padding-left: 43%;'>
                <b-form-checkbox v-model="autoBulb[i]" switch @click='autoBulbToggle(i)'>
                  자동 조명
                </b-form-checkbox>
              </div>
              <b-button size="sm" variant="outline-danger" class="me-2"
                @click="clearTimer(i)">
                초기화
              </b-button>
              <b-button size="sm" variant="outline-primary" @click="setTimer(i)">
                저장
              </b-button>
              <b-card class='mt-2'>
                <label for="range-1">조명 밝기 : {{rangeValue[i] * 5}}%</label>
                <b-form-input id="range-1" v-model="rangeValue[i]" type="range" min="0" max="20"></b-form-input>
                <b-button size="sm" variant="outline-secondary" @click='colorBtn(i)'>
                  색상선택
                </b-button>
                <Chrome class='mt-2' v-if='colorPickerStatus[i]' v-model='colors[i]' style='margin: auto'/>
              </b-card>
              <div class="flex items-baseline mt-2">
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
import { Chrome } from '@ckpack/vue-color'

export default {
  data () {
    return {
      date: [],
      selectedTime: [],
      storedTime: [],
      timerStatus: [],
      timeInterval: null,
      bulbs: [],
      bulbsOnDB: [],
      popUpStatus: [],
      timerNumber: 0,
      hueApiKey: null,
      bulbSelected: [],
      savedSelected: [],
      options: [
        { text: '조명 켜기', value: true },
        { text: '조명 끄기', value: false }
      ],
      colors: [],
      selectedColorHsv: [],
      colorPickerStatus: [],
      rangeValue: [],
      autoBulb: [],
      catchOnWatch: {
        rangeValue: false,
        autoBulb: false,
        colors: false
      }
    }
  },
  components: {
    Chrome
  },
  props: { // 부모 컴포넌트에서 보내주는 props도 뷰의 반응성 영향으로 갱신된 데이터를 받음
    time: String
  },
  created () {
    this.hueApiKey = this.$store.getters.getUser.hueApiKey
    if (this.hueApiKey !== null) {
      this.$api('/api/selectBulbData', { param: this.$store.state.user.email })
        .then((res) => {
          for (const bulb in res) {
            this.bulbsOnDB.push(res[bulb])
            if (res[bulb].autoBulb === '1') {
              this.autoBulb.push(true)
            } else { this.autoBulb.push(false) }
            this.selectedColorHsv.push({
              h: res[bulb].hue,
              s: res[bulb].sat,
              v: res[bulb].bri
            })
            this.colors.push({
              h: ((res[bulb].hue / 65535) * 360),
              s: (res[bulb].sat / 254),
              v: (res[bulb].bri / 254)
            })
            if ((res[bulb].bri / 254) * 20 > parseInt((res[bulb].bri / 254) * 20)) {
              this.rangeValue.push(parseInt((res[bulb].bri / 254) * 20) + 1)
            } else {
              this.rangeValue.push(parseInt((res[bulb].bri / 254) * 20))
            }
          }
          this.enterUltrasonicSensor(1)
        })
      axios.get(this.hueApiKey)
        .then((response) => {
          // 활성 상태인 조명만 받아오기
          const time = new Date()
          console.log(response)
          for (const bulb in response.data) {
            // API로 연동 된 조명 상태 동기화
            this.bulbs.push(response.data[bulb])
            // 알람 시계 초기화
            this.date.push(new Date())
            // 부가 기능 팝업창과 알람 저장 여부 초기화
            this.timerStatus.push(false)
            this.popUpStatus.push(false)
            // 알람이 조명을 끄는지 켜는지에 대한 선택값과 저장값 초기화
            this.bulbSelected.push(false)
            this.savedSelected.push(false)
            // 알람의 선택된 시간과 저장된 시간 초기화
            this.selectedTime.push(time.toTimeString().slice(0, 8))
            this.storedTime.push(time.toTimeString().slice(0, 8))
            // 색상 선택 데이터 초기화
            this.colorPickerStatus.push(false)
          }
        }).then((res) => {
          this.$api('/api/selectBulbData', { param: this.$store.state.user.email })
            .then((res) => {
              if (Object.keys(res)[0] === 'error') {
                for (const bulb in this.bulbs) {
                  const idKey = this.$store.state.user.email + bulb
                  this.$api('/api/insertBulbData', {
                    param: [
                      idKey,
                      this.$store.state.user.email,
                      this.autoBulb[bulb],
                      this.bulbs[bulb].state.on,
                      this.bulbs[bulb].state.hue,
                      this.bulbs[bulb].state.sat,
                      this.bulbs[bulb].state.bri,
                      this.bulbs[bulb].state.reachable
                    ]
                  }).then((res) => {
                    console.log('데이터 삽입 성공했음')
                  })
                }
              } else {
                for (const bulb in this.bulbs) {
                  this.updateBulbDB(bulb)
                }
              }
            }).catch((err) => {
              console.log(err)
            })
        }).catch((e) => {
          console.log('조명과 연결이 불가능한 상태입니다')
        })
      this.timeInterval = setInterval(() => {
        for (let i = 0; i < this.bulbs.length; i++) {
          if (this.time === this.selectedTime[i] && this.timerStatus[i]) {
            console.log(i + 1)
            axios.put(this.hueApiKey + `${i + 1}/state`,
              { on: this.savedSelected[i], hue: this.selectedColorHsv[i].h, sat: this.selectedColorHsv[i].s, bri: this.selectedColorHsv[i].b })
              .then((response) => {
                console.log(response)
                this.bulbs[i].state.on = this.savedSelected[i]
                this.bulbs[i].state.hue = this.selectedColorHsv[i].h
                this.bulbs[i].state.sat = this.selectedColorHsv[i].s
                this.bulbs[i].state.bri = this.selectedColorHsv[i].v
              }).then((res) => {
                this.updateBulbDB(i)
              }).catch((err) => {
                alert(err)
              })
            console.log('타이머 알람!')
          }
        }
      }, 1000)
    }
  },
  watch: {
    date: {
      handler () {
        this.selectedTime[this.timerNumber] = this.date[this.timerNumber].toTimeString().slice(0, 8)
        console.log(this.selectedTime[this.timerNumber] + ' 타이머 선택')
      },
      deep: true
    },
    rangeValue: {
      handler () {
        if (this.catchOnWatch.rangeValue) { // 불필요한 초기 업데이트 제거용
          let tmp = parseInt((this.rangeValue[this.timerNumber] / 20) * 254)
          if (tmp > 254) tmp = 254
          this.selectedColorHsv[this.timerNumber].v = tmp
          this.light_onoff(this.timerNumber, this.bulbs[this.timerNumber].state.on, this.selectedColorHsv[this.timerNumber].h, this.selectedColorHsv[this.timerNumber].s, tmp)
        }
        this.catchOnWatch.rangeValue = true
      },
      deep: true
    },
    colors: {
      handler () {
        if (this.catchOnWatch.colors) { // 불필요한 초기 업데이트 제거용
          let tmp = this.colors[this.timerNumber].hsv
          if (this.colors[this.timerNumber].hsv === undefined) {
            tmp = this.colors[this.timerNumber]
          }
          this.selectedColorHsv[this.timerNumber].h = parseInt((tmp.h / 360) * 65535)
          if (this.selectedColorHsv[this.timerNumber].h > 65535) this.selectedColorHsv[this.timerNumber].h = 65535
          this.selectedColorHsv[this.timerNumber].s = parseInt(tmp.s * 254)
          if (this.selectedColorHsv[this.timerNumber].s > 254) this.selectedColorHsv[this.timerNumber].s = 254
          this.selectedColorHsv[this.timerNumber].v = parseInt(tmp.v * 254)
          if (this.selectedColorHsv[this.timerNumber].v > 254) this.selectedColorHsv[this.timerNumber].v = 254
          this.rangeValue[this.timerNumber] = parseInt(tmp.v * 20)
          this.light_onoff(this.timerNumber, this.bulbs[this.timerNumber].state.on)
        }
        this.catchOnWatch.colors = true
      },
      deep: true
    },
    autoBulb: {
      handler () {
        if (this.catchOnWatch.autoBulb) { // 불필요한 초기 업데이트 제거용
          this.updateBulbDB(this.timerNumber)
          this.enterUltrasonicSensor(this.timerNumber)
        }
        this.catchOnWatch.autoBulb = true
      },
      deep: true
    }
  },
  methods: {
    enterUltrasonicSensor (bulb) {
      axios.post('http://192.168.137.170:3050/getAutoBulb', {
        params: {
          bulbNumber: bulb,
          autoBulb: this.autoBulb[bulb],
          email: this.$store.state.user.email,
          hueApiKey: this.$store.state.user.hueApiKey
        }
      }
      ).then((res) => {
      })
    },
    // 실제 hue api 전구 데이터는 1, 2, 3의 key값을 가지는 JSON 객체
    updateBulbDB (bulb) { // bulb는 전구 저장 배열 번호(0, 1, 2)
      const idKey = this.$store.state.user.email + bulb
      this.$api('/api/updateBulbData', {
        param: [
          this.autoBulb[bulb],
          this.bulbs[bulb].state.on,
          this.bulbs[bulb].state.hue,
          this.bulbs[bulb].state.sat,
          this.bulbs[bulb].state.bri,
          this.bulbs[bulb].state.reachable,
          idKey
        ]
      }).then((res) => {
        console.log('업데이트 성공')
      })
    },
    autoBulbToggle (timerNumber) {
      this.timerNumber = timerNumber
    },
    colorBtn (timerNumber) {
      this.colorPickerStatus[timerNumber] = !this.colorPickerStatus[timerNumber]
    },
    popUp (timerNumber) {
      this.timerNumber = timerNumber
      this.popUpStatus[timerNumber] = !this.popUpStatus[timerNumber]
      if (!this.bulbs[timerNumber].state.reachable) { // 작동 불가 조명 기능 차단
        this.popUpStatus[timerNumber] = false
      }
    },
    selectTimer (timerNumber) {
      this.timerNumber = timerNumber
    },
    setTimer (NumberOfBulb) {
      if (this.selectedTime[NumberOfBulb]) {
        // if (this.timerStatus[NumberOfBulb]) {
        //   alert('이미 타이머가 설정되어 있습니다. 타이머를 초기화하고 다시 저장하세요.')
        // } else {
        this.savedSelected[NumberOfBulb] = this.bulbSelected[NumberOfBulb]
        this.timerStatus[NumberOfBulb] = true
        this.storedTime[NumberOfBulb] = this.selectedTime[NumberOfBulb]
        console.log(this.storedTime[NumberOfBulb] + ' 타이머 설정 완료')
        // }
      }
    },
    clearTimer (NumberOfBulb) {
      this.timerStatus[NumberOfBulb] = false
      console.log('타이머가 해제되었습니다.')
    },
    // maximum -> hue 65535, sat and bri 254, bri is lightness
    light_onoff (lightNum, status, h = this.selectedColorHsv[lightNum].h, s = this.selectedColorHsv[lightNum].s, b = this.selectedColorHsv[lightNum].v) {
      if (this.bulbs[lightNum].state.reachable) { // 작동 불가 조명 기능 차단
        axios.put(this.hueApiKey + `${lightNum + 1}/state`,
          { on: status, hue: h, sat: s, bri: b })
          .then((response) => {
            this.bulbs[lightNum].state.on = status
            this.bulbs[lightNum].state.hue = h
            this.bulbs[lightNum].state.sat = s
            this.bulbs[lightNum].state.bri = b
          }).then((res) => {
            this.updateBulbDB(lightNum)
          }).catch((err) => {
            console.log(err)
            alert(err)
          })
      }
    }
  },
  unmounted () {
    clearInterval(this.timeInterval)
  }
}
</script>
