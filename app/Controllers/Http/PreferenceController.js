'use strict'

const Preference = use('App/Models/Preference')
class PreferenceController {
  async index ({ request }) {
    const preferences = await Preference.all()
    return preferences
  }
}

module.exports = PreferenceController
