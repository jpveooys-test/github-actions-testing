import React, { useMemo } from 'react'

import { ComponentWithClass } from '../../common/ComponentWithClass'
import { useClickMenu, ClickType, CLICK_BUTTON } from '../../hooks/useClickMenu'
import { StyledContextMenu } from './partials/StyledContextMenu'

export interface ContextMenuProps extends ComponentWithClass {
  /**
   * A ref object for the element associated with the component.
   */
  attachedToRef: React.RefObject<HTMLElement>
  /**
   * Should the menu display when the user uses a left or right mouse click.
   */
  clickType?: ClickType
  /**
   * Optional handler function to be invoked when the component is hidden.
   */
  onHide?: (e: MouseEvent) => void
  /**
   * Optional handler function to be invoked when the component is displayed.
   */
  onShow?: (e: MouseEvent) => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  attachedToRef,
  children,
  clickType = CLICK_BUTTON.RIGHT,
  onHide,
  onShow,
  ...rest
}) => {
  const { mousePointer, isOpen, floatingElementRef, styles, attributes } =
    useClickMenu({
      attachedToRef,
      clickType,
      onHide,
      onShow,
    })

  const hasIcons = useMemo(() => {
    return !!React.Children.toArray(children).filter(
      (child: React.ReactNode) => (child as React.ReactElement)?.props?.icon
    ).length
  }, [children])

  return (
    <StyledContextMenu
      ref={floatingElementRef}
      $hasIcons={hasIcons}
      $isOpen={isOpen}
      left={mousePointer?.getBoundingClientRect().left}
      top={mousePointer?.getBoundingClientRect().top}
      style={styles.popper}
      {...attributes.popper}
      data-testid="context-menu"
      {...rest}
    >
      {children}
    </StyledContextMenu>
  )
}

ContextMenu.displayName = 'ContextMenu'
