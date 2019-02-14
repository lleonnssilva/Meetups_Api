'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PreferenceUser extends Model {
  preference () {
    return this.belongsToMany('App/Models/Preference')
  }
  users () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = PreferenceUser
