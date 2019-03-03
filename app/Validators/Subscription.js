'use strict'
const Antl = use('Antl')
class Subscription {
  get validateAll () {
    return true
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Subscription
