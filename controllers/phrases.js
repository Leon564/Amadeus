const { db } = require('../db/firebase.js');


const addPhrase = async (req,res) => {
    if(!req.query.phrase)return res.status(401).send({ message: 'se esperaba ?phrase' });
    var phrase=req.query.phrase;
    var ref = await db.ref("data/phrases/count");
    var count = await ref.once("value");
    await db.ref(`data/phrases/${count.val()}`).set(phrase)
    await db.ref('data/phrases/count').set(admin.database.ServerValue.increment(1));
    return res.status(201).send({ message: "La orden se registro correctamente, key: " + count })

}

const getRandomPhrase = async (req,res) => {
    var ref = await db.ref("data/phrases/count");
    var count = await ref.once("value");
    var PhRandom = Math.floor(Math.random() * count.val());
    const eventref = db.ref(`data/phrases/${PhRandom}`);
    const snapshot = await eventref.once('value');
    return res.status(201).send({phrase:snapshot.val(),status:'ok'})
}

const Delete = async (req,res) => {

    if(!req.query.key)return res.status(401).send({ message: 'se necesita una key' });

    firebase.db.ref(`data/phrases/${req.query.key}`).remove().then(() => {
        return res.status(201).send({ message: "La orden se elimino correctamente" })
    }).catch((err) => {
        return res.status(500).send({ message: err })
    });

}
module.exports = {
    addPhrase,
    getRandomPhrase,
    Delete
}
