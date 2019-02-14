'use strict'
const Meetup = use('App/Models/Meetup')
const Database = use('Database')
class MeetupController {
  async index () {
    const meetups = await Meetup.query()
      .withCount('subscriptions')
      .with('preferences')
      .with('subscriptions')
      .orderBy('event_date', 'asc')
      .fetch()

    return meetups
  }

  async unsigned ({ auth, response }) {
    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', (builder) => {
        builder.where('user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups
  }

  async signed ({ auth, response }) {
    const meetups = await Meetup.query()
      .whereHas('subscriptions', (builder) => {
        builder.where('subscriptions.user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups
  }

  async recommended ({ auth }) {
    const subquery = await Database.from('preference_user')
      .where('user_id', auth.current.user.id)
      .select('preference_id as id')
      .map((e) => e.id)

    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', (builder) => {
        builder.where({ user_id: auth.current.user.id })
      })
      .withCount('subscriptions')
      .whereHas('preferences', (builder) => {
        builder.whereIn('preferences.id', subquery)
      })
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups
  }

  async store ({ request, auth, response }) {
    const { preferences, ...data } = request.only([
      'title',
      'description',
      'place',
      'event_date',
      'image',
      'numLimitSubscriptions',
      'preferences'
    ])

    if (preferences && preferences.length > 0) {
      const meetup = await Meetup.create({ user_id: auth.user.id, ...data })
      await meetup.preferences().attach(preferences)
      await meetup.load('preferences')
      return meetup
    }
  }

  async update ({ params, request, auth, response }) {
    const meetup = await Meetup.findOrFail(params.id)

    const { preferences, ...data } = request.only([
      'title',
      'description',
      'place',
      'event_date',
      'image',
      'numLimitSubscriptions',
      'preferences'
    ])

    if (preferences && preferences.length > 0) {
      meetup.merge({ user_id: auth.user.id, ...data })
      await meetup.save()
      await meetup.preferences().sync(preferences)
      await meetup.load('preferences')
    }
    return meetup
  }

  async show ({ params, response }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .withCount('subscriptions')
      .with('preferences')
      .with('subscriptions')
      .fetch()

    if (meetup.pages == null) {
      return response.status(401).send({
        error: {
          message: 'Meetup não localizado!!.'
        }
      })
    }
    return meetup
  }
}

module.exports = MeetupController
