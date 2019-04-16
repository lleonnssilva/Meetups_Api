'use strict'
const Antl = use('Antl')
class Meetup {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      title: 'required',
      description: 'required',
      image: 'required',
      place: 'required',
      preferences: 'required',
      event_date: 'date'
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Meetup
