const fc = require("fast-check");
const { rot13 } = require("./example1");

describe("rot13", () => {
    /**
     * "Because there are 26 letters (2*13) in the basic Latin alphabet,
     * ROT13 is its own inverse; that is; to undo ROT13, the same algorithm is applied."
     */
    it("Property 1: reciprocal cipher", () => {
        fc.assert(
            fc.property(fc.string(), (message) => {
                return rot13(rot13(message)) === message;
            })
        );
    });

    // for demonstration purposes, an incorrect property.
    it.skip("example failure", () => {
        fc.assert(
            fc.property(fc.string(), (message) => {
                return rot13(message) === message;
            }),
            { verbose: 2 }
        );
    });

    /**
     * Of course, this one property is not enough! We could simply write a rot13 implementation that just
     * returns the input message directly. What other properties can we think of that we can write a test for?
     */
    it.todo("Property 2: ***");
});
