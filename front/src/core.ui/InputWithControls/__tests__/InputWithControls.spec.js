import React from 'react'
import { shallow, mount, render } from 'enzyme'

import InputWithControls from '../InputWithControls'

describe('InputWithControls component', () => {
  describe('without onChange provided', () => {
    it('should update its state onChange', () => {
      const onChangeComplete = jest.fn()
      const wrapper = mount(
        <InputWithControls value={0} onChangeComplete={onChangeComplete} />
      )
      const input = wrapper.find('input')
      input.simulate('change', { target: { value: 1 } })
      const state = wrapper.state()
      expect(state.value).toEqual(1)
    })
    it('should submit with value onBlur', () => {
      const onChangeComplete = jest.fn()
      const wrapper = mount(
        <InputWithControls value={11} onChangeComplete={onChangeComplete} />
      )
      const input = wrapper.find('input')
      input.simulate('blur')
      expect(onChangeComplete.mock.calls.length).toEqual(1)
      expect(onChangeComplete.mock.calls[0]).toEqual([11])
    })
    it('should submit with value on key Enter', () => {
      const onChangeComplete = jest.fn()
      const wrapper = mount(
        <InputWithControls value={0} onChangeComplete={onChangeComplete} />
      )
      const input = wrapper.find('input')
      input.simulate('keypress', { key: 'Enter' })
      expect(onChangeComplete.mock.calls.length).toEqual(1)
      expect(onChangeComplete.mock.calls[0]).toEqual([0])
    })
  })

  describe('with onChange provided', () => {
    it('should NOT update its state onChange and should call onChange', () => {
      const onChangeComplete = jest.fn()
      const onChange = jest.fn()
      const wrapper = mount(
        <InputWithControls
          value={0}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      )
      const input = wrapper.find('input')
      input.simulate('change', { target: { id: 'superID', value: 1 } })
      const state = wrapper.state()
      expect(state.value).not.toEqual(1)
      expect(onChange.mock.calls.length).toEqual(1)
      expect(onChange.mock.calls[0][0].target.id).toEqual('superID')
      expect(onChange.mock.calls[0][0].target.value).toEqual(1)
    })
    it('should submit without value onBlur', () => {
      const onChangeComplete = jest.fn()
      const onChange = jest.fn()
      const wrapper = mount(
        <InputWithControls
          value={11}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      )
      const input = wrapper.find('input')
      input.simulate('blur')
      expect(onChangeComplete.mock.calls.length).toEqual(1)
      expect(onChangeComplete.mock.calls[0]).toEqual([])
    })
    it('should submit without value on key Enter', () => {
      const onChangeComplete = jest.fn()
      const onChange = jest.fn()
      const wrapper = mount(
        <InputWithControls
          value={0}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      )
      const input = wrapper.find('input')
      input.simulate('keypress', { key: 'Enter' })
      expect(onChangeComplete.mock.calls.length).toEqual(1)
      expect(onChangeComplete.mock.calls[0]).toEqual([])
    })
  })
})
