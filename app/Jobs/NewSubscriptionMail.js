'use strict'
const Mail = use('Mail')
class NewSubscriptionMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewSubscriptionMail-job'
  }
  async handle ({
    email,
    username,
    title,
    numLimitSubscriptions,
    description,
    event_date,
    place,
    image
  }) {
    await Mail.send(
      ['emails.new_subscription'],
      {
        email,
        username,
        title,
        numLimitSubscriptions,
        description,
        event_date,
        place,
        image
      },
      message => {
        message
          .to(email)
          .from('leoguaruleo@gmail.com', 'Leonardo | dev')
          .subject('Inscrição em Meetup')
      }
    )
  }
}

module.exports = NewSubscriptionMail
