'use strict'
const Kue = use('Kue')
const Job = use('App/Jobs/NewSubscriptionMail')

const SubscriptionHook = (exports = module.exports = {})

SubscriptionHook.sendMailSubscription = async (subscriptionInstance) => {
//   if (!subscriptionInstance.user_id && !subscriptionInstance.dirty.user_id) {
//     return
//   }
//   const {
//     title,
//     numLimitSubscriptions,
//     description,
//     place,
//     image
//   } = await subscriptionInstance.meetup().fetch()
//   const { email, username } = await subscriptionInstance.users().fetch()
//   console.log(
//     email,
//     username,
//     title,
//     description,
//     numLimitSubscriptions,
//     place,
//     image
//   )
//   Kue.dispatch(
//     Job.key,
//     {
//       email,
//       username,
//       title,
//       description,
//       event_date,
//       numLimitSubscriptions,
//       place,
//       image
//     },
//     { attempts: 3 }
 // )
}
