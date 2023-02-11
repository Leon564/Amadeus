const { fetchJson } = require('fetch-json')

const randomwaifu = async (req, res) => {    
    const result = await fetchJson.get(`https://api.waifu.im/search/?included_tags=waifu`);
    //console.log(result)
    return res.status(201).send({ result, status: 'ok' })
}

const randomhusband= async (req,res) => {
    const tag = ['husbando']
    const randTag = tag[Math.floor(Math.random() * tag.length)]
    console.log(`Searching lewd from ${randTag} subreddit...`)
    const result = await fetchJson.get(`https://meme-api.herokuapp.com/gimme/${randTag}`);
    //console.log(result)
    return res.status(201).send({ result, status: 'ok' })
}

module.exports={
    randomwaifu,
    randomhusband
}