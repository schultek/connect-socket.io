
/**
 * Key-Value store to leverate persistent websocket connections.
 * 
 * THIS IS ONLY A DEMO IMPLEMENTATION TO SHOW THE CONCEPT. NOT RECOMMENDED
 * FOR PRODUCTION. DOES NOT WORK WITH MULTIPLE INSTANCES. USE A DISTRIBUTED 
 * KEY-VALUE STORE LIKE REDIS.
 */

const store = {}

/**
 * Sets a value for a socket and key
 */
exports.set = (key, value) => {
    store[key] = value;
}

/**
 * Returns a value for a socket or key or undefined
 */
exports.get = (key) => {
    return store[key]
}

/**
 * Removes a key from a socket dictionary and returns the value or undefined.
 */
exports.remove = (key) => {
    let value = store[key]
    delete store[key]
    return value
}