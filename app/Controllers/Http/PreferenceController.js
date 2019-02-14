'use strict'

const Preference = use('App/Models/Preference')
class PreferenceController {
  async index ({ request }) {
    const preferences = await Preference.all()
    return preferences
  }

  async store ({ request }) {
    const data = request.only(['title'])

    const preference = await Preference.create(data)

    return preference
  }
}

module.exports = PreferenceController
