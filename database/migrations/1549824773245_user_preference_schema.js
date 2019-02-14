'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPreferenceSchema extends Schema {
  up () {
    this.create('preference_user', (table) => {
      table.increments()
      table
        .integer('preference_id')
        .unsigned()
        .references('preferences.id')
        .index('preference_id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .index('user_id')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['preference_id', 'user_id'])
    })
  }

  down () {
    this.drop('user_preferences')
  }
}

module.exports = UserPreferenceSchema
