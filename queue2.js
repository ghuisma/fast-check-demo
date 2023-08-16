/**
 * The code under test
 *
 * Its purpose is to wrap an asynchronous function and queue subsequent calls to it in two ways:
 *
 * 1. Promises returned by the function will resolve in order, with the first call resolving before the second one,
 *    the second one resolving before the third one, and so on.
 * 2. Concurrent calls are not allowed, meaning that a call will always wait for the previously started one to finish
 *    before being fired.
 *
 * @param {Promise<any>} fn
 * @returns {Promise<any>}
 */
function queue2(fun) {
    let lastQuery = Promise.resolve();
    return (...args) => {
        const currentQuery = fun(...args);
        const returnedQuery = lastQuery.then(() => currentQuery);
        lastQuery = currentQuery;
        return returnedQuery;
    };
}

module.exports = {
    queue2,
};
