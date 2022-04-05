const rp = require("request-promise");
const JSDOM = require("jsdom").JSDOM;
const scrapper = require("../utils/scrappers");
const translatte = require("translatte");
var { decode } = require("html-entities");
const { fetchJson } = require("fetch-json");

exports.characterByName = async function (req, res) {
  if (!req.query.name)
    return res.status(401).send({ message: "name required" });
  const result = await fetchJson.get(
    `https://api.jikan.moe/v4/characters?q=${req.query.name}`
  );
  if (result.data.length < 1)
    return res.send({ error: "error", total_results: 0 });
  if (result.data.length == 1) {
    let desc = result.data[0].about
      ? result.data[0].about
      : "Without description.";

    desc = await translatte(decode(desc), { to: "es" }).catch(
      (err) => (desc = result.data.about)
    );
    return res.send({
      image: result.data[0].images.jpg,
      about: desc.text ? desc.text : desc,
      name: result.data[0].name,
    });
  }
  return res.send({
    results: result.data.map((x) => ({ id: x.mal_id, name: x.name })),
    total_results: result.data.length,
  });
};
exports.characterById = async function (req, res) {
  if (!req.params.id) return res.status(401).send({ message: "id required" });
  const result = await fetchJson.get(
    `https://api.jikan.moe/v4/characters/${req.params.id}`
  );
  if (result.error) return res.send({ error: "error" }); 
  let desc = result.data.about ? result.data.about : "Without description.";
  desc = await translatte(decode(desc), { to: "es" }).catch(
    (err) => (desc = result.data.about)
  );
  return res.send({
    image: result.data.images.jpg,
    about: desc.text ? desc.text : desc,
    name: result.data.name,
  });
};

exports.buscar = async function (req, res) {
  let query = req.query.q;
  let id = req.query.id;
  if (!query && !id)
    return res
      .status(500)
      .send({ error: "Parameter q for name or url is required." });
  if (id) {
    let result = await scrapper.tioanime(id);
    if (result.error) return res.status(500).send({ error: "Not found" });
    return res.status(201).send({ results: [result] });
  }
  var _url = `https://tioanime.com/directorio?q=${query.replace(/[ ]/gi, "+")}`;

  return rp(_url).then(async (html) => {
    const dom = new JSDOM(html);
    const $ = require("jquery")(dom.window);
    const _results = $.find('article[class="anime"]');
    const _animes = $(_results).find("a");
    var animes = [];
    var results = $(_animes)
      .map((i, x) => ({ url: $(x).attr("href") }))
      .toArray()
      .slice(0, 10);

    var animes = [];
    for (let x of results) {
      var result = await scrapper.tioanime(`${x.url.split("/")[2]}`);
      animes.push(result);
    }

    return res
      .status(201)
      .send({ results: animes, total_results: animes.length });
  });
};

exports.random = async function (req, res) {
  var url = `https://tioanime.com/directorio`;

  return rp(url).then((html) => {
    const dom = new JSDOM(html);
    const $ = require("jquery")(dom.window);
    //Leer el numero de Ventanas de anime y obtener uno al azar
    const result = $.find('nav[aria-label="Page navigation"]');
    const pages = $(result).find('a[class="page-link"]');
    const nPages = $(pages)[$(pages).length - 2];
    let rPage = Math.floor(
      Math.random() * (parseInt($(nPages).text()) * 1) - 1
    );
    return rp(`https://tioanime.com/directorio?p=${rPage}`).then(
      async (html) => {
        const dom = new JSDOM(html);
        const $ = require("jquery")(dom.window);
        //Leer el numero de Ventanas de anime y obtener uno al azar
        const result2 = $.find('ul[class="animes list-unstyled row"]');
        const animes = $(result2).find('article[class="anime"]');
        const nAnimes = $(animes).length;
        let rnime =
          Math.floor(Math.random() * (parseInt(nAnimes) - 0 + 1) + 0) - 1;
        const _href = $(animes[rnime]).find("a");
        const href = $(_href).attr("href");
        let anime = await scrapper.tioanime(href.split("/")[2]);
        return res.status(201).send({ results: [anime] });
      }
    );
  });
};
