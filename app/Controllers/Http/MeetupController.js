'use strict'
const Meetup = use('App/Models/Meetup')
const Subscription = use('App/Models/Subscription')
const Database = use('Database')
class MeetupController {
  async index () {
    // const meetups = await Meetup.query()
    //   .withCount('subscriptions')
    //   .with('preferences')
    //   .with('subscriptions')
    //   .orderBy('event_date', 'asc')
    //   .fetch()

    // const meetups = await Database.raw(
    //   'select count(s.id) qtd ,m.id from meetups m left join  subscriptions s on s.meetup_id=m.id where m.id=6 and s.user_id=1 group by m.id'
    // )
    // const meetups = await Meetup.query()
    //   .withCount('subscriptions')
    //   .with('preferences')
    //   .with('subscriptions')
    //   .orderBy('event_date', 'asc')
    //   .fetch()
    // return meetups

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
    // .fetch()
    return meetups
  }

  async filter ({ params, auth, response }) {
    // const meetups = await Meetup.query()
    //   .with('subscriptions')
    //   .where('title', 'LIKE', `%${params.id}%`)
    //   .orderBy('event_date', 'asc')
    //   .fetch()
    // return meetups
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
        'where title like' +
        `'%${params.id}%'` +
        '' +
        ' group by id,title,image , registered ,subscriptions'
    )
    return meetups
    // const meetups = await Database.select(
    //   'meetups.id',
    //   'title',
    //   'description',
    //   'image',
    //   'place',
    //   'event_date',
    //   'numLimitSubscriptions'
    // )
    //   .from('meetups')
    //   .leftJoin('subscriptions', 'meetups.id', 'subscriptions.meetup_id')
    //   // .leftJoin('subscriptions as b', { 'b.user_id': 17, 's.meetup_id': 'm.id' })

    // // .count('b.id as inscrito')

    //   .count('subscriptions.user_id as inscritos')
    //   .groupByRaw('meetups.id')
    // //, title,description,image,place,event_date
    // return meetups

    // const meetups = await Meetup.query()
    //   // .whereDoesntHave('subscriptions', (builder) => {
    //   //   builder.where('user_id', auth.current.user.id)
    //   // })
    //   .with('subscriptions', (builder) => {
    //     builder.where('user_id', auth.current.user.id)
    //   })
    //   .withCount('subscriptions')
    //   .orderBy('event_date', 'asc')
    //   .fetch()
    // return meetups
  }

  async unsigned ({ auth, response }) {
    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', (builder) => {
        builder.where('user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups

    // const meetups = await Database.raw(
    //   'Select id,title,image,description,event_date,place ,subscriptions, registered ' +
    //     'from Meetups m left join ' +
    //     '(select s.user_id,s.meetup_id,count(*) registered from Subscriptions s ' +
    //     'left join users u on s.user_id=u.id ' +
    //     'where s.user_id not in(' +
    //     `${auth.current.user.id}` +
    //     ') group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
    //     'left join ' +
    //     '(select j.meetup_id,count(*) subscriptions from Subscriptions j ' +
    //     'group by j.meetup_id)j on j.meetup_id=m.id ' +
    //     ' group by id,title,image , registered ,subscriptions'
    // )
    // return meetups
  }

  async signed ({ auth, response }) {
    const meetups = await Meetup.query()
      .whereHas('subscriptions', (builder) => {
        builder.where('subscriptions.user_id', auth.current.user.id)
      })
      .withCount('subscriptions')
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups
    // const meetups = await Database.raw(
    //   'Select id,title,image,description,event_date,place ,subscriptions, registered ' +
    //     'from Meetups m left join ' +
    //     '(select s.user_id,s.meetup_id,count(*) registered from Subscriptions s ' +
    //     'left join users u on s.user_id=u.id ' +
    //     'where s.user_id  in(' +
    //     `${auth.current.user.id}` +
    //     ') group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
    //     'left join ' +
    //     '(select j.meetup_id,count(*) subscriptions from Subscriptions j ' +
    //     'group by j.meetup_id)j on j.meetup_id=m.id ' +
    //     ' group by id,title,image , registered ,subscriptions'
    // )
    // return meetups
  }

  async recommended ({ auth }) {
    const subquery = await Database.from('preference_user')
      .where('user_id', auth.current.user.id)
      .select('preference_id as id')
      .map((e) => e.id)

    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', (builder) => {
        builder.where({ user_id: auth.current.user.id })
      })
      .withCount('subscriptions')
      .whereHas('preferences', (builder) => {
        builder.whereIn('preferences.id', subquery)
      })
      .orderBy('event_date', 'asc')
      .fetch()
    return meetups
  }

  async store ({ request, auth, response }) {
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
      const meetup = await Meetup.create({ user_id: auth.user.id, ...data })
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
    const meetup_registered = {
      meetup: meetup,
      registered: !!registered
    }

    return meetup_registered

    // const meetup = await Database.raw(
    //   'Select id,title,image,description,event_date,place ,subscriptions, registered ' +
    //     'from Meetups m left join ' +
    //     '(select s.user_id,s.meetup_id,count(*) registered from Subscriptions s ' +
    //     'left join users u on s.user_id=u.id ' +
    //     'where s.user_id = 17 group by s.user_id,s.meetup_id)p on p.meetup_id=m.id ' +
    //     'left join ' +
    //     '(select j.meetup_id,count(*) subscriptions from Subscriptions j ' +
    //     'group by j.meetup_id)j on j.meetup_id=m.id ' +
    //     'where id = ' +
    //     `'${params.id}'` +
    //     '' +
    //     ' group by id,title,image , registered ,subscriptions'
    // )
    // return meetup
  }
}

module.exports = MeetupController
