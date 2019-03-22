'use strict'
const Route = use('Route')
Route.get('preferences', 'PreferenceController.index')
Route.get('users', 'UserController.index')

// Route.post('users', 'UserController.store').validator('User')
Route.get('meetups', 'MeetupController.index')
Route.get('subscriptions', 'SubscriptionController.index')

Route.post('sessions', 'SessionController.store')
Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.get('/files/:id', 'FileController.show')
Route.post('/files', 'FileController.store')
Route.post('users', 'UserController.store')
Route.group(() => {
  Route.post('subscriptions/:id', 'SubscriptionController.store')
  Route.post('preferences', 'PreferenceController.store').validator(
    'Preference'
  )
  Route.get('users/profile', 'UserController.show')
  Route.put('users', 'UserController.update')
  Route.put('users/profile', 'UserController.profile')
  Route.get('meetups/filter/:id', 'MeetupController.filter')
  Route.get('meetups/unsigned/:page', 'MeetupController.unsigned')
  Route.get('meetups/signed/:page', 'MeetupController.signed')
  Route.get('meetups/recommended/:page', 'MeetupController.recommended')
  Route.get('meetups/:id', 'MeetupController.show')
  Route.put('meetups/:id', 'MeetupController.update').validator('Meetup')
  Route.post('meetups', 'MeetupController.store').validator('Meetup')
}).middleware(['auth'])
