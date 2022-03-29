const { fetchJson } = require('fetch-json');
const rp = require('request-promise');
const JSDOM = require('jsdom').JSDOM;
var fs = require('fs');



exports.zodiac = async (req, res)=> {
  const signos = ['aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'];
  
  if(!req.query.sign) return res.status(201).send({'message':'sign parameter required','signs':signos});
  if (!signos.includes(req.query.sign)) return res.status(201).send({'signs':signos})

  return rp(`https://www.hola.com/horoscopo/${req.query.sign}/`).then(html => {


    const dom = new JSDOM(html);
    const $ = require('jquery')(dom.window);

    const _sign = $.find('h1[id="titprev"]');
    const sign = $(_sign).text().replace(/\s+/g, " ").trim();

    const _resultados = $.find('div[id="resultados"]');

    const _title = $(_resultados).find('h2[class="title"]')
    const title = $(_title).text().replace(/\s+/g, " ").trim();
    const _predict = $(_resultados).find('p')
    const predict = $(_predict).text().replace(/\s+/g, " ").trim();

    return res.status(201).send({ sign, title, predict })

  });

}

exports.lovecalc = async function(req, res) {
    var n1 = req.query.n1;
    var n2 = req.query.n2;
    if(!n1)return res.send({error:true, 'message':'n1 and n2 paremeter is required'});
    if(!n2)n2='Amadeus'

    return rp(`https://calculador.acierta.me/?n1=${n1}&n2=${n2}&v=1`).then(html => {
        const dom = new JSDOM(html);
        const $ = require('jquery')(dom.window);
        const _x = $.find('div[class="text-center "]');
        const x=$(_x)[0];
        const _imagen=$(x).find('img');                
        const imagen=$(_imagen).attr('src');       
        return res.send({imagen})
    });
    
}