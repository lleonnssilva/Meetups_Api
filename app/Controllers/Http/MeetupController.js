'use strict'
const Meetup = use('App/Models/Meetup')
const Subscription = use('App/Models/Subscription')
const Database = use('Database')

class MeetupController {
  async filter ({ params, response }) {
    try {
      const meetups = await Meetup.query()
        .where('title', 'LIKE', '%' + params.criterio + '%')
        .orderBy('created_at', 'desc')
        .withCount('subscriptions')
        .paginate(params.page, 20)
      return meetups
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }

  async unsigned ({ params, auth, response }) {
    try {
      // saber se usuário autenticado não está inscrito
      const meetups = await Meetup.query()
        .whereDoesntHave('subscriptions', builder => {
          builder.where('user_id', auth.current.user.id)
        })

        // pegar total de inscritos
        .withCount('subscriptions')
        .orderBy('event_date', 'asc')
        .paginate(params.id, 5)

      return meetups
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }

  async signed ({ params, auth, response }) {
    try {
      // saber se usuário autenticado está inscrito
      const meetups = await Meetup.query()
        .whereHas('subscriptions', builder => {
          builder.where('subscriptions.user_id', auth.current.user.id)
        })

        // pegar total de inscritos
        .withCount('subscriptions')
        .orderBy('event_date', 'desc')
        .paginate(params.id, 5)
      return meetups
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }

  async recommended ({ params, auth, response }) {
    try {
      // preferências do usuário autenticado
      const subquery = await Database.from('preference_user')
        .where('user_id', auth.current.user.id)
        .select('preference_id as id')
        .map(e => e.id)

      // saber se usuário autenticado não está inscrito
      const meetups = await Meetup.query()
        .whereDoesntHave('subscriptions', builder => {
          builder.where({ user_id: auth.current.user.id })
        })

        // pegar total de inscritos
        .withCount('subscriptions')
        .whereHas('preferences', builder => {
          builder.whereIn('preferences.id', subquery)
        })
        .orderBy('event_date', 'desc')
        .paginate(params.id, 5)
      return meetups
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }

  async store ({ request, auth, response }) {
    try {
      const { preferences, ...data } = request.only([
        'title',
        'description',
        'place',
        'image',
        'event_date',
        'numLimitSubscriptions',
        'preferences'
      ])
      const meetup = await Meetup.create({
        user_id: auth.user.id,
        ...data
      })

      await meetup.preferences().attach(preferences)
      return meetup
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }

  async show ({ params, auth, response }) {
    try {
      // Pegar dados do meetup
      // pegar total de inscritos
      const meetup = await Meetup.query()
        .where('id', params.id)
        .withCount('subscriptions')
        .first()

      // saber se usuário autenticado está inscrito no meetup
      const registered = await Subscription.query()
        .where('meetup_id', params.id)
        .where('user_id', auth.user.id)
        .first()
      const meetups = {
        meetup: meetup,
        registered: !!registered
      }

      return meetups
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }
}

module.exports = MeetupController
