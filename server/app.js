const express = require('express')
const app = express()
const session = require('express-session')
const fs = require('fs') // 디렉토리 접근 모듈
const bcrypt = require('bcrypt') // pw 암호화 모듈
const cors = require('cors')

app.use(session({
  secret: 'secret code', // 세션에 대한 키
  resave: false, // 리퀘스트 요청에 대해 세션 수정사항이 없더라도 다시 저장하는지 여부
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 재저장하는지
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 // 쿠키 유효시간 1시간
  }
}))

app.use(express.json({
  limit: '50mb'
}))

app.use(cors({
  origin: '*', // 출처 허용 옵션
  credential: 'true' // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));

const port = 3000;
const server = app.listen(3000, () => {
  console.log(`Server Started. port ${port}.`);
})

let sql = require('./sql.js');
// sql.js의 쿼리문 수정 시 캐시 삭제 후 재반영
fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
  console.log('sql 변경 시 재시작 없이 반영되도록 함');
  delete require.cache[require.resolve('./sql.js')];
  sql = require('./sql.js');
})

const db = {
  database: 'vueIoT', // db 수정 필요 -> dev말고 다른 db 새로 생성한거 넣기
  connectionLimit: 10,
  host: 'localhost',
  port: 8000,
  user: 'root',
  password: 'mariadb'
}

const dbPool = require('mysql').createPool(db)

app.get('/', (req, res) => {
  res.send()
})

app.post('/api/cryptopw', (request, res) => {
  const pw = request.body.param
  const salt = 12

  bcrypt.hash(pw, salt, (err, encryptedPW) => {
    const hash = encryptedPW
    res.send(hash)
  })
});

app.post('/api/crypto/compare', (request, res) => {
  const pw = request.body.params.pw
  const hash = request.body.params.cryptoPW
  const match = bcrypt.compareSync(pw, hash)
  res.send(match)
});

app.post('/api/:alias', async(request, res) => {
  try{
    res.send(await req.db(request.params.alias, request.body.param))
  } catch(err){
    res.status(500).send({
      error: err
    });
  }
});

const req = {
  async db(alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbPool.query(sql[alias].query + where, param, (error, rows) => {
      if(error) {
        if(error.code != 'ER_DUP_ENTRY')
          console.log(error);
        resolve({
          error
        });
      } else resolve(rows);
    }));
  }
}
