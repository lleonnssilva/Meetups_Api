'use strict'
const Subscription = use('App/Models/Subscription')
class SubscriptionController {
  async index () {
    const subscriptions = await Subscription.query()
      .with('users')
      .fetch()
    return subscriptions
  }

  async store ({ request, auth, response }) {
    try {
      const data = request.only(['meetup_id'])
      data.user_id = auth.current.user.id
      const subscription = await Subscription.create(data)

      return subscription
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao se increver no Meetup!!' } })
    }
  }
}

module.exports = SubscriptionController
