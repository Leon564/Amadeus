const { text } = require("express");
const rp = require("request-promise");
const JSDOM = require("jsdom").JSDOM;
const { fetchJson } = require("fetch-json");
const { tmdbById } = require("./tmdb");

var { decode } = require("html-entities");


const tioanime = (id) => {
  let url = id.includes(`https://tioanime.com`)
    ? encodeURI(id)
    : encodeURI(`https://tioanime.com/anime/${id}`);  
  return rp(url)
    .then(async (html) => {
      //console.log(url)
      const dom = new JSDOM(html);
      const $ = require("jquery")(dom.window);
      const _animeData = $.find('article[class="anime-single"]')[0];

      var info = $.find("script")[$.find("script").length - 1];

      var nEpisodes = $(info)
        .text()
        .match(/var episodes = (.*);/)[0]
        .split("=")[1]
        .replace("[", "")
        .replace(",", "#")
        .replace("];", "")
        .split("#")
        .shift()
        .trim();

      var infos = $.find("script")[$.find("script").length - 2];
      var urls = $(infos).text().split("'")[1];

      const _score = await fetchJson.get(urls);
      const score = _score.score;

      const _img = $(_animeData).find("img")[0];
      const img = $(_img).attr("src");

      const _title = $(_animeData).find('h1[class="title"]')[0];
      const title = $(_title).text();

      const _generos = $.find('p[class="genres"]');
      var generos = $(_generos)
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/([a-z])([A-Z])/g, "$1,$2")
        .trim()
        .split(",");

      const _type = $.find('span[class="anime-type-peli"]')[0];
      var type = $(_type)
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();

      var desc = $.find('p[class="sinopsis"]')[0];
      var sinopsis = $(desc).text().trim();

      const _status = $(_animeData).find('div[class="thumb"]')[0];

      const status = $(_status).text().trim();

      var ano = $.find('span[class="year"]')[0];
      var year = $(ano).text();

      let id = url.split("/anime/")[1];
      return {
        title:decode(title),
        genres: generos,
        state: status,
        relase_date: year,
        about: decode(sinopsis),
        episodes: nEpisodes,
        vote_average: score,
        poster: "https://tioanime.com" + img,
        type,
        url,
        id, //`https://tioanime.com${url}`,
      };
    })
    .catch((err) => {
      return { error: "invalid url" };
    });
};

module.exports = {  
  tioanime
};
