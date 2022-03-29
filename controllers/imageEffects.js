var Jimp = require("jimp");
const calendar = async (req, res) => {
  var url = req.query.url;
  if (!url) return res.status(500).send({ err: "url required" });

  Jimp.read(
    "https://i.ibb.co/pZ497mb/Pngtree-2022-calendar-with-border-style-696567822.png"
  )
    .then(async (img) => {
      var image = await Jimp.read(url);
      image.cover(img.bitmap.width, img.bitmap.height);
      image.composite(img, 0, 0).getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
        if (err) return res.send({ err: err });
        res.contentType("image/jpeg");
        return res.status(201).send(buffer);
      });
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
};

module.exports={
    calendar
}