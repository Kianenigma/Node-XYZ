let XYZ = require('xyz-core')
let mathMS = new XYZ({
  selfConf: {
    port: 10000,
    name: 'from-self-conf'
  },
  systemConf: {nodes: []}
})

mathMS.register('mul', (payload, response) => {
  response.send(payload.x * payload.y)
})

mathMS.register('add', (payload, response) => {
  response.send(payload.x + payload.y)
})

console.log(mathMS)
