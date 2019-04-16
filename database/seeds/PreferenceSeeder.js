'use strict'

/*
|--------------------------------------------------------------------------
| PreferenceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')
class PreferenceSeeder {
  async run () {
    const preferences = await Database.table('preferences')
    if (preferences.length === 0) {
      await Database.from('preferences').insert([
        { title: 'Front-end' },
        { title: 'Back-end' },
        { title: 'Mobile' },
        { title: 'DevOps' },
        { title: 'Gestão e Marketing' }
      ])
    }
  }
}

module.exports = PreferenceSeeder

// await Factory.model('App/Models/Preference').createMany(
//   {
//     title: '1',
//     checked: false
//   },
//   { title: '2', checked: false }
// )
