'use strict'

class SessionController {
  async store ({ response, request, auth }) {
    try {
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)

      return token
    } catch (err) {
      return response.status(err.status).send({
        error: { message: err }
      })
    }
  }
}

module.exports = SessionController
