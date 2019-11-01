import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'

import { ButtonGroup } from '../index'
import { Visibility } from '../../icons'

const stories = storiesOf('Button group', module)

stories.addDecorator(withKnobs)

stories.add('Default', () => (
  <>
    <ButtonGroup
      items={[
        {
          label: 'One',
          onClick: () => action('Click One'),
        },
        {
          label: 'Two',
          onClick: () => action('Click Two'),
        },
        {
          disabled: true,
          label: 'Three',
          icon: <Visibility />,
        },
      ]}
      size="regular"
    />
  </>
))
