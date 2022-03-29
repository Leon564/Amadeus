const { fetchJson } = require('fetch-json')

const randomwaifu = async (req, res) => {
    const tag = ['ecchi', 'lewdanimegirls', 'hentai', 'hentaifemdom', 'hentaiparadise', 'animearmpits', 'animefeets', 'animethighss', 'animebooty', 'biganimetiddies', 'animebellybutton', 'sideoppai', 'ahegao']
    const randTag = tag[Math.floor(Math.random() * tag.length)]
    console.log(`Searching lewd from ${randTag} subreddit...`)
    const result = await fetchJson.get(`https://meme-api.herokuapp.com/gimme/${randTag}`);
    //console.log(result)
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