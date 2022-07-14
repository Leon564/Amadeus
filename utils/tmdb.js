const { fetchJson } = require("fetch-json");
const config = require("../config");

const tmdbById = async (id, type) => {
  type = type ? type : "movie";
  const m = await fetchJson.get(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${config.themoviedb_apikey}&language=es&external_source=imdb_id`
  );

  if (m.success == false) {
    return { success: false, error: "not found" };
  }
  const genres = m.genres.map((value) => value.name);
  return {
    id: m.id,
    title: m.title ? m.title : m.name,
    original_title: m.original_title ? m.original_title : m.original_name,
    type: m.media_type,
    genres,
    relase_date: m.release_date ? m.release_date : m.first_air_date,
    vote_average: m.vote_average,
    overview: m.overview != "" ? m.overview : "not description :)",
    posterw500: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : "https://i.ibb.co/NFyxfR2/No-Image-Placeholder.png",
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/original${m.poster_path}`
      : "https://i.ibb.co/NFyxfR2/No-Image-Placeholder.png",
  };
};
module.exports = tmdbById;
