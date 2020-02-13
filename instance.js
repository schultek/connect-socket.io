
const platform = require('connect-platform');

/**
 * Collects all public nodes to be called via websockets
 */
function getSocketNodes() {
  let res = [];
  for (let [path, {
      signature
    }] of Object.entries(platform.core.registry.registrants)) {
    if (signature.public)
      res.push(signature);
  }
  return res;
}

let io = null;

exports.getInstance = function() {
  return io;
}

/**
 * Creates and launches a socket.io instance that calls nodes based on incoming messages.
 */
exports.setupSocketInstance = function (server) {
  // create a socket.io server instance
  io = require("socket.io")(server);

  // collect all public nodes
  let nodes = getSocketNodes();
  let config = platform.config.get("socket-config") || {};
  let prefix = config["event-prefix"] || "";
  let pathMap = config["event-map"] || {};

  io.on('connection', (socket) => {

    console.log(socket.id)

    // helper function to build the inputs object and call a node
    let callNode = (path, params = {}) => {

      let fullPath = prefix + (pathMap[path] || path);

      let signature = nodes.find(n => n.path == fullPath);
      if (signature) {
        let inputs = {};
        if (signature.inputs) {
          for (let input of signature.inputs) {
            if (params[input]) inputs[input] = params[input]
          }
        }

        // create a callable from the node instance and set the socket as context
        return platform.core.callable(() => platform.core.registry.instance(fullPath), {
          socket
        })(inputs)
      } else
        return Promise.reject("Cannot find socket node for path " + fullPath);
    }

    callNode("connect", {
      id: socket.id
    })
    .catch(err => console.warn(err))

    // optional node executed on disconnect
    // must have the 'on-socket-disconnect' config parameter set to a node path
    socket.on("disconnect", () => {
      callNode("disconnect", {
        id: socket.id
      })
      .catch(err => console.warn(err))
      
    })

    // register a middleware function to receive each sent message
    socket.use((packet) => {

      /*
          packet must be array of three parameters:
          1. node path: string
          2. input parameters: object
          3. result callback: function
      */

      if (typeof packet[0] != 'string')
        return;

      let callback = packet[2];

      callNode(packet[0], packet[1])
        .then(result => {

          if (typeof callback != "function") return

          if (result.output) {
            let r = {};
            r[result.output] = result.data;
            callback(r);
          } else if (result.control) {
            callback(result.control)
          } else {
            callback();
          }
        })

    });
  });
}