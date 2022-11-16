<template>
  <div class="container">
    <div class="row pt-4">
      <div class="col">
        <p class="text-start fs-4">
          User Settings
        </p>
      </div>
    </div>
    <form class="form-floating mb-3">
      <input type="text" class="form-control" id="inputName" v-model='inputUserName'>
      <label class='text-start' for="floatingInputValue">User Name</label>
    </form>
    <form class="form-floating mb-3">
      <input type="email" readonly class="form-control" id="inputEmail" :placeholder='email' :value='email'>
      <label class='text-start' for="floatingInputValue">User Email</label>
    </form>
    <div class="input-group has-validation">
      <div :class="invalidClassNames.divs.inputPassword">
        <input type="password" :class="invalidClassNames.inputs.inputPassword" v-model='inputPassword' id="inputPassword" placeholder="inputPassword" required>
        <label class='text-start' for="inputPassword">Password</label>
      </div>
      <div class="invalid-feedback text-start">
        {{ invalidMsg.inputPassword }}
      </div>
    </div>
    <div class="input-group has-validation mt-3">
      <div :class="invalidClassNames.divs.confirmPassword">
        <input type="password" :class="invalidClassNames.inputs.confirmPassword" v-model='confirmPassword' id="confirmPassword" placeholder="confirmPassword" required>
        <label class='text-start' for="confirmPassword">Confirm Password</label>
      </div>
      <div class="invalid-feedback text-start">
        {{ invalidMsg.confirmPassword }}
      </div>
    </div>
    <form class="form-floating mt-3">
      <input type="text" class="form-control" id="inputApiKey" v-model='inputApiKey'>
      <label class='text-start' for="floatingInputValue">Philipse Hue API Key</label>
    </form>
    <div class="text-start mt-2" style='font-size: 12px;'>
      <a href='https://developers.meethue.com/develop/get-started-2/' target='_blank'>Hue API Key 발급방법은 여기를 눌러주세요</a>
    </div>
    <div>
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-outline-danger btn-sm float-start mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
        회원탈퇴
      </button>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">회원 탈퇴</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              정말로 탈퇴하시겠어요..?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click='clickWithdraw'>탈퇴하기</button>
            </div>
          </div>
        </div>
      </div>
      <b-button size="sm" variant="outline-primary" class='float-end mt-3' @click='clickSubmit'>
        저장하기
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: '',
      userName: '',
      apiKey: '',
      isPasswordSame: false,
      inputPassword: '',
      confirmPassword: '',
      invalidClassNames: {
        divs: {
          inputPassword: 'form-floating is-invalid',
          confirmPassword: 'form-floating is-invalid'
        },
        inputs: {
          inputPassword: 'form-control is-invalid',
          confirmPassword: 'form-control is-invalid'
        }
      },
      invalidMsg: {
        inputPassword: '비밀번호를 6자 이상 입력해주세요.',
        confirmPassword: '비밀번호를 입력해주세요.'
      },
      inputUserName: '',
      inputApiKey: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
    // userAuth () {
    //   return this.$store.getters.getUserAuth
    // }
  },
  watch: {
    inputPassword: function (newVal, oldVal) {
      if (this.inputPassword === '') {
        this.invalidClassNames.divs.inputPassword = 'form-floating is-invalid'
        this.invalidClassNames.inputs.inputPassword = 'form-control is-invalid'
        this.invalidMsg.inputPassword = '비밀번호를 입력해주세요.'
      } else if (this.inputPassword.length < 6) {
        this.invalidClassNames.divs.inputPassword = 'form-floating is-invalid'
        this.invalidClassNames.inputs.inputPassword = 'form-control is-invalid'
        this.invalidMsg.inputPassword = '비밀번호를 6자 이상 입력해주세요.'
      } else {
        this.invalidClassNames.divs.inputPassword = 'form-floating'
        this.invalidClassNames.inputs.inputPassword = 'form-control'
      }
      if (this.inputPassword !== this.confirmPassword) {
        this.invalidClassNames.divs.confirmPassword = 'form-floating is-invalid'
        this.invalidClassNames.inputs.confirmPassword = 'form-control is-invalid'
        this.invalidMsg.confirmPassword = '비밀번호가 일치하지 않습니다.'
      } else {
        this.invalidClassNames.divs.confirmPassword = 'form-floating'
        this.invalidClassNames.inputs.confirmPassword = 'form-control'
      }
    },
    confirmPassword: function (newVal, oldVal) {
      if (this.inputPassword === this.confirmPassword) {
        if (this.confirmPassword === '') {
          this.invalidClassNames.divs.confirmPassword = 'form-floating is-invalid'
          this.invalidClassNames.inputs.confirmPassword = 'form-control is-invalid'
          this.invalidMsg.confirmPassword = '비밀번호를 입력해주세요.'
        } else {
          this.invalidClassNames.divs.confirmPassword = 'form-floating'
          this.invalidClassNames.inputs.confirmPassword = 'form-control'
        }
      } else {
        this.invalidClassNames.divs.confirmPassword = 'form-floating is-invalid'
        this.invalidClassNames.inputs.confirmPassword = 'form-control is-invalid'
        this.invalidMsg.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }
    }
  },
  created () {
    this.$store.commit('routePath', this.$router.currentRoute._value.fullPath)
    this.getUserData()
  },
  methods: {
    getUserData () {
      this.email = this.user.email
      this.password = this.user.password
      this.inputUserName = this.userName = this.user.userName
      this.inputApiKey = this.apiKey = this.user.hueApiKey
    },
    async clickWithdraw () { // 정말로 탈퇴하시겠어요 뭐 그런거 만들기
      await this.$api('/api/deleteUserData', { param: this.email })
      this.$store.commit('userReset')
      alert('떠나신다니 아쉽습니다..')
      this.$router.replace('/')
    },
    async clickSubmit () {
      await this.$api('/api/crypto/compare', {
        params: { pw: this.inputPassword, cryptoPW: this.password }
      }).then((res) => {
        this.isPasswordSame = res
      })
      if (this.checkInputNull(this.isPasswordSame)) {
        await this.$api('/api/cryptopw', { param: this.inputPassword })
          .then((res) => {
            this.password = res
          })
        await this.$api('/api/updateUserData', { param: [this.password, this.inputUserName, this.inputApiKey, this.email] })
          .then(res => {
            this.userName = this.inputUserName
            this.apiKey = this.inputApiKey
            this.$store.commit('user', {
              email: this.email,
              password: this.password,
              userName: this.userName,
              hueApiKey: this.apiKey
            })
            alert('회원정보가 수정되었습니다.')
            console.log(res)
          })
      }
    },
    checkInputNull (isSame) {
      if (this.userName === this.inputUserName && isSame && this.apiKey === this.inputApiKey) {
        alert('변경 된 내용이 없습니다!')
        return false
      } else {
        if (this.inputPassword.length < 6) {
          alert('비밀번호를 6자리 이상 입력해주세요.')
          return false
        } else if (this.inputPassword !== this.confirmPassword) {
          alert('비밀번호가 일치하지 않습니다.')
          return false
        } else if (!this.$checkEmail(this.email)) {
          alert('잘못 된 이메일 형식입니다.')
          return false
        }
      }
      return true
    }
  }
}
</script>
