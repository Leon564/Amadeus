# Amadeus-Api
This project is made using express and firebase, it returns different data, it contains information about animes, movies, memes and several more functions.
# Introduction
> This is a project in conjunction with Kurisu-Bot

> It is a compilation of actions and data necessary to return what is requested from this

>This is a personal project, created as a hobby

# Content

## Animes 
The data is obtained from [tioanime.com](https://tioanime.com/) & [api.jikan.moe](https://api.jikan.moe/v4/)

Obtain a random anime
* /api/anime  

Search results by name
* /api/anime/search?q=Overlord  

Search a anime character by name
* /api/anime/character?name=Rimuru

Obtain a random female anime character
* /api/sfw/waifu
  
Obtain a random male anime character
* /api/sfw/husb

## Movies
The data is obtained from [themoviedb.org](https://www.themoviedb.org/)

Search results by name
* /api/movie?q=Toy story  

## Memes

Get a random meme
* /api/meme
  
## Phrases

Get a random anime phrase
* /api/phrase

## Stickers

Get a random anime sticker
* /api/sticker/anime
  
Get a random doge sticker
* /api/sticker/doge

Convert any image or gif into a sticker from a url  
* /api/sticker/towebp

## Image effects

Get a calendar with a custom background image
* /api/calendar?url=https://i.ibb.co/7WQBQtq/Tsuki-ga-Michibiku-Isekai-Douchuu.png

## Misc
The data is obtained from [hola.com](https://www.hola.com/horoscopo/) & [calculator.acierta](https://calculador.acierta.me/)

Get a screenshot of a webpage
* /api/ws?url=https://tioanime.com

get the horoscope by sign

* /api/zodiac?sign=libra

Get the random Love percent 

* /api/lovecalc?n1=Kurisu&n2=Okabe

## News
The data is obtained from [ninoasia.com](https://ninoasia.com/)

Get list of anime news
* /api/news/anime

Get a new by id
* /api/news/anime?id=newsid

# Demo

https://amadeus-api.herokuapp.com/
