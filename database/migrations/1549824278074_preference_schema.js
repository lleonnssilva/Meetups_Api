'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PreferenceSchema extends Schema {
  up () {
    this.create('preferences', (table) => {
      table.increments()
      table.string('title', 254)
      table.boolean('checked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('preferences')
  }
}

module.exports = PreferenceSchema
