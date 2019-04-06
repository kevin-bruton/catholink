# The Store

This is the store manager
with the basic functions for its use

The data in the store is divided in types
These types are defined in `constants.js` and can be accessed for example statusType.LOGIN

In `actions.js` we include functions that will be invoked
  on an update when more logical operations have to be
  performed on an update

## The basic functions available are:

`getStatus`: gets the value stored in the store type specified

`subscribeStatus`: set a listener if you need to be updated
  with the latest changes in the store

`unsubscribeStatus`: stop listening to the changes

`setStatus`: change a value in the store of a particular type
  If there is an action for this change, it will be executed

