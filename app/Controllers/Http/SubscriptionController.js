'use strict'
const Subscription = use('App/Models/Subscription')
const Meetup = use('App/Models/Meetup')
class SubscriptionController {
  async index () {
    const subscriptions = await Subscription.query()
      .with('users')
      .fetch()
    return subscriptions
  }

  async store ({ params, auth, response }) {
    try {
      const data = { user_id: auth.current.user.id, meetup_id: params.id }
      const subscription = await Subscription.create(data)

      const meetup = await Meetup.query()
        .where('id', params.id)
        .withCount('subscriptions')
        .first()

      const registered = await Subscription.query()
        .where('meetup_id', params.id)
        .where('user_id', auth.user.id)
        .first()

      const meetup_registered = {
        meetup: meetup,
        registered: !!registered
      }

      return meetup_registered
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Algo deu errado ao se increver no Meetup!!' }
      })
    }
  }
}

module.exports = SubscriptionController
