'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Subscription extends Model {
  static boot () {
    super.boot()
    this.addHook('afterCreate', 'SubscriptionHook.sendMailSubscription')
  }

  users () {
    // return this.hasMany('App/Models/User')
    return this.belongsTo('App/Models/User')
  }
  meetup () {
    return this.belongsTo('App/Models/Meetup')
  }
}

module.exports = Subscription
