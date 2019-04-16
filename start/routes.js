'use strict'
const Route = use('Route')

Route.post('sessions', 'SessionController.store').validator('Session')
Route.post('users', 'UserController.store').validator('User')
Route.get('/files/:id', 'FileController.show')
Route.group(() => {
  Route.get('users/profile', 'UserController.show')
  Route.put('users/preferences', 'UserController.preferences')

  Route.get('meetups/filter/:criterio/:page/', 'MeetupController.filter')
  Route.get('meetups/unsigned/:id', 'MeetupController.unsigned')
  Route.get('meetups/signed/:id', 'MeetupController.signed')
  Route.get('meetups/recommended/:id', 'MeetupController.recommended')
  Route.get('meetups/:id', 'MeetupController.show')
  Route.post('meetups', 'MeetupController.store').validator('Meetup')

  Route.post('subscriptions/:id', 'SubscriptionController.store').validator(
    'Subscription'
  )
  Route.get('preferences', 'PreferenceController.index')

  Route.post('/files', 'FileController.store')
  Route.put('users', 'UserController.update')
}).middleware(['auth'])
