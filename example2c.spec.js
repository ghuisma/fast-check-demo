const { queue2 } = require("./queue2.js");
const fc = require("fast-check");

test("should resolve in call order", async () => {
    await fc.assert(
        fc.asyncProperty(
            fc.scheduler(),
            fc.integer({ min: 1, max: 10 }),
            async (s, numCalls) => {
                // Arrange
                const pendingQueries = [];
                const seenAnswers = [];
                const expectedAnswers = [];
                const call = jest
                    .fn()
                    .mockImplementation((v) => Promise.resolve(v));

                // Act
                const queued = queue2(s.scheduleFunction(call));
                for (let id = 0; id !== numCalls; ++id) {
                    expectedAnswers.push(id);
                    pendingQueries.push(
                        queued(id).then((v) => seenAnswers.push(v))
                    );
                }
                await s.waitFor(Promise.all(pendingQueries));

                // Assert
                expect(seenAnswers).toEqual(expectedAnswers);
            }
        )
    );
});
