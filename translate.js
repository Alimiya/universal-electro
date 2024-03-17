const words = require('./pfiles/translations.json')

L = function(id, lang, word){
    
    return words[lang][id];
}

module.exports = {L}