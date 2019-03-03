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

  async store ({ request, params, auth, response }) {
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
      // const meetups = await Database.raw(
      //   'Select id,title,image,description,event_date,place ,subscriptions, registered ' +
      //     'from Meetups m left join ' +
      //     '(select s.user_id,s.meetup_id,count(*) registered from Subscriptions s ' +
      //     'left join users u on s.user_id=u.id ' +
      //     'where s.user_id = 17 group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
      //     'left join ' +
      //     '(select j.meetup_id,count(*) subscriptions from Subscriptions j ' +
      //     'group by j.meetup_id)j on j.meetup_id=m.id ' +
      //     'where id = ' +
      //     `'${params.id}'` +
      //     '' +
      //     ' group by id,title,image , registered ,subscriptions'
      // )
      // return meetup
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao se increver no Meetup!!' } })
    }
  }
}

module.exports = SubscriptionController
