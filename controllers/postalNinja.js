const puppeteer = require("puppeteer");
const { load } = require("cheerio");

const track = async (req, res) => {
  const code = req.query.code;
  if (!code)
    return res.status(401).send({ message: "code parameter is required" });
  console.log(code);
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://postal.ninja/es/", {
    waitUntil: "networkidle0",
  });
  console.log("1");
  //select a input field and type the code
  await page.type("input[name=rtc]", code);
  //click on the button
  await page.click("button[type=submit]");
  //wait for the page to load
  await page.waitForNavigation().catch((err) => {
    console.log("codigo invalido");
    return res.status(401).send({ error: true, message: "codigo invalido" });
  });

  //get the html of the page
  const html = await page.evaluate(() => document.body.innerHTML);
  //get actual url
  const url = page.url();

  //get all the elements of the page with the class "wpf-table-tr"
  const $ = load(html);
  const elements = $("div.wpf-table-tr");
  //get the text of each element
  const texts = elements
    .map((i, element) => {
      let el = $(element).text().replace(/\n/g, "").replace(/\t/g, "");
      if (el.includes("Mostrar eventos")) {
        el = el.split("Mostrar")[0];
      }
      if (el.startsWith("Fecha Estatus y ubicación")) {
        el = el.split("(")[0];
      }

      return el;
    })
    .toArray();
  await browser.close();
  return res.status(201).send({ results: texts, url, status: "success" });
};

module.exports = { track };
