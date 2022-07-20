const puppeteer = require("puppeteer");
const {GoogleScraper} = require('../utils');

const searchbyimage = async (req, res) => {
  const imageUrl = req.query.url;
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(
    "https://www.google.com/searchbyimage?image_url=" +
      encodeURIComponent(imageUrl), {
        waitUntil: 'networkidle0',
      }
  );

  const images = await page.evaluate(() => {
    return Array.from(document.body.querySelectorAll("div div a h3"))
      .slice(2)
      .map((e) => e.parentNode)
      .map((el) => ({ url: el.href, title: el.querySelector("h3").innerHTML }));
  });
  await browser.close();
  return res.status(201).send({ results: images, status: "success" });
};
const search= async (req, res) => {
  const query = req.query.q;
  const google = new GoogleScraper({
    puppeteer: {
      headless: true,
    },
  });
  const results = await google.scrape(query, 20);
  res.status(201).send({ results, status: "success" });
}

module.exports = { searchbyimage, search };
