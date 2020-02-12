const platform = require('connect-platform');

/**
 * Broadcasts a message to all sockets in a room.
 */
platform.core.node({
    path: '/connect-socket.io/emit',
    public: false,
    method: 'GET',
    inputs: ['room', 'event', 'message'],
    outputs: [],
    controlOutputs: ["no_socket"],
    hints: {
      node: 'broadcasts to a room.',
      inputs: {
        room: 'the room that shall be emitted to',
        event: 'the event id to use',
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
      // use socket.io api for broadcasting
      // TODO: use message queue (pub / sub) architecture (e.g. redis) to support multiple instances
      socket.to(inputs.room).emit(inputs.event, inputs.message)
    }
  }
);