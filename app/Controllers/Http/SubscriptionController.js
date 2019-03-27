'use strict'
const Subscription = use('App/Models/Subscription')
const Meetup = use('App/Models/Meetup')
class SubscriptionController {
  async store ({ params, auth, response }) {
    try {
      const subscription = {
        user_id: auth.current.user.id,
        meetup_id: params.id
      }
      await Subscription.create(subscription)

      const meetup = await Meetup.query()
        .where('id', params.id)
        .withCount('subscriptions')
        .first()

      const registered = await Subscription.query()
        .where('meetup_id', params.id)
        .where('user_id', auth.user.id)
        .first()

      const subscriptions = {
        meetup: meetup,
        registered: !!registered
      }

      return subscriptions
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }
}

module.exports = SubscriptionController
