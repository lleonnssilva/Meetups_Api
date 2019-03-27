'use strict'
const User = use('App/Models/User')

class UserController {
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
  async update ({ request, auth, response }) {
    try {
      const user = await User.findOrFail(auth.current.user.id)
      const { preferences, ...data } = request.only([
        'username',
        'password',
        'preferences'
      ])

      user.merge(data)
      await user.save()

      await user.preferences().sync(preferences)
      // await user.load('preferences')

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao salvar os dados!!' } })
    }
  }
  async preferences ({ request, auth, response }) {
    try {
      const user = await User.findOrFail(auth.current.user.id)
      const { preferences, ...data } = request.only(['preferences'])

      user.merge(data)
      await user.save()

      await user.preferences().sync(preferences)

      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: err } })
    }
  }
  async show ({ auth }) {
    const user = await User.query()
      .where('id', auth.current.user.id)
      .with('preferences')
      .fetch()
    return user
  }
}

module.exports = UserController
