/* global describe it jest expect afterEach __rewire_reset_all__ */
import { __RewireAPI__ as RA, actions } from '@status/actions'
import { __RewireAPI__ as RM, getStatus, subscribeStatus, unsubscribeStatus, setStatus } from '@status/manager'

describe(`Status Actions`, () => {
  describe(`actions export`, () => {
    it(`Returns an action function given its type`, () => {
      const exampleType = { LOGIN: 'LOGIN' }
      const returned = actions[exampleType.LOGIN]
      expect(typeof returned).toEqual('function')
    })
  })

  describe(`loginAction`, () => {
    it(`If newLoginState is SUCCESSFUL it updates user status and returns the new state`, () => {
      const [loginAction, newLoginState, user] = [RA.__get__('loginAction'), 'SUCCESSFUL', { username: 'tester' }]
      RA.__Rewire__('setStatus', jest.fn())
      const actionSetStatus = RA.__get__('setStatus')
      const returned = loginAction(newLoginState, user)
      expect(actionSetStatus).toBeCalledWith('USER', user)
      expect(returned).toEqual(newLoginState)
      RA.__ResetDependency__('setStatus')
    })

    it(`If newLoginState isn't SUCCESSFUL it updates user status with empty data and returns the new state`, () => {
      const [loginAction, newLoginState, user] = [RA.__get__('loginAction'), 'FAILED', {}]
      RA.__Rewire__('setStatus', jest.fn())
      const setStatus = RA.__get__('setStatus')
      const returned = loginAction(newLoginState, user)
      expect(setStatus).toBeCalledWith('USER', user)
      expect(returned).toEqual(newLoginState)
      RA.__ResetDependency__('setStatus')
    })
  })
})

describe('Status Constants', () => {

})

describe('Status Manager', () => {
  describe(`getState`, () => {
    it(`Retrieves the current state stored in the store given a type`, () => {
      const [TEST_IDX, TEST_VALUE] = ['TEST_IDX', 'TEST_VALUE']
      RM.__Rewire__('store', { TEST_IDX: TEST_VALUE })
      const returned = getStatus(TEST_IDX)
      expect(returned).toEqual(TEST_VALUE)
      RA.__ResetDependency__('store')
    })
  })

  describe(`subscribeStatus`, () => {
    it(`Adds a listener of a certain type to the listeners object`, () => {
      const [TEST_TYPE, TEST_NAME, TEST_LISTENER] = ['TEST_TYPE', 'TEST_NAME', function testListener () {}]
      RM.__Rewire__('listeners', {})
      subscribeStatus(TEST_TYPE, TEST_NAME, TEST_LISTENER)
      const listeners = RM.__get__('listeners')
      expect(listeners).toMatchObject({TEST_TYPE: {TEST_NAME: TEST_LISTENER}})
      RA.__ResetDependency__('listeners')
    })
  })

  describe(`unsubscribeStatus`, () => {
    it(`Removes a listener of a certain type from the listener's object`, () => {
      const [TEST_TYPE, TEST_NAME, TEST_LISTENER] = ['TEST_TYPE', 'TEST_NAME', function testListener () {}]
      RM.__Rewire__('listeners', {TEST_TYPE: {TEST_NAME: TEST_LISTENER}})
      unsubscribeStatus(TEST_TYPE, TEST_NAME)
      const listeners = RM.__get__('listeners')
      expect(listeners).toEqual({TEST_TYPE: {}})
      RA.__ResetDependency__('listeners')
    })
  })

  describe(`setStatus`, () => {
    afterEach(() => {
      __rewire_reset_all__()
    })
    it(`If there is no action defined for the type, and the type doesn't exist, it sets the value for the type`, () => {
      const [TEST_IDX, TEST_VALUE] = ['TEST_IDX', 'TEST_VALUE']
      RM.__Rewire__('store', {})
      setStatus(TEST_IDX, TEST_VALUE)
      const store = RM.__get__('store')
      expect(store).toEqual({TEST_IDX: TEST_VALUE})
    })

    it(`If there is no action defined for the type, and the type does exist, it sets the value for the type`, () => {
      const [TEST_IDX, TEST_VALUE] = ['TEST_IDX', 'TEST_VALUE']
      RM.__Rewire__('store', {TEST_IDX: 'old_value'})
      setStatus(TEST_IDX, TEST_VALUE)
      const store = RM.__get__('store')
      expect(store).toEqual({TEST_IDX: TEST_VALUE})
    })

    it(`If an action is defined for the type, then the action is invoked and the value is obtained from it`, () => {
      const [TEST_TYPE, NEW_VALUE] = ['TEST_TYPE', 'NEW_VALUE']
      RM.__Rewire__('actions', { TEST_TYPE: () => NEW_VALUE })
      RM.__Rewire__('store', jest.fn().mockReturnValue({}))
      const actions = RM.__get__('actions')
      jest.spyOn(actions, 'TEST_TYPE')
      setStatus(TEST_TYPE, 'some_value')
      const store = RM.__get__('store')
      expect(actions[TEST_TYPE]).toBeCalled()
      expect(store[TEST_TYPE]).toEqual(NEW_VALUE)
    })

    it(`Calls the registered listener for the store type if there is one`, () => {
      const [TEST_TYPE, TEST_NAME, NEW_VALUE] = ['TEST_TYPE', 'TEST_NAME', 'NEW_VALUE']
      RM.__Rewire__('listeners', {TEST_TYPE: {TEST_NAME: () => {}}})
      const listeners = RM.__get__('listeners')
      jest.spyOn(listeners[TEST_TYPE], 'TEST_NAME')
      setStatus(TEST_TYPE, TEST_NAME, NEW_VALUE)
      expect(listeners[TEST_TYPE][TEST_NAME]).toBeCalled()
    })
  })
})
