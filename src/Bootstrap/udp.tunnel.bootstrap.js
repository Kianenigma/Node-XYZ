/** @module bootstrapFunctions */

const _udpEvent = require('./../Transport/Middlewares/call/udp.receive.event')
const _udpExport = require('./../Transport/Middlewares/call/udp.export.middleware')

/**
 * Will create a new UDP tunnel over a given route and port.
 * @method _udpTunnel
 * @param  {Object}   xyz   the automatically injected paramter referring to the current xyz instance.
 * @param  {Object}   config An object with two keys:
 * - `config.route`: the route used in both sending side and in the server.
 * - `config.port`: port of the server to create. Note that no ther server should exist in this port.
 */
function _udpTunnel (xyz, config) {
  config = config || {}
  let route = config.route || 'UDP_CALL'
  let port = config.port || xyz.id().port + 1000

  const logger = xyz.logger

  // server side
  xyz.registerServer('UDP', port)
  xyz.registerServerRoute(port, route)
  xyz.middlewares().transport.server(route)(port).register(0, _udpEvent)

  // client side
  xyz.registerClientRoute(route)
  xyz.middlewares().transport.client(route).register(0, _udpExport)

  logger.info(`UDP TUNNEL :: Udp tunnel created with route ${route} | port ${port}`)
}

module.exports = _udpTunnel