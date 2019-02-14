'use strict'
const Route = use('Route')
Route.get('preferences', 'PreferenceController.index')
Route.get('users', 'UserController.index')

Route.post('users', 'UserController.store').validator('User')
Route.get('meetups', 'MeetupController.index')
Route.get('subscriptions', 'SubscriptionController.index')

Route.post('sessions', 'SessionController.store')
Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.get('/files/:id', 'FileController.show')

Route.group(() => {
  Route.post('subscriptions', 'SubscriptionController.store').validator(
    'Subscription'
  )
  Route.post('preferences', 'PreferenceController.store').validator(
    'Preference'
  )
  Route.put('users', 'UserController.update').validator('User')
  Route.post('/files', 'FileController.store')

  Route.get('meetups/unsigned', 'MeetupController.unsigned')
  Route.get('meetups/signed', 'MeetupController.signed')
  Route.get('meetups/recommended', 'MeetupController.recommended')
  Route.get('meetups/:id', 'MeetupController.show')
  Route.put('meetups/:id', 'MeetupController.update').validator('Meetup')
  Route.post('meetups', 'MeetupController.store').validator('Meetup')
}).middleware(['auth'])
