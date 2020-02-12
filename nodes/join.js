const platform = require('connect-platform');

/**
 * Subscribes the current socket to a room.
 */
platform.core.node({
    path: '/connect-socket.io/join',
    public: false,
    method: 'GET',
    inputs: ['room'],
    outputs: [],
    controlOutputs: ["no_socket", "joined"],
    hints: {
      node: 'joins a room.',
      inputs: {
        room: 'the room that shall be joined',
      },
      outputs: {},
      controlOutputs: {
        "joined": "the node successfully joined the room",
        "no_socket": "the node call does not come from a websocket request"
      }
    }
  },
  (inputs, output, control, error, context) => {
    // socket context parameter must be set
    if (!context.socket) control("no_socket")
    else {
      // use socket.io api for subscribing
      // TODO: use message queue (pub / sub) architecture (e.g. redis) to support multiple instances
      context.socket.join(inputs.room)
      control("joined")
    }
  }
);