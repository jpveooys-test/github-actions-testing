import React from 'react'

import { SelectChildrenType, SelectChildWithStringType } from './types'

function itemToString(item: SelectChildWithStringType) {
  return React.isValidElement(item) ? item.props.children : ''
}

function initialSelectedItem(
  children: SelectChildrenType,
  value: string | null
) {
  if (value === null) {
    return null
  }

  return React.Children.toArray(children).find((child) => {
    return React.isValidElement(child) ? child.props.value === value : null
  })
}

export { initialSelectedItem, itemToString }
