'use strict'
const Mail = use('Mail')
class NewSignUpMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewSignUpMail-job'
  }
  async handle ({ email, username }) {
    await Mail.send(
      ['emails.new_signUp'],
      {
        email,
        username
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

module.exports = NewSignUpMail
