const { db } = require('../db/firebase.js');

const addmeme = async (req,res) => {
    if(!req.query.url)return res.status(401).send({error:true, message: 'url parameter is required' });
    var phrase=req.query.url;
    var ref = await db.ref("data/memes/count");
    var count = await ref.once("value");
    await db.ref(`data/memes/${count.val()}`).set(phrase)
    await db.ref('data/memes/count').set(admin.database.ServerValue.increment(1));
    return res.status(201).send({ message: "sucess , key: " + count })

}

const getRandomeme = async (req,res) => {
    var ref = await db.ref("data/memes/count");
    var count = await ref.once("value");
    var PhRandom = Math.floor(Math.random() * count.val());
    const eventref = db.ref(`data/memes/${PhRandom}`);
    const snapshot = await eventref.once('value');
    return res.status(201).send({phrase:snapshot.val(),status:'ok'})
}

const Delete = async (req,res) => {

    if(!req.query.key)return res.status(401).send({ error:true,message: 'key parameter is required' });

    firebase.db.ref(`data/memes/${req.query.key}`).remove().then(() => {
        return res.status(201).send({ message: "Comando ejecutado correctamente" })
    }).catch((err) => {
        return res.status(500).send({ message: err })
    });

}
module.exports = {
    addmeme,
    getRandomeme,
    Delete
}
