const platform = require('connect-platform');
const store = require("../lib/client-store")

/**
 * Removes a socket client parameter
 * This node is used to leverage the ongoing connection of a client to the server. Using the get/set nodes
 * information can be shared accross multiple execution rounds (or requests). 
 * TODO: Use a distributed key value store (eg. redis) to sync multiple container instances. For showcase purposes
 * this is currently only implemented in memory and therefore not shared accross instances.
 */ 
platform.core.node({
    path: '/connect-socket.io/remove',
    public: false,
    method: 'GET',
    inputs: ['key'],
    outputs: ['value'],
    controlOutputs: ["no_socket"],
    hints: {
      node: 'removes a client parameter for a socket.',
      inputs: {
        key: 'the key of the parameter to remove'
      },
      outputs: {
        value: 'the value corresponding to the key or undefined'
      },
      controlOutputs: {
        "no_socket": "the node call does not come from a websocket request"
      }
    }
  },
  (inputs, output, control, error, context) => {
    if (!context.socket) control("no_socket")
    else {
      output(store.remove(context.socket.id+":"+inputs.key))
    }
  }
);