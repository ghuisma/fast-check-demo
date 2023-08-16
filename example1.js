/**
 * ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a simple letter substitution cipher
 * that replaces a letter with the 13th letter after it in the latin alphabet.
 * ROT13 is a special case of the Caesar cipher which was developed in ancient Rome.
 *
 * For more information, see https://en.wikipedia.org/wiki/ROT13
 *
 * @param {string} message
 */
const rot13 = (message) =>
    message
        .split("")
        .map((char) => {
            const charCode = char.charCodeAt(0);
            // a-z
            if (charCode >= 97 && charCode <= 122) {
                return String.fromCharCode(97 + ((charCode - 97 + 13) % 26));
            }
            // A-Z
            if (charCode >= 65 && charCode <= 90) {
                return String.fromCharCode(65 + ((charCode - 65 + 13) % 26));
            }
            // not a letter
            return char;
        })
        .join("");

module.exports = {
    rot13,
};
