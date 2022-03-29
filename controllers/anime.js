const rp = require("request-promise");
const JSDOM = require("jsdom").JSDOM;
const scrapper = require("../utils/scrappers");
const translatte = require("translatte");

const { fetchJson } = require("fetch-json");

exports.character = async function (req, res) {
  if (!req.query.name && !req.query.id)
    return res.status(401).send({ message: "name or id required" });

  if (req.query.id) {
    if (!req.query.id) return res.status(401).send({ message: "id required" });
    const result = await fetchJson.get(
      `https://api.jikan.moe/v4/characters/${req.query.id}`
    );

    if (result.data.length < 1) return res.send({ error: "error" });
    let desc = result.data.about ? result.data.about : "Without description.";
    //Replace later with the package leonn-utils
    desc = desc.replace(new RegExp(`&amp`, "gi"), "&");
    desc = desc.replace(new RegExp(`&quot`, "gi"), `"`);
    desc = desc.replace(new RegExp(`&lt`, "gi"), "<");
    desc = desc.replace(new RegExp(`&gt`, "gi"), ">");

    desc = await translatte(desc, { to: "es" }).catch(
      (err) => (desc = result.data.about)
    );
    return res.send({
      image: result.data.images.jpg,
      about: desc.text ? desc.text : desc,
      name: result.data.name,
    });
  }
  const result = await fetchJson.get(
    `https://api.jikan.moe/v4/characters?q=${req.query.name}`
  );
  if (result.data.length < 1) return res.send({ error: "error" });

  if (result.data.length == 1) {
    let desc = result.data[0].about
      ? result.data[0].about
      : "Without description.";
    desc = desc.replace(new RegExp(`&amp`, "gi"), "&");
    desc = desc.replace(new RegExp(`&quot`, "gi"), `"`);
    desc = desc.replace(new RegExp(`&lt`, "gi"), "<");
    desc = desc.replace(new RegExp(`&gt`, "gi"), ">");

    desc = await translatte(desc, { to: "es" }).catch(
      (err) => (desc = result.data.about)
    );
    return res.send({
      image: result.data[0].images.jpg,
      about: desc.text ? desc.text : desc,
      name: result.data[0].name,
    });
  }
  return res.send(result.data.map((x) => ({ id: x.mal_id, name: x.name })));
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
    return res.status(201).send({ results: [result] });
  }
  var _url = `https://tioanime.com/directorio?q=${query.replace(/[ ]/gi, "+")}`;

  return rp(_url).then(async (html) => {
    const dom = new JSDOM(html);
    const $ = require("jquery")(dom.window);
    const _results = $.find('article[class="anime"]');
    const _animes = $(_results).find("a");

    var sResult = null;
    var animes = [];
    var results = $(_animes)
      .map((i, x) => ({ url: $(x).attr("href") }))
      .toArray()
      .slice(0, 10);
    //console.log(results)
    var animes = [];
    for (let x of results) {
      var result = await scrapper.tioanime(x.url);
      animes.push(result);
      //console.log(result)
    }
    //console.log('***********************************')
    //console.log(animes)
    return res.status(201).send({ results: animes });
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
        let anime = await scrapper.tioanime(href);
        return res.status(201).send({ results: [anime] });
      }
    );
  });
};
