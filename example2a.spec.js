const { queue1 } = require("./queue1");

/**
 * Simple test to ensure that queries will consistently resolve in the correct order.
 */
it("should resolve in call order", async () => {
    // Arrange
    const seenAnswers = [];
    const call = jest.fn().mockImplementation((v) => Promise.resolve(v));

    // Act
    const queued = queue1(call);
    await Promise.all([
        queued(1).then((v) => seenAnswers.push(v)),
        queued(2).then((v) => seenAnswers.push(v)),
    ]);

    // Assert
    expect(seenAnswers).toEqual([1, 2]);
});

/**
 * The test above has some limitations. Among them we have the fact that the fake API we defined always resolve instantly.
 * It has one downside: without any queue, calling call(1) and then call(2) would also pass the test.
 * Indeed, when calling call(1) it would produce a new promise being Promise.resolve(1).
 * Instantly created, instantly resolved and instantly watched via .then((v) => seenAnswers.push(v)).
 * In other words, as soon as we give back the hand to JavaScript runtime, the continuation will be called.
 * The one registered immediately after when calling call(2) will have to wait its turn as it has been queued after it.
 *
 * While the test we just examined is a good starting point, it comes with some limitations.
 * Specifically, the fake API we established in the test instantly resolves queries.
 * As a result, it does not account for scenarios where we have multiple calls to call that need to be queued.
 * For instance, if we were to call call(1) followed by call(2) without any queue, the test would still pass.
 * This is because call(1) produces a new promise that resolves immediately, which is then instantly followed by
 * .then((v) => seenAnswers.push(v)).
 * Once the JavaScript runtime relinquishes control, the continuation of call(1) is immediately called.
 * Consequently, the continuation registered during the call to call(2) will wait until the continuation of call(1) ends.
 *
 * In order to address this limitation, our updated test should ensure that promises resolve later rather than instantly.
 */
