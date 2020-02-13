const platform = require('connect-platform');

/**
 * Emits a message to a socket.
 */
platform.core.node({
    path: '/connect-socket.io/emit',
    public: false,
    method: 'GET',
    inputs: ['event', 'message'],
    outputs: ["response"],
    controlOutputs: ["no_socket"],
    hints: {
      node: 'emits to the current socket',
      inputs: {
        event: 'the event id',
        message: 'the message to emit'
      },
      outputs: {
        response: "the socket response"
      },
      controlOutputs: {
        no_socket: "the node call does not come from a websocket request"
      }
    }
  },
  (inputs, output, control, error, context) => {
    // socket context parameter must be set
    if (!context.socket) control("no_socket")
    else {
      context.socket.emit(inputs.event, inputs.message, (response) => output("response", response))
    }
  }
);