import { createStore } from 'vuex'
import persistedstate from 'vuex-persistedstate'
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// import axios from 'axios'

export default createStore({
  state () {
    return {
      userStatus: false,
      user: {
        email: '',
        password: '',
        userName: '',
        hueApiKey: ''
      },
      routePath: '',
      userAuth: {}
    }
  },
  getters: {
    getUserStatus (state) {
      return state.userStatus
    },
    getUser (state) {
      return state.user
    },
    getRoutePath (state) {
      return state.routePath
    },
    getUserAuth (state) {
      return state.auth
    }
  },
  mutations: {
    user (state, data) {
      state.user.email = data.email
      state.user.password = data.password
      state.user.userName = data.userName
      state.user.hueApiKey = data.hueApiKey
    },
    userStatus (state, data) {
      state.userStatus = data
      console.log(state.userStatus)
    },
    userReset (state) {
      console.log('Store(Local Storage) User 정보가 초기화 되었습니다.')
      state.user = {
        email: '',
        password: '',
        userName: '',
        hueApiKey: ''
      }
      state.userStatus = false
    },
    routePath (state, data) {
      state.routePath = data
    },
    userAuth (state, data) {
      state.userAuth = data
    }
  },
  // actions 메소드의 첫번째 파라미터 -> 이름은 자유롭되 해당 이름이 vue 컴포넌트에서 this.$store의 의미를 가짐
  // 첫번째 파라미터 이름 a -> a.state.변수 === this.$store.state.변수
  // 비동기 호출 api 호출 등 담당, 컴포넌트에서 dispatch를 이용
  actions: {
    // ++++++++  firebase 로그인용 -> mariadb 로그인으로 변경 -> loginView에서 처리  ++++++++
    // async login (login, payload) {
    //   const auth = getAuth()
    //   await signInWithEmailAndPassword(auth, payload.email, payload.password)
    //     .then((userCredential) => {
    //       // Signed in
    //       console.log(userCredential.user)
    //       login.commit('userStatus', true)
    //       const user = auth.currentUser
    //       login.commit('userAuth', auth)
    //       if (user !== null) {
    //         // The user object has basic properties such as display name, email, etc.
    //         login.commit('user', { email: user.email, password: '', userName: '', hueApiKey: '' })
    //         const displayName = user.displayName
    //         const email = user.email
    //         const photoURL = user.photoURL
    //         const emailVerified = user.emailVerified

    //         // The user's ID, unique to the Firebase project. Do NOT use
    //         // this value to authenticate with your backend server, if
    //         // you have one. Use User.getToken() instead.
    //         const uid = user.uid
    //         console.log(displayName)
    //         console.log(email)
    //         console.log(photoURL)
    //         console.log(emailVerified)
    //         console.log(uid)
    //       }
    //       // localStorage.setItem('vuex', sessionStorage.getItem('vuex'))
    //       // ...
    //       alert('로그인 완료!')
    //     })
    //     .catch((error) => {
    //       login.commit('user', {})
    //       login.commit('userStatus', false)
    //       console.log(error.code)
    //       alert('에러 : ' + error.message)
    //     }
    //     )
    // },
    logout (logout) {
      // auth는 firebase 로그아웃용
      // const auth = getAuth()
      // auth.signOut()
      // logout.commit('userAuth', auth)
      logout.commit('userReset')
    }
    // async apiUserData (api) { // DB 데이터를 store Local Storage에 저장
    //   await axios({
    //     method: 'post',
    //     url: '/api/getUserData',
    //     data: { param: api.state.user.email }
    //   }).then((res) => {
    //     api.commit('user', {
    //       email: res.data[0].email,
    //       password: res.data[0].password,
    //       userName: res.data[0].userName,
    //       hueApiKey: res.data[0].hueApiKey
    //     })
    //   }).catch(e => {
    //     console.log(e)
    //   })
    // }
  },
  modules: {
  },
  plugins: [
    persistedstate({
      // path 설정 시 path에 입력한 모듈만 로컬스토리지에 저장
      path: ['user']
      // 기본은 로컬스토리지 사용, 아래 코드 적용 시 vuex 데이터를 세션스토리지에 적용
      // storage: window.sessionStorage
    })
  ]
})
