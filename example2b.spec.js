const { queue1 } = require("./queue1.js");
const fc = require("fast-check");

/**
 * In the context of race conditions, we want fast-check to provide us with a scheduler instance that is capable
 * of re-ordering asynchronous operations. This is why we added the fc.scheduler() argument: it creates an instance
 * of a scheduler that we refer to as s. The first important thing to keep in mind for our new test is that we don't
 * want to change the value returned by the API. But we want to change when it gets returned. We want to give the
 * scheduler the responsibility of resolving API calls. To achieve this, the scheduler exposes a method called scheduleFunction.
 * This method wraps a function in a scheduled or controlled version of itself.
 *
 * After pushing scheduled calls into the scheduler, we must execute and release them at some point.
 * This is typically done using waitAll or waitFor. These APIs simply wait for waitX to resolve,
 * indicating that what we were waiting for has been accomplished.
 */
test("should resolve in call order", async () => {
    await fc.assert(
        fc.asyncProperty(fc.scheduler(), async (s) => {
            // Arrange
            const pendingQueries = [];
            const seenAnswers = [];
            const call = jest
                .fn()
                .mockImplementation((v) => Promise.resolve(v));

            // Act
            const queued = queue1(s.scheduleFunction(call));
            pendingQueries.push(queued(1).then((v) => seenAnswers.push(v)));
            pendingQueries.push(queued(2).then((v) => seenAnswers.push(v)));
            await s.waitFor(Promise.all(pendingQueries));

            // Assert
            expect(seenAnswers).toEqual([1, 2]);
        })
    );
});
