'use strict'
const Antl = use('Antl')
class Meetup {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      title: 'required',
      place: 'required',
      description: 'required',
      event_date: 'date',
      image: 'required',
      preferences: 'required'
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Meetup
