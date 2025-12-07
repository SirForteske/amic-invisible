const shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Genera un índex aleatori
        const j = Math.floor(Math.random() * (i + 1));

        // Intercanvia elements array[i] i array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = { shuffleArray };