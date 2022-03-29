const puppeteer = require("puppeteer");
var validUrl = require("valid-url");
var path = require("path");
const fs = require("fs");
const config = require("../config");

exports.screenshot = async function (req, res) {
  const url = req.query.url;
  const fullpage = !!req.query.full_page;

  if (!url || !validUrl.isWebUri(url))
    return res.status(500).send({ error: true, message: 'error accessing url' });
  //return res.send(validUrl.isWebUri(url))
  //return res.send(url + ' ' + fullpage + ' ' + validUrl.isUri(url))

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const name = `/${Date.now()}.jpg`;
  try {
    await page.goto(url);
  } catch (err) {
    return res.status(500).send({ error: true, message: 'error accessing url' });
  }
  await page.screenshot({
    path: path.join(__dirname, "..", "files/" + name),
    type: "jpeg",
    fullPage: fullpage,
  });
  browser.close();

  res.on("finish", function () {
    fs.unlinkSync(path.join(__dirname, "..", "files/" + name));
  });
  res.on("error", function () {
    fs.unlinkSync(path.join(__dirname, "..", "files/" + name));
  });

  return res.status(201).sendFile(path.join(__dirname, "..", "files/" + name));
};

exports.pdf = async function (req, res) {
  const url = req.query.url;

  if (!url || !validUrl.isWebUri(url))
    return res
      .status(201)
      .sendFile(path.join(__dirname, "..", "files/page not found.jpg"));
  //return res.send(validUrl.isWebUri(url))
  //return res.send(url + ' ' + fullpage + ' ' + validUrl.isUri(url))

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const name = `/${Date.now()}.pdf`;
  console.log("trying");
  await page.setDefaultNavigationTimeout(0);
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
  } catch (err) {
    console.log(err);
    return res
      .status(201)
      .sendFile(path.join(__dirname, "..", "files/page not found.jpg"));
  }

  await page.pdf({
    path: path.join(__dirname, "..", "files/" + name),
    type: "pdf",
    fullPage: true,
  });
  browser.close();

  res.on("finish", function () {
    fs.unlinkSync(path.join(__dirname, "..", "files/" + name));
  });
  res.on("error", function () {
    fs.unlinkSync(path.join(__dirname, "..", "files/" + name));
  });

  return res.status(201).sendFile(path.join(__dirname, "..", "files/" + name));
};
