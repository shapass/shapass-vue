
# Change Log

## 0.7.1 - 2021-05-02

* Highlight the generated password when copying.
* Add a box-shadow to modals so they look a bit more like modals.
* Ctrl+C won't copy the password anymore. Was confusing, selecting text and pressing CTRL+C would
  copy the generated password and not the selected text.
* Clear the local storage when loading the app if signed out. Fixes the issue of having all configs
  still in local storage if the session expired.
* Log API calls and their data as warnings to show in the console in production. So users can see what's
  being sent and received to and from the server.

## 0.7.0 - 2021-05-02

* Fancy masks and effects for hidden generated passwords.
* Read the API's domain from .env files.
* Use node 12.16.
* Add configs and instructions to run the app on docker.

## 0.6.0 - 2020-02-16

* Include `sha256-num` algorithm to generate passwords with only numbers.

## 0.5.0 - 2019-11-05

* Encrypt all user data when sending to the server. The server no longer receives
  any clear text user data other than the email and the sign in password.
  Users will be automatically migrated to the new format just by using the app.
* Save and remove buttons are now at the side of the service selector and the
  actions to save and remove from the API are asynchronous.
* Rewrote the Store class to accommodate the changes listed above.
* Moved notifications to the bottom so they won't cover other components
  and will be less annoying.
* Service configs are now in a modal window.

## 0.4.0 - 2019-08-25

* Split the application in more components and routes: login, sign up, reset
  password, and app.
* Lots of other fixes and improvements, mostly on usability/design.

## 0.3.0 - 2019-08-12

* Support to multiple algorithms (`sha256-bin` now the default) and several
  design and usability improvements.

## 0.2.0 - 2019-08-07

* Kinda stable.

## 0.1.0 - 2019-07-07

* First.
