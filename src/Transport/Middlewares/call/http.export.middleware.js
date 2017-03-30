const http = require('http')
const logger = require('./../../../Log/Logger')

let _httpExport = function (xMessageParam, next, end, xyz) {
  let requestConfig = xMessageParam.requestConfig
  let responseCallback = xMessageParam.responseCallback

  let postData = requestConfig.json
  delete requestConfig.json
  requestConfig['Content-Length'] = Buffer.byteLength(String(postData))
  requestConfig['Content-Type'] = 'application/json'

  let req
  if (responseCallback) {
    req = http.request(requestConfig, (res) => {
      let body = []

      res.on('data', (chunck) => {
        body.push(chunck)
      })

      res.on('end', () => {
        let err = (parseInt(res.statusCode / 100) === 2 ? null : http.STATUS_CODES[res.statusCode])
        responseCallback(err, JSON.parse(body), res)
      })
    })
  } else {
    req = http.request(requestConfig)
  }

  req.on('error', (e) => {
    if (responseCallback) {
      responseCallback(e, null, null)
    }
  })

  req.write(JSON.stringify(postData))
  req.end()
  end()
}

module.exports = _httpExport
