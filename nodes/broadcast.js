const platform = require('connect-platform');
const {getInstance} = require('../instance');
/**
 * Broadcasts a message to all connected sockets.
 */
platform.core.node({
    path: '/connect-socket.io/broadcast',
    public: false,
    method: 'GET',
    inputs: ['event', 'message'],
    outputs: [],
    controlOutputs: ["emitted", "no_instance"],
    hints: {
      node: 'broadcasts a message to all sockets',
      inputs: {
        event: 'the event id',
        message: 'the message to broadcast'
      },
      outputs: {},
      controlOutputs: {
        emitted: "the event was emitted successfully",
        no_insatnce: "no socket.io instance set up"
      }
    }
  },
  (inputs, output, control) => {
    
    let io = getInstance()
    if (!io) {
      control("no_instance")
    } else {
      io.emit(inputs.event, inputs.message)
      control("emitted")
    }

  }
);