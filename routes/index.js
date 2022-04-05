"use strict";

const express = require("express");
const {
  anime,
  imageEffects,
  meme,
  movie,
  nfsw,
  sfw,
  phrase,
  stickers,
  webshots,
  zodiac,
  news,
} = require("../controllers");

const api = express.Router();

//phrase
api.get("/phrase", phrase.getRandomPhrase);
api.post("/phrase", phrase.addPhrase);
api.delete("/phrase", phrase.Delete);

//memes
api.get("/meme", meme.getRandomeme);
api.post("/meme", meme.addmeme);
api.delete("/meme", meme.Delete);

//anime
api.get("/anime/character/:id", anime.characterById);
api.get("/anime/character", anime.characterByName);
api.get("/anime/search", anime.buscar);
api.get("/anime", anime.random);

//stickers
api.get("/sticker/anime", stickers.snime);
api.get("/sticker/doge", stickers.doge);
api.get("/sticker/towebp", stickers.toWebpBuff);

//NFSW
api.get("/nfsw/waifu", nfsw.randomwaifu);
api.get("/nfsw/yaoi", nfsw.randomyaoi);

//SFW
api.get("/sfw/waifu", sfw.randomwaifu);
api.get("/sfw/husb", sfw.randomhusband);

//Movies
api.get("/movie", movie.movie);

//webshots
api.get("/ws", webshots.screenshot);
api.get("/pagepdf", webshots.pdf);

//zodiac
api.get("/zodiac", zodiac.zodiac);
api.get("/lovecalc", zodiac.lovecalc);

//ImageEffects
api.get("/calendar", imageEffects.calendar);

//News
api.get("/news/anime", news.animeNews);

module.exports = api;
