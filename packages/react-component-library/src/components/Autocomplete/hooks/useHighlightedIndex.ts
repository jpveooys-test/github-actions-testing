import React, { useCallback, useEffect } from 'react'
import { findIndexOfInputValue } from '../helpers'
import { SelectChildWithStringType } from '../../SelectBase'

export function useHighlightedIndex(
  highlightedIndex: number,
  inputValue: string,
  isOpen: boolean,
  items: SelectChildWithStringType[],
  setHighlightedIndex: (index: number) => void,
  setInputValue: (value: string) => void
): {
  onInputBlurHandler: () => void
  onInputKeyDownHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void
} {
  useEffect(() => {
    if (inputValue && highlightedIndex < 0) {
      if (isOpen) {
        const index = findIndexOfInputValue(items, inputValue)
        setHighlightedIndex(index === -1 ? 0 : index)
      } else {
        setHighlightedIndex(0)
      }
    }
  }, [highlightedIndex, inputValue, isOpen, items, setHighlightedIndex])

  function resetHighlightedIndex() {
    setHighlightedIndex(-1)
  }

  const onInputBlurHandler = useCallback(resetHighlightedIndex, [
    setHighlightedIndex,
  ])

  const onInputKeyDownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === 'Tab' && highlightedIndex !== -1) {
        const item = React.Children.toArray(items)[highlightedIndex]
        if (React.isValidElement(item)) {
          setInputValue(item.props.children)
        }
      }
    },
    [highlightedIndex, items, setInputValue]
  )

  return {
    onInputBlurHandler,
    onInputKeyDownHandler,
  }
}
