const { fetchJson } = require("fetch-json");
const config = require("../config");
const { tmdbById } = require("../utils");

const movie = async (req, res) => {  
  if (!req.query.id && !req.query.q)
    return res.status(400).send({ error: "bad request" });
  if (req.query.id) {
    if (!req.query.type) {
      return res
        .status(400)
        .send({
          error: "bad request",
          message: "type is required ('tv' or 'movie')",
        });
    }
    let type = req.query.type;
    if(type!='tv' && type!='movie')type='movie';
    return tmdbById(req.query.id, req.query.type).then((m) => {
      return res.status(201).send({results:[m]});
    });
  }

  var tmbdapi = await fetchJson.get(
    `https://api.themoviedb.org/3/search/multi?api_key=${config.themoviedb_apikey}&query=${req.query.q}&language=es`
  );
  const genresm = await fetchJson.get(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${config.themoviedb_apikey}&language=es`
  );
  const genrestv = await fetchJson.get(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${config.themoviedb_apikey}&language=es`
  );
  let _genres = genresm.genres.concat(genrestv.genres);

  let results = tmbdapi.results
    .filter((value) => value.media_type == "movie" || value.media_type == "tv")
    .filter(
      (value) =>
        (value.release_date && value.release_date.length > 0) ||
        (value.first_air_date && value.first_air_date.length > 0)
    )
    .map((value) => {
      let genres = !value.genre_ids
        ? value.genres
        : value.genre_ids.map((value) => {
            let x = _genres.find((value2) => value2.id == value);
            return x ? x.name : "no genre";
          });

      return {
        id: value.id,
        title: value.title ? value.title : value.name,
        original_title: value.original_title
          ? value.original_title
          : value.original_name,
        type: value.media_type,
        genres,
        release_date: value.release_date
          ? value.release_date
          : value.first_air_date,
        vote_average: value.vote_average,
        overview: value.overview != "" ? value.overview : "not description :)",
        posterw500: value.poster_path
          ? `https://image.tmdb.org/t/p/w500${value.poster_path}`
          : "https://i.ibb.co/NFyxfR2/No-Image-Placeholder.png",
        poster: value.poster_path
          ? `https://image.tmdb.org/t/p/original${value.poster_path}`
          : "https://i.ibb.co/NFyxfR2/No-Image-Placeholder.png",
      };
    });

  return res.status(201).send({ results, total_results: results.length });
};
module.exports = {
  movie,
};
