'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupPreferenceSchema extends Schema {
  up () {
    this.create('meetup_preference', (table) => {
      table.increments()
      table
        .integer('preference_id')
        .unsigned()
        .references('preferences.id')
        .index('preference_meetup_id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('meetup_id')
        .unsigned()
        .references('meetups.id')
        .index('meetup_id')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['preference_id', 'meetup_id'])
    })
  }

  down () {
    this.drop('meetup_preferences')
  }
}

module.exports = MeetupPreferenceSchema
