const { db } = require("../db/firebase.js");
const WSF = require("wa-sticker-formatter");

exports.snime = async (req, res) => {
  var ref = await db.ref("data/stickers/anime/count");
  var count = await ref.once("value");
  var PhRandom = Math.floor(Math.random() * count.val());
  const eventref = db.ref(`data/stickers/anime/${PhRandom}`);
  const snapshot = await eventref.once("value");
  return res.status(201).send({ image: snapshot.val(), status: "ok" });
};

exports.doge = async (req, res) => {
  var ref = await db.ref("data/stickers/doge/count");
  var count = await ref.once("value");
  var PhRandom = Math.floor(Math.random() * count.val());
  const eventref = db.ref(`data/stickers/doge/${PhRandom}`);
  const snapshot = await eventref.once("value");
  return res.status(201).send({ image: snapshot.val(), status: "ok" });
};

exports.toWebpBuff = async (req, res) => {
  if (!req.query.imageUrl) return res.status(500).send({error:true, message:'parameters required, imageurl, optionals(pack, author)'});
  const pack = req.query.pack ? req.query.pack : "Sticker";
  const author = req.query.author ? req.query.author : "Amadeus";
  const sticker = new WSF.Sticker(req.query.imageUrl, {
    crop: true,
    animated: true,
    pack,
    author,
  });
  const buffer = await sticker.toBuffer();
  return res.status(201).send({ stk: buffer, status: "ok" });
};
