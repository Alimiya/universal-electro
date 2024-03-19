const words = require('./pfiles/translations.json')

L = function(id, lang, word){
    if(!words[lang][id]) return word;
    return words[lang][id];
}

module.exports = {L}