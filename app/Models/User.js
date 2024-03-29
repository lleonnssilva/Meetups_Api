'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()
    // this.addHook('afterCreate', 'SignUpHook.sendMailSignUp')
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  preferences () {
    return this.belongsToMany('App/Models/Preference')
  }
}

module.exports = User
