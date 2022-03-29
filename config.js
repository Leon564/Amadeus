require('dotenv').config()
module.exports = {
  port: process.env.PORT || 3000, //PORT(INT)
  db: process.env.DBFirebase_Url, //DBFirebase_Url(STRING)
  serviceAccount: process.env.Firebase_Credentials, //Firebase_Credentials(JSON)
  themoviedb_apikey: process.env.themoviedb_ApiKey,//themoviedb_ApiKey(STRING)
  page404:"https://i.ibb.co/VLTKT8q/anime-girls-404-not-found-glowing-eyes-girls-frontline-wallpaper-preview.jpg"//url
};
