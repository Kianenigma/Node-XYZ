const http = require('http')

/**
 * will broadcast a message regardless of the path to all nodes.
 * @method braodcastLocal
 * @param  {Array}       params [description]
 * @param  {Function}     next   used to call the next middleware
 * @param  {Function}     done   used to end the middleware stack
 * @param  {Object}       xyz    reference to the caller's xyz instance
 */
function _broadcastGlobal (params, next, done, xyz) {
  let servicePath = params[0].servicePath
  let userPayload = params[0].payload
  let responseCallback = params[1]
  let route = params[0].route
  let redirect = params[0].redirect

  let foreignNodes = xyz.serviceRepository.foreignNodes
  let transport = xyz.serviceRepository.transport
  let logger = xyz.logger
  const wrapper = xyz.Util.wrapper

  let wait = 0
  let calls = []
  let responses = {}

  let matches
  const HOST = xyz.id().host
  for (let node in foreignNodes) {
    calls.push({ match: servicePath, node: node })
  }

  logger.verbose(`${wrapper('bold', 'BROADCAST GLOBAL')} :: sending message to ${calls.map((o) => o.node + ':' + o.match)},  `)

  for (let call of calls) {
    if (responseCallback) {
      transport.send({
        route: route,
        node: call.node,
        redirect: redirect,
        payload: {
          userPayload: userPayload,
          service: call.match}},
      function (_call, err, body, response) {
        responses[`${_call.node}:${_call.match}`] = [err, body]
        wait += 1
        if (wait === calls.length) {
          responseCallback(null, responses)
        }
      }.bind(null, call))
    } else {
      transport.send({
        route: route,
        node: call.node,
        redirect: redirect,
        payload: {
          userPayload: userPayload,
          service: call.match}})
    }
  }

  // if no node matched
  if (!calls.length) {
    logger.warn(`BROADCAST LOCAL :: Sending a message to ${servicePath} from failed (Local Response)`)
    if (responseCallback) {
      responseCallback(http.STATUS_CODES[404], null, null)
    }
  }
}

module.exports = _broadcastGlobal
