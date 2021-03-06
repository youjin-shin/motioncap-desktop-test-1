/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */
/**************************/
// Dispatcher
/**************************/

function Dispatcher () {
  var event_listeners = {

  }

  function on (type, listener) {
    if (!(type in event_listeners)) {
      event_listeners[type] = []
    }
    var listeners = event_listeners[type]
    listeners.push(listener)
  }

  function fire (type) {
    var args = Array.prototype.slice.call(arguments)
    args.shift()
    var listeners = event_listeners[type]
    // console.log(type)
    if (!listeners) return
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      listener.apply(listener, args)
    }
  }

  this.on = on
  this.fire = fire
}

export { Dispatcher }
