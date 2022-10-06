const puppeteer = require("puppeteer");
const {load} = require("cheerio");
const URL = "https://somoskudasai.com";

const getNew= async (id,type) => {  
  if(!id || !type) return {error: "id not found"};
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests",
      "--disable-site-isolation-trials",
    ],
  }); 
  const page = await browser.newPage();
  await page.goto(encodeURI(`${URL}/${type}/${id}`), { waitUntil: "domcontentloaded" }).catch((err) => {
    return err;
  });
  const html = await page.content();
  const $ = load(html);
  const title = $("h1[class='ar-title white-co mab1 pdt fz5 lg-fz7 xl-fz8 mar']").text();
  const date = $("span[class='op5 mar2']").text();
  const content = $("main").text().replace(/[●]/g, "\n●").trim();
  const source = $("main").find("a[rel='nofollow']").attr("href");
  const newUrl = page.url();
  const images= [];
  $("main").find("img").each((i, el) => {
    images.push($(el).attr("src"));
  });
  const mainImage = $("meta[property='og:image']").attr("content");
  const iframes = $("main").find("iframe").attr("src");
  const videos = [];
  if(iframes){
    videos.push(`https://youtu.be/${iframes.split("/")[iframes.split("/").length - 1]}`);
  }
  await browser.close();
  return {title, date, news:content, post : newUrl, source, extraImages:images,mainImage, videos};
  
};

const animeNews = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    const type = req.query.type;
    const news = await getNew(id,type).catch((err) => {
      return err;
    });
    return res.status(201).send(news);
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests",
      "--disable-site-isolation-trials",
    ],
  });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" }).catch((err) => {
    res.status(500).send(err);
  });
  const html = await page.content();
  const $ = load(html);
  const news = [];
  const list = $(
    "div[class='news-list dg gg1 gt1 xs-gt2 md-gt3 xl-gt4 xl-gg2']"
  );
  $(list)
    .find("article[class='ar por']")
    .each((i, el) => {
      const link = $(el).find("a").attr("href");
      const type= link.split("/")[link.split("/").length - 3];
       const _id= link.split("/")[link.split("/").length - 2];
      news.push({
        title: $(el)
          .find("h2[class='ar-title white-co mab fz4 lg-fz5']")
          .text(),
        post:link,
        type,
        _id,
        id:`${_id}&type=${type}`,       

      });
    });

  await browser.close();
  return res.status(201).send({results: news});
};

module.exports = {
  animeNews,
};
