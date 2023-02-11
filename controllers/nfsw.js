const { fetchJson } = require('fetch-json')

const randomwaifu = async (req, res) => {
    const tag = ['ass', 'hentai','milf', 'oral', 'paizuri', 'echhi', 'ero']
    const randTag = tag[Math.floor(Math.random() * tag.length)]
    console.log(`Searching lewd from ${randTag} subreddit...`)
    let result = await fetchJson.get(`https://api.waifu.im/search/?included_tags=${randTag}`);
    result.title= result.images[0].tags[0].name
    return res.status(201).send({ result, status: 'ok' })
}

const randomyaoi= async (req,res) => {
    const tag = ['yaoi']
    const randTag = tag[Math.floor(Math.random() * tag.length)]
    console.log(`Searching lewd from ${randTag} subreddit...`)
    const result = await fetchJson.get(`https://meme-api.herokuapp.com/gimme/${randTag}`);
    //console.log(result)
    return res.status(201).send({ result, status: 'ok' })
}

module.exports = {
    randomwaifu,
    randomyaoi

}