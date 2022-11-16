module.exports = {
  insertUserData: {
    query: `INSERT INTO user (email, password, userName) VALUES (?, ?, ?)`
  },
  selectAllUserData: {
    query: `SELECT * FROM user WHERE email = ?`
  },
  updateUserData: {
    query: `UPDATE user SET password = ?, userName = ?, hueApiKey = ? WHERE email = ?`
  },
  deleteUserData: {
    query: `DELETE FROM user WHERE email = ?`
  },
  selectBulbData: {
    query: `SELECT bulb.* FROM bulb JOIN user USING(email) WHERE email = ?`
  },
  insertBulbData: {
    query: `INSERT INTO bulb (id, email, autoBulb, bulbOn, hue, sat, bri, reachable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  },
  updateBulbData: {
    query: `UPDATE bulb SET autoBulb = ?, bulbOn = ?, hue = ?, sat = ?, bri = ?, reachable = ? where id = ?`
  },
  selectRoomData: {
    query: `SELECT * FROM room_condition WHERE email = ?`
  },
  insertRoomData: {
    query: `INSERT INTO room_condition (email, r_year, r_month, r_day, r_hour, r_minute, temp, humid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  },
  selectRoomDataInDay: {
    query: `SELECT r_year, r_month, r_day, r_hour, temp, humid FROM room_condition WHERE email = ? AND r_year = ? AND r_month = ? AND r_day = ?`
  },
  selectRoomDataInHour: {
    query: `SELECT temp, humid, r_year, r_month, r_day, r_hour, r_minute FROM room_condition WHERE email = ? AND r_year = ? AND r_month = ? AND r_day = ? AND r_hour = ?`
  },
  selectRoomDataInDayAVG: {
    query: `SELECT r_year, r_month, r_day, r_hour, r_minute, AVG(temp) AS temp, AVG(humid) AS humid 
    FROM room_condition 
    WHERE email = ? AND r_year = ? AND r_month = ? AND r_day = ? 
    GROUP BY r_day;`
  },
  selectRoomDataInHourAVG: {
    query: `SELECT sub.r_year, sub.r_month, sub.r_day, sub.r_hour, sub.r_minute, AVG(sub.temp) AS temp, AVG(sub.humid) AS humid
    FROM (SELECT r_year, r_month, r_day, r_hour, r_minute, AVG(temp) AS temp, AVG(humid) AS humid 
    FROM room_condition 
    WHERE email = ? AND r_year = ? AND r_month = ? AND r_day = ? AND r_hour >= ? AND r_hour <= ?
    GROUP BY r_hour) AS sub
    GROUP BY sub.r_day;`
  }
}
