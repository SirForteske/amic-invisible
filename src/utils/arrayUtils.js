// Barreja un array modificant-lo directament
const shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Genera un índex aleatori
        const j = Math.floor(Math.random() * (i + 1));

        // Intercanvia elements array[i] i array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array; // Retorna l'array barrejat
}

// Barreja un array sense modificar l'original
const shuffleArrayCopy = function (array) {
    const copy = [...array]; // Crea una còpia de l'array
    return shuffleArray(copy);
}

// Obté un element aleatori d'un array
const getRandomElement = function (array) {
    if (array.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

module.exports = { shuffleArray, shuffleArrayCopy, getRandomElement };