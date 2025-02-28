import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tooltip } from '.'

export default {
  component: Tooltip,
  title: 'Tooltip',
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
} as ComponentMeta<typeof Tooltip>

export const Default: ComponentStory<typeof Tooltip> = ({
  children,
  ...rest
}) => (
  <div style={{ height: '4rem' }}>
    <Tooltip {...rest}>{children}</Tooltip>
  </div>
)

Default.args = {
  children: 'Hello, World!',
}

export const WithTitle: ComponentStory<typeof Tooltip> = (props) => (
  <div style={{ height: '4rem' }}>
    <Tooltip {...props} title="Example title">
      This tooltip has a title!
    </Tooltip>
  </div>
)

WithTitle.storyName = 'With title'
