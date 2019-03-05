'use strict'
const Antl = use('Antl')
class User {
  get validateAll () {
    return true
  }
  get messages () {
    return Antl.list('validation')
  }
  get rules () {
    return {
      // username: 'required|unique:users',
      // email: 'required|email|unique:users',
      // password: 'required|confirmed'
    }
  }
}

module.exports = User
