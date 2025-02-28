import { describe, cy, it, before } from 'local-cypress'

import selectors from '../../selectors'

describe('Select', () => {
  before(() => {
    cy.visit('/iframe.html?id=select--default&viewMode=story')
  })

  describe('when the component is focused', () => {
    before(() => {
      cy.get(selectors.select.outerWrapper).click()
    })

    it('renders four options', () => {
      cy.get(selectors.select.option).should('have.length', 4)
    })

    describe('and `th` is typed', () => {
      before(() => {
        cy.get(selectors.select.outerWrapper).type('Th{enter}')
        cy.get('body').click()
      })

      it('sets the value as the item', () => {
        cy.get(selectors.select.input).should(
          'have.value',
          'This is a really, really long select option label that overflows the container when selected'
        )
      })

      describe('and the user hovers on the input', () => {
        beforeEach(() => {
          cy.get(selectors.select.input).trigger('mouseover')
        })

        it('displays a tooltip', () => {
          cy.get(selectors.select.tooltip).should('be.visible')
        })
      })
    })
  })
})
