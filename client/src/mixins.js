// 모든 컴포넌트에서 사용할 공통 모듈이자 함수를 정의하여 사용
import axios from 'axios'

export default {
  methods: {
    async $api (url, data) {
      return (await axios({
        method: 'post',
        url,
        data
      }).catch(e => {
        console.log(e)
      })).data
    },
    $checkEmail (email) {
      // eslint-disable-next-line no-useless-escape
      const reg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      if (reg.test(email) && email !== '' && email !== undefined) return true
      return false
    }
  }
}
