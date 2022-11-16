<template>
  <div>
    <div class="row">
      <nav class="navbar navbar-expand-sm bg-light ps-3 pe-3">
        <div class="container-fluid">
          <a class="navbar-brand" @click="goToHome" style="cursor: pointer">Vue IoT</a>
          <button class="navbar-toggler" type="button"
          :aria-expanded="navStatus" @click="navClickEvt">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div :class="navClass">
            <ul class="navbar-nav me-auto">
              <li class="nav-item" @click="goToHome">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item" @click="goToHome">
                <a class="nav-link" href="#">DashBoard</a>
              </li>
              <li class="nav-item" @click="goToSetting">
                <a class="nav-link" href="#">Settings</a>
              </li>
            </ul>
            <b-button v-if="userStatus" style="font-size: 10px;" class="ms-1 me-1" size="sm"
          variant="outline-danger" @click="goToLogOut">로그아웃</b-button>
          </div>
        </div>
      </nav>
    </div>
    <div class="container">
      <router-view @click="divToggle"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      navStatus: false,
      navBtnStatus: false,
      navClass: 'collapse navbar-collapse'
    }
  },
  computed: {
    userStatus () {
      return this.$store.getters.getUserStatus
    },
    user () {
      return this.$store.getters.getUser
    },
    routePath () {
      return this.$store.getters.getRoutePath
    }
  },
  // 새 창 열면 세션스토리지 user에 오브젝트 들어가는거 수정하기!
  beforeCreate () { // computed, data 접근 불가
  },
  created () {
    // if (!localStorage.getItem('vuex')) {
    //   this.$store.commit('user', {})
    //   this.$store.commit('userStatus', false)
    //   console.log('로컬이 비었으니 로컬에 초기화 기본값 삽입!!')
    // } else {
    //   console.log('로컬이 있으니 로컬값을 vuex에 넣어줄게!!')
    //   console.log(JSON.parse(localStorage.getItem('vuex')).userStatus)
    //   console.log(this.$store.state.userStatus)
    // }
    // if (!sessionStorage.getItem('user')) {
    //   if (JSON.parse(localStorage.getItem('vuex')).pageNum === 0) {
    //     console.log('세션없고 페이지 수 0이니 스토어 초기화!!')
    //     this.$store.commit('user', {})
    //     this.$store.commit('userStatus', false)
    //   }
    //   sessionStorage.setItem('user', JSON.stringify(JSON.parse(localStorage.getItem('vuex')).user))
    //   sessionStorage.setItem('userStatus', JSON.parse(localStorage.getItem('vuex')).userStatus)
    // }

    // this.$store.commit('pageNum', JSON.parse(localStorage.getItem('vuex')).pageNum + 1)
    // console.log('create : ' + this.pageNum)
    // window.addEventListener('beforeunload', () => {
    //   this.$store.commit('pageNum', JSON.parse(localStorage.getItem('vuex')).pageNum - 1)
    //   console.log('새로고침 or 창닫기 event : ' + this.pageNum)
    // })
  },
  methods: {
    goToHome () {
      if (this.userStatus) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.push({ path: '/' })
      }
    },
    goToSetting () {
      if (this.userStatus) {
        this.$router.push({ path: '/setting' })
      } else {
        alert('로그인부터 하세요!')
        this.$router.push({ path: '/' })
      }
    },
    navClickEvt () {
      if (!this.navBtnStatus) {
        this.navBtnStatus = !this.navBtnStatus
      }
      this.navToggle()
    },
    navToggle () {
      if (this.navStatus) {
        this.navClass = 'collapse navbar-collapse'
        this.navStatus = false
      } else {
        this.navClass = 'collapse show navbar-collapse'
        this.navStatus = true
      }
    },
    divToggle () {
      if (this.navBtnStatus) {
        this.navClass = 'collapse navbar-collapse'
        this.navStatus = false
        this.navBtnStatus = !this.navBtnStatus
      }
    },
    goToLogOut () {
      console.log('로그아웃 되었습니다.')
      this.$store.dispatch('logout')
      this.divToggle()
      axios.post('http://192.168.137.170:3050/logout', { param: [''] }).then((res) => { console.log(res) })
      this.$router.push({ path: '/' })
    }
  },
  mounted () {
    // console.log('vuex user의 자료형 : ' + typeof this.user)
    // console.log(this.user)
    // console.log('vuex userStatus의 자료형 : ' + typeof this.userStatus)
    // console.log(this.userStatus)
    // console.log('local user의 자료형 : ' + JSON.parse(localStorage.getItem('vuex')).user)
    // console.log(JSON.parse(localStorage.getItem('vuex')).user)
    // console.log('local userStatus의 자료형 : ' + JSON.parse(localStorage.getItem('vuex')).userStatus)
    // console.log(JSON.parse(localStorage.getItem('vuex')).userStatus)
    if (this.userStatus) {
      if (this.routePath === '/setting') {
        this.$router.push({ path: '/setting' })
      } else {
        this.$router.push({ path: '/dashboard' })
      }
    } else {
      this.$router.push({ path: '/' })
    }
  },
  unmounted () {
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width: 375px;
  }
</style>
