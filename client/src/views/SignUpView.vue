<template>
  <div class="signUp">
    <p>회원가입</p>
    <input @keydown.enter.prevent type="text" v-model="userName" placeholder="이름"><br>
    <input @keydown.enter.prevent type="text" v-model="email" placeholder="email"><br>
    <input v-on:keyup.enter="signUp" type="password" v-model="password" placeholder="password"><br>
    <b-button size="sm" variant="outline-primary" @click="signUp">가입하기</b-button>
    <span>또는 <router-link to="/">로그인</router-link>으로 돌아가기</span>
  </div>
</template>

<script>
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: '',
      userName: '',
      cryptoPassword: ''
    }
  },
  created () {
    this.$store.commit('routePath', this.$router.currentRoute._value.fullPath)
  },
  methods: {
    async cryptoPW () {
      await this.$api('/api/cryptopw', { param: this.password })
        .then((res) => {
          this.cryptoPassword = res
        })
    },
    async insertOnDB () {
      await this.$api('/api/insertUserData', { param: [this.email, this.cryptoPassword, this.userName] })
        .then(res => {
          alert('회원가입 완료')
        })
      this.$router.push({ path: '/' })
    },
    async signUp () {
      await this.cryptoPW()
      await this.$api('/api/selectAllUserData', { param: this.email })
        .then((res) => {
          if (res.length === 0) {
            if (!this.$checkEmail(this.email)) {
              alert('유효한 이메일 형식이 아닙니다')
            } else {
              if (this.password.length < 6) {
                alert('비밀번호는 6자리 이상 필요합니다')
              } else {
                this.insertOnDB()
              }
            }
          } else {
            alert('이미 사용중인 이메일입니다.')
          }
        })
      // firebase 회원가입
      // const auth = getAuth()
      // createUserWithEmailAndPassword(auth, this.email, this.password)
      //   .then((userCredential) => {
      //     // Signed in
      //     this.user = userCredential.user
      //     this.$api('/api/insertUserData', { param: [this.email, this.password, this.userName] })
      //       .then(res => {
      //         alert('회원가입 완료')
      //       })
      //     this.$router.push({ path: '/' })
      //     // ...
      //   })
      //   .catch((error) => {
      //     console.log(error.code)
      //     switch (error.code) {
      //       case 'auth/email-already-in-use':
      //         alert('이미 사용중인 이메일 입니다.')
      //         break
      //       case 'auth/invalid-email':
      //         alert('유효하지 않은 메일입니다')
      //         break
      //       case 'auth/operation-not-allowed':
      //         alert('이메일 가입이 중지되었습니다.')
      //         break
      //       case 'auth/weak-password':
      //         alert('비밀번호는 6자리 이상 필요합니다')
      //         break
      //     }
      //   }
      //   )
    }
  }
}
</script>

<style scoped>
  .signUp {
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
    font-size: 20px;
  }
  span {
    display: block;
    margin-top: 30px;
    font-size: 15px;
  }
</style>
