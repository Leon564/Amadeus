const rp = require("request-promise");
const JSDOM = require("jsdom").JSDOM;
const scrapper = require("../utils/scrappers");

const animeNews = async (req, res) => {
  if (req.query.id) {
    return res.status(201).send(await scrapper.ninoasia(req.query.id));
  }
  return rp("https://ninoasia.com/").then(async (html) => {
    const dom = new JSDOM(html);
    const $ = require("jquery")(dom.window);

    const _results = $.find('section[data-id="012da06"]');
    const news = $(_results).find("article");

    var results = $(news)
      .map((i, x) => {
        let title = $(x).find(
          'h2[class="is-title post-title limit-lines l-lines-2"]'
        );
        let aUrl = $(title).find("a");
        let url = $(aUrl).attr("href");
        let id = url ? url.split(".com/")[1].slice(0, -1) : undefined;
        return { title: $(title).text(), post: url, id };
      })
      .toArray()
      .slice(0, 10);
    return res.status(201).send({ results: results });
  });
};

module.exports = {
  animeNews,
};
