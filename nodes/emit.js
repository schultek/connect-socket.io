const platform = require('connect-platform');

/**
 * Broadcasts a message to all sockets in a room.
 */
platform.core.node({
    path: '/connect-socket.io/emit',
    public: false,
    method: 'GET',
    inputs: ['event', 'message'],
    outputs: [],
    controlOutputs: ["no_socket"],
    hints: {
      node: 'emits to the current socket',
      inputs: {
        event: 'the event id',
        message: 'the message to emit'
      },
      outputs: {},
      controlOutputs: {
        "no_socket": "the node call does not come from a websocket request"
      }
    }
  },
  (inputs, output, control, error, context) => {
    // socket context parameter must be set
    if (!context.socket) control("no_socket")
    else {
      socket.emit(inputs.event, inputs.message)
    }
  }
);