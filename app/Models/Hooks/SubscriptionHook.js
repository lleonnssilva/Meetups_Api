'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewSubscriptionMail')
const SubscriptionHook = (exports = module.exports = {})

SubscriptionHook.sendMailSubscription = async (subscriptionInstance) => {
  if (!subscriptionInstance.user_id && !subscriptionInstance.dirty.user_id) {
    return
  }
  const {
    title,
    numLimitSubscriptions,
    description,
    place,
    event_date,
    image
  } = await subscriptionInstance.meetup().fetch()
  const { email, username } = await subscriptionInstance.users().fetch()

  Kue.dispatch(
    Job.key,
    {
      email,
      username,
      title,
      description,
      numLimitSubscriptions,
      place,
      event_date,
      image
    },
    { attempts: 3 }
  )
}
