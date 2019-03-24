'use strict'
const Meetup = use('App/Models/Meetup')
const Subscription = use('App/Models/Subscription')
const Database = use('Database')
const File = use('App/Models/File')
const Helpers = use('Helpers')
class MeetupController {
  async index () {
    const meetups = await Database.raw(
      'Select id,title,image ,inscritos, inscrito ' +
        'from Meetups m left join ' +
        '(select s.user_id,s.meetup_id,count(*) inscrito from Subscriptions s ' +
        'left join users u on s.user_id=u.id ' +
        'where s.user_id = 17 group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
        'left join ' +
        '(select j.meetup_id,count(*) inscritos from Subscriptions j ' +
        'group by j.meetup_id)j on j.meetup_id=m.id ' +
        'group by id,title,image , inscrito ,inscritos'
    )
    return meetups
  }

  async filter ({ params, auth, response }) {
    const meetups = await Database.raw(
      'Select id,title,image,description,event_date,place ,subscriptions, registered ' +
        'from Meetups m left join ' +
        '(select s.user_id,s.meetup_id,count(*) registered from Subscriptions s ' +
        'left join users u on s.user_id=u.id ' +
        'where s.user_id =  ' +
        `${auth.current.user.id}` +
        ' group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
        'left join ' +
        '(select j.meetup_id,count(*) subscriptions from Subscriptions j ' +
        'group by j.meetup_id)j on j.meetup_id=m.id ' +
        'where lower(title) like' +
        `'%${String(params.id)}%'` +
        '' +
        ' group by id,title,image , registered ,subscriptions'
    )
    return meetups
  }

  async unsigned ({ params, auth, response }) {
    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', builder => {
        builder.where('user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .paginate(params.page, 10)

    return meetups
  }

  async signed ({ params, auth, response }) {
    const meetups = await Meetup.query()
      .whereHas('subscriptions', builder => {
        builder.where('subscriptions.user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .paginate(params.page, 5)
    return meetups
  }

  async recommended ({ params, auth }) {
    const subquery = await Database.from('preference_user')
      .where('user_id', auth.current.user.id)
      .select('preference_id as id')
      .map(e => e.id)

    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', builder => {
        builder.where({ user_id: auth.current.user.id })
      })
      .withCount('subscriptions')
      .whereHas('preferences', builder => {
        builder.whereIn('preferences.id', subquery)
      })
      .orderBy('event_date', 'asc')
      .paginate(params.page, 5)
    return meetups
  }

  async store ({ request, auth, response }) {
    const { preferences, ...data } = request.only([
      'title',
      'description',
      'place',
      'image',
      'event_date',
      'numLimitSubscriptions',
      'preferences'
    ])
    const meetup = await Meetup.create({
      user_id: auth.user.id,
      ...data
    })
    if (preferences && preferences.length > 0) {
      await meetup.preferences().attach(preferences)
      await meetup.load('preferences')
      return meetup
    }
  }

  async update ({ params, request, auth, response }) {
    const meetup = await Meetup.findOrFail(params.id)

    const { preferences, ...data } = request.only([
      'title',
      'description',
      'place',
      'event_date',
      'image',
      'numLimitSubscriptions',
      'preferences'
    ])

    if (preferences && preferences.length > 0) {
      meetup.merge({ user_id: auth.user.id, ...data })
      await meetup.save()
      await meetup.preferences().sync(preferences)
      await meetup.load('preferences')
    }
    return meetup
  }

  async show ({ params, auth, response }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .withCount('subscriptions')
      .first()

    const registered = await Subscription.query()
      .where('meetup_id', params.id)
      .where('user_id', auth.user.id)
      .first()
    const meetups = {
      meetup: meetup,
      registered: !!registered
    }

    return meetups
  }
}

module.exports = MeetupController
