const ScraperClass = require('./google/scraper');
ScraperClass.default = ScraperClass;
exports.GoogleScraper = ScraperClass;
exports.tmdbById=require("./tmdb");
exports.scrappers=require("./scrappers");
