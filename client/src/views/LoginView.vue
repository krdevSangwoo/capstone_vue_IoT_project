<template>
  <div class="login">
    <h3>Login</h3>
    <input @keydown.enter.prevent type="text" v-model="email" placeholder="email"><br>
    <input type="password" v-model="password" placeholder="password" v-on:keyup.enter="login"><br>
    <b-button size="sm" variant="outline-primary" @click="login">로그인</b-button>
    <p>만약 계정이 없다면, <router-link to="/signup" @click="checkedSignUp">회원가입</router-link>을 먼저 진행해주세요!</p>
  </div>
</template>

<script>
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  name: 'LoginView',
  beforeRouteLeave (to, from, next) {
    if (this.$store.state.userStatus) next()
    else {
      if (this.clickedSignUp) {
        this.clickedSignUp = false
        next()
      } else {
        alert('로그인부터 하세요!')
        next(false)
      }
    }
  },
  data () {
    return {
      email: '',
      password: '',
      cryptoPassword: '',
      clickedSignUp: false
    }
  },
  computed: {
    userStatus () {
      return JSON.parse(this.$store.state.userStatus)
    }
  },
  created () {
    this.$store.commit('routePath', this.$router.currentRoute._value.fullPath)
  },
  methods: {
    // firebase 로그인용
    // async login () {
    //   await this.$store.dispatch('login', { email: this.email, password: this.password })
    //   if (this.userStatus) {
    //     await this.$store.dispatch('apiUserData')
    //     this.$router.replace('dashboard')
    //   }
    // },
    checkedSignUp () {
      this.clickedSignUp = true
    },
    // 입력 된 값들 초기화
    inputValueClear () {
      this.email = ''
      this.password = ''
      this.cryptoPassword = ''
    },
    // mariadb 로그인용
    async login () {
      await this.$api('/api/selectAllUserData', { param: this.email })
        .then((res) => {
          if (res.length === 0) {
            this.inputValueClear()
            alert('가입되지 않은 메일이거나 잘못 된 이메일 형식입니다.')
          } else if (res.length === 1) {
            this.cryptoPassword = res[0].password
            this.$api('/api/crypto/compare', {
              params: { pw: this.password, cryptoPW: this.cryptoPassword }
            }).then((response) => {
              if (response) {
                this.$store.commit('user', {
                  email: this.email,
                  password: this.cryptoPassword,
                  userName: res[0].userName,
                  hueApiKey: res[0].hueApiKey
                })
                this.$store.commit('userStatus', true)
                this.inputValueClear()
                alert('로그인 성공')
                this.$router.replace('dashboard')
              } else {
                this.inputValueClear()
                alert('비밀번호가 틀렸습니다.')
              }
            })
          }
        }).catch((err) => {
          this.inputValueClear()
          console.log(err)
          this.$store.commit('userStatus', false)
          this.$store.commit('userReset')
        })
    }
  }
}
</script>
<style scoped>
  .login {
    margin-top: 40px;
    text-align: center;
  }
  input {
    margin: 10px 0;
    width: 50%;
    padding: 15px;
  }
  button {
    margin-top: 20px;
    width: 15%;
    cursor: pointer;
  }
  p {
    margin-top: 40px;
    font-size: 15px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
