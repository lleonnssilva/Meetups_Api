'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupSchema extends Schema {
  up () {
    this.create('meetups', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .string('title', 254)
        .notNullable()
        .unique()
      table
        .integer('numLimitSubscriptions')
        .unsigned()
        .notNullable()
      table.string('description', 254).notNullable()
      table.string('place', 254).notNullable()
      table.timestamp('event_date').notNullable()
      table.string('image').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('meetups')
  }
}

module.exports = MeetupSchema
