'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Meetup extends Model {
  preferences () {
    return this.belongsToMany('App/Models/Preference')
  }
  user () {
    return this.belongsTo('App/Models/User')
  }
  subscriptions () {
    // return this.belongsToMany('App/Models/Subscription')
    return this.hasMany('App/Models/Subscription')
  }
}

module.exports = Meetup
