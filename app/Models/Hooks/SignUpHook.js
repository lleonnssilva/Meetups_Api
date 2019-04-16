'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewSignUpMail')
const SignUpHook = (exports = module.exports = {})

SignUpHook.sendMailSignUp = async userInstance => {
  console.tron.log('sendMailSignUp')
  if (!userInstance.user_id && !userInstance.dirty.user_id) {
    return
  }

  const { email, username } = await userInstance.users().fetch()

  Kue.dispatch(
    Job.key,
    {
      email,
      username
    },
    { attempts: 3 }
  )
}
