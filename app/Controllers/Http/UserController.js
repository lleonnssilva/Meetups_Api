'use strict'
const User = use('App/Models/User')

class UserController {
  async index ({ request }) {
    const users = await User.query()
      .with('preferences')
      .fetch()
    return users
  }
  async store ({ request, response }) {
    try {
      const { preferences, ...data } = request.only([
        'username',
        'email',
        'password',
        'preferences'
      ])
      const user = await User.create(data)

      if (preferences && preferences.length > 0) {
        await user.preferences().attach(preferences)
      }
      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao se cadastrar!!' } })
    }
  }
  async update ({ params, request, auth, response }) {
    try {
      const user = await User.findOrFail(auth.current.user.id)
      const { preferences, ...data } = request.only([
        'username',
        'email',
        'password',
        'preferences'
      ])

      user.merge(data)
      await user.save()

      if (preferences && preferences.length > 0) {
        await user.preferences().sync(preferences)
        await user.load('preferences')
      }
      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao salvar os dados!!' } })
    }
  }
}

module.exports = UserController
