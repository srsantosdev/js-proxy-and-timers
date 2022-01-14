'use strict'

const Event = require('events')

const event = new Event()
const eventName = 'counter'
event.on(eventName, msg => console.log('counter updated', msg))

const myCounter = {
  counter: 0,
}

const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] })
    target[propertyKey] = newValue
    return true
  },
  get: (object, prop) => {
    return object[prop]
  }
})

// continua executando sempre
setInterval(function () {
  console.log('[4]: setInterval')
  proxy.counter += 1

  if (proxy.counter === 10) {
    clearInterval(this)
  }
}, 1000)

// se quer que execute no futuro
setTimeout(() => {
  proxy.counter = 4
  console.log('[3]: setTimeout')
}, 100)

// se quer que execute agora
setImmediate(() => {
  console.log('[2]: setImmediate', proxy.counter)
})

// executa exatamente agora mas acaba com o ciclo de vida do node
process.nextTick(() => {
  proxy.counter = 2
  console.log('[1]: process.nextTick')
})