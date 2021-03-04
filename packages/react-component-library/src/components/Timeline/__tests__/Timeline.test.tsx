import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, RenderResult, fireEvent } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'

import { NO_DATA_MESSAGE, TIMELINE_BLOCK_SIZE } from '../constants'
import {
  Timeline,
  TimelineDays,
  TimelineHours,
  TimelineEvent,
  TimelineEvents,
  TimelineMonths,
  TimelineRow,
  TimelineRows,
  TimelineSide,
  TimelineTodayMarker,
  TimelineWeeks,
} from '..'

describe('Timeline', () => {
  let wrapper: RenderResult

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when a custom className is provided', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
          className="test-class-name"
        >
          <TimelineMonths />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('adds the custom CSS class to the component', () => {
      expect(wrapper.getByTestId('timeline')).toHaveClass('test-class-name')
    })
  })

  describe('when no data is provided', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline startDate={new Date(2020, 3, 1)} today={new Date(2020, 3, 6)}>
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineHours />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )

      wrapper.getByTestId('timeline-toolbar-zoom-in').click()
    })

    it('should set the `role` attribute to `grid` on the timeline', () => {
      expect(wrapper.getByTestId('timeline')).toHaveAttribute('role', 'grid')
    })

    it('should set the `role` attribute to `rowgroup` on the header', () => {
      expect(wrapper.queryByTestId('timeline-header')).toHaveAttribute(
        'role',
        'rowgroup'
      )
    })

    it('should display the today marker', () => {
      expect(
        wrapper.queryByTestId('timeline-today-marker-wrapper')
      ).toBeInTheDocument()
    })

    it('should set the `role` attribute to `presentation` on the today marker', () => {
      expect(
        wrapper.queryByTestId('timeline-today-marker-wrapper')
      ).toHaveAttribute('role', 'presentation')
    })

    it('should not render the row headers', () => {
      expect(wrapper.queryAllByTestId('timeline-row-header')).toHaveLength(0)
    })

    it('should set the `role` attribute to `row` on the months', () => {
      expect(wrapper.queryByTestId('timeline-months')).toHaveAttribute(
        'role',
        'row'
      )
    })

    it('renders the correct number of months', () => {
      expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
    })

    it('should set the `role` attribute to `columnheader` on each month', () => {
      const months = wrapper.getAllByTestId('timeline-month')

      months.forEach((month) =>
        expect(month).toHaveAttribute('role', 'columnheader')
      )
    })

    it('renders the month text in correct format', () => {
      const months = wrapper.queryAllByTestId('timeline-month')

      expect(months[0]).toHaveTextContent('April 2020')
    })

    it('should set the `role` attribute to `row` on the weeks', () => {
      expect(wrapper.queryByTestId('timeline-weeks')).toHaveAttribute(
        'role',
        'row'
      )
    })

    it('renders the correct number of weeks', () => {
      expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(2)
    })

    it('should set the `aria-label` on each week', () => {
      const week = wrapper.getAllByTestId('timeline-week')[0]

      expect(week).toHaveAttribute(
        'aria-label',
        'Week beginning 30th March 2020'
      )
    })

    it('should set the `title` on each week', () => {
      const week = wrapper.getAllByTestId('timeline-week')[0]

      expect(week).toHaveAttribute('title', 'Week beginning 30th March 2020')
    })

    it('should set the `role` attribute to `columnheader` on each week', () => {
      const weeks = wrapper.getAllByTestId('timeline-week')

      weeks.forEach((week) =>
        expect(week).toHaveAttribute('role', 'columnheader')
      )
    })

    it('should set the `role` attribute to `row` on the days', () => {
      expect(wrapper.queryByTestId('timeline-days')).toHaveAttribute(
        'role',
        'row'
      )
    })

    it('renders the correct number of days', () => {
      const days = wrapper.queryAllByTestId('timeline-day')

      expect(days).toHaveLength(7)
    })

    it('should set the `role` attribute to `columnheader` on each day', () => {
      const days = wrapper.getAllByTestId('timeline-day')

      days.forEach((day) => expect(day).toHaveAttribute('role', 'columnheader'))
    })

    it('should set the `role` attribute to `row` on the hours', () => {
      expect(wrapper.queryByTestId('timeline-hours')).toHaveAttribute(
        'role',
        'row'
      )
    })

    it('renders the correct number of hours', () => {
      expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(28)
    })

    it('should set the `role` attribute to `columnheader` on each hour', () => {
      const days = wrapper.getAllByTestId('timeline-hour')

      days.forEach((day) => expect(day).toHaveAttribute('role', 'columnheader'))
    })

    it('should display the no data message', () => {
      expect(wrapper.queryByTestId('timeline-no-data')).toBeInTheDocument()
    })

    it('should set the `role` attribute to `row` on the no data message', () => {
      expect(wrapper.queryByTestId('timeline-no-data')).toHaveAttribute(
        'role',
        'row'
      )
    })

    it('should set the `role` attribute to `cell` on the no data message text', () => {
      expect(wrapper.getByText(NO_DATA_MESSAGE)).toHaveAttribute('role', 'cell')
    })

    it('should not display any rows', () => {
      expect(wrapper.queryAllByTestId('timeline-row')).toHaveLength(0)
    })
  })

  describe('when data is provided', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
                <TimelineEvent
                  startDate={new Date(2020, 3, 20)}
                  endDate={new Date(2020, 3, 22)}
                >
                  Event 2
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
            <TimelineRow name="Row 2">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 15)}
                  endDate={new Date(2020, 3, 20)}
                >
                  Event 3
                </TimelineEvent>
                <TimelineEvent
                  startDate={new Date(2020, 3, 22)}
                  endDate={new Date(2020, 3, 24)}
                >
                  Event 4
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should not render the row headers', () => {
      expect(wrapper.queryAllByTestId('timeline-row-header')).toHaveLength(0)
    })

    it('should display the timeline columns', () => {
      expect(wrapper.getByTestId('timeline-columns')).toBeInTheDocument()
    })

    it('should set the `role` attribute to `presentation` on the timeline columns', () => {
      expect(wrapper.getByTestId('timeline-columns')).toHaveAttribute(
        'role',
        'presentation'
      )
    })

    it('does not display the no data message', () => {
      expect(wrapper.queryByTestId('timeline-no-data')).not.toBeInTheDocument()
    })

    it('should set the `role` attribute to `rowgroup` on the rows group', () => {
      expect(wrapper.queryByTestId('timeline-rows')).toHaveAttribute(
        'role',
        'rowgroup'
      )
    })

    it('should set the `role` attribute to `row` on the rows', () => {
      const rows = wrapper.queryAllByTestId('timeline-row')

      rows.forEach((row) => expect(row).toHaveAttribute('role', 'row'))
    })

    it('should display 2 rows', () => {
      expect(wrapper.queryAllByTestId('timeline-row')).toHaveLength(2)
    })

    it('should set the `role` attribute to `cell` on the events', () => {
      const events = wrapper.queryAllByTestId('timeline-event')

      events.forEach((row) => expect(row).toHaveAttribute('role', 'cell'))
    })

    it('should display 4 events', () => {
      expect(wrapper.queryAllByTestId('timeline-event-wrapper')).toHaveLength(4)
      expect(wrapper.getByText('Event 1')).toBeInTheDocument()
      expect(wrapper.getByText('Event 2')).toBeInTheDocument()
      expect(wrapper.getByText('Event 3')).toBeInTheDocument()
      expect(wrapper.getByText('Event 4')).toBeInTheDocument()
    })

    it('should set the `aria-label` on each event', () => {
      const week = wrapper.getAllByTestId('timeline-event')[0]

      expect(week).toHaveAttribute(
        'aria-label',
        'Event 1 begins on 13th April 2020 and ends on 18th April 2020'
      )
    })

    it('should set the `title` on each week', () => {
      const week = wrapper.getAllByTestId('timeline-event')[0]

      expect(week).toHaveAttribute(
        'title',
        'Event 1 begins on 13th April 2020 and ends on 18th April 2020'
      )
    })

    it('should not render a "No events" cell', () => {
      expect(wrapper.queryByText('No events')).toBeNull()
    })
  })

  describe('when `hasSide` is specified', () => {
    describe('when no data is provided', () => {
      beforeEach(() => {
        wrapper = render(
          <Timeline
            hasSide
            startDate={new Date(2020, 3, 1)}
            today={new Date(2020, 3, 15)}
          >
            <TimelineTodayMarker />
            <TimelineMonths />
            <TimelineWeeks />
            <TimelineDays />
            <TimelineRows>{}</TimelineRows>
          </Timeline>
        )
      })

      it('should apply `aria-label` for row headers', () => {
        const rowHeaders = wrapper.getAllByTestId('timeline-row-header')

        expect(rowHeaders[0]).toHaveAttribute('aria-label', 'Months')
        expect(rowHeaders[1]).toHaveAttribute('aria-label', 'Weeks')
        expect(rowHeaders[2]).toHaveAttribute('aria-label', 'Days')
      })
    })

    describe('when data is provided', () => {
      beforeEach(() => {
        wrapper = render(
          <Timeline
            hasSide
            startDate={new Date(2020, 3, 1)}
            today={new Date(2020, 3, 15)}
          >
            <TimelineTodayMarker />
            <TimelineMonths />
            <TimelineWeeks />
            <TimelineDays />
            <TimelineRows>
              <TimelineRow name="Row 1">
                <TimelineEvents>
                  <TimelineEvent
                    startDate={new Date(2020, 3, 13)}
                    endDate={new Date(2020, 3, 18)}
                  >
                    Event 1
                  </TimelineEvent>
                  <TimelineEvent
                    startDate={new Date(2020, 3, 20)}
                    endDate={new Date(2020, 3, 22)}
                  >
                    Event 2
                  </TimelineEvent>
                </TimelineEvents>
              </TimelineRow>
              <TimelineRow name="Row 2">
                <TimelineEvents>
                  <TimelineEvent
                    startDate={new Date(2020, 3, 15)}
                    endDate={new Date(2020, 3, 20)}
                  >
                    Event 3
                  </TimelineEvent>
                  <TimelineEvent
                    startDate={new Date(2020, 3, 22)}
                    endDate={new Date(2020, 3, 24)}
                  >
                    Event 4
                  </TimelineEvent>
                </TimelineEvents>
              </TimelineRow>
            </TimelineRows>
          </Timeline>
        )
      })

      it('should render the row headers', () => {
        const rowHeaders = wrapper.getAllByTestId('timeline-row-header')

        expect(rowHeaders[3]).toHaveTextContent('Row 1')
        expect(rowHeaders[4]).toHaveTextContent('Row 2')
      })

      it('should set the `aria-label` attributes for the timeline navigation buttons', () => {
        expect(
          wrapper.getByTestId('timeline-side-button-left')
        ).toHaveAttribute('aria-label', 'Navigate left')
        expect(
          wrapper.getByTestId('timeline-side-button-right')
        ).toHaveAttribute('aria-label', 'Navigate right')
      })

      describe('and when the left button is clicked', () => {
        beforeEach(() => {
          fireEvent(
            wrapper.getByTestId('timeline-side-button-left'),
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            })
          )
        })

        it('should move to the previous month', () => {
          const months = wrapper.getAllByTestId('timeline-month')

          expect(months[0]).toHaveTextContent('March 2020')
        })
      })

      describe('and when the right button is clicked', () => {
        beforeEach(() => {
          fireEvent(
            wrapper.getByTestId('timeline-side-button-right'),
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            })
          )
        })

        it('should move to the next month', () => {
          const months = wrapper.getAllByTestId('timeline-month')

          expect(months[0]).toHaveTextContent('May 2020')
        })
      })
    })
  })

  describe('when `TimelineSide` is specified', () => {
    let consoleWarnSpy: jest.SpyInstance

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(global.console, 'warn')

      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineSide />
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('should warn the consumer about using the deprecated component', () => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'WARN - RNDS - Component `TimelineSide` is deprecated'
      )
    })

    it('should apply `aria-label` for row headers', () => {
      const rowHeaders = wrapper.getAllByTestId('timeline-row-header')

      expect(rowHeaders[0]).toHaveAttribute('aria-label', 'Months')
      expect(rowHeaders[1]).toHaveAttribute('aria-label', 'Weeks')
      expect(rowHeaders[2]).toHaveAttribute('aria-label', 'Days')
    })
  })

  describe('when `dayWidth` is specified', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          dayWidth={100}
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 4)}
                  endDate={new Date(2020, 3, 6)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('positions the event correctly', () => {
      expect(wrapper.getByTestId('timeline-event')).toHaveStyle({
        left: '300px',
      })
    })
  })

  describe('when arbitrary props are specified', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          data-arbitrary="arbitrary-timeline"
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker data-arbitrary="arbitrary-today-marker" />
          <TimelineMonths data-arbitrary="arbitrary-months" />
          <TimelineWeeks data-arbitrary="arbitrary-weeks" />
          <TimelineDays data-arbitrary="arbitrary-days" />
          <TimelineRows data-arbitrary="arbitrary-rows">
            <TimelineRow name="Row 1" data-arbitrary="arbitrary-row">
              <TimelineEvents data-arbitrary="arbitrary-events">
                <TimelineEvent
                  data-arbitrary="arbitrary-event"
                  startDate={new Date(2020, 3, 4)}
                  endDate={new Date(2020, 3, 6)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should spread arbitrary props on the timeline', () => {
      expect(wrapper.getByTestId('timeline')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-timeline'
      )
    })

    it('should spread arbitrary props on the timeline today marker', () => {
      expect(
        wrapper.getByTestId('timeline-today-marker-wrapper')
      ).toHaveAttribute('data-arbitrary', 'arbitrary-today-marker')
    })

    it('should spread arbitrary props on the timeline months', () => {
      expect(wrapper.getByTestId('timeline-months')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-months'
      )
    })

    it('should spread arbitrary props on the timeline weeks', () => {
      expect(wrapper.getByTestId('timeline-weeks')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-weeks'
      )
    })

    it('should spread arbitrary props on the timeline days', () => {
      expect(wrapper.getByTestId('timeline-days')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-days'
      )
    })

    it('should spread arbitrary props on the timeline rows', () => {
      expect(wrapper.getByTestId('timeline-rows')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-rows'
      )
    })

    it('should spread arbitrary props on the timeline row', () => {
      expect(wrapper.getByTestId('timeline-row')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-row'
      )
    })

    it('should spread arbitrary props on the timeline events', () => {
      expect(wrapper.getByTestId('timeline-events')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-events'
      )
    })

    it('should spread arbitrary props on the timeline event', () => {
      expect(wrapper.getByTestId('timeline-event')).toHaveAttribute(
        'data-arbitrary',
        'arbitrary-event'
      )
    })
  })

  describe('when an event is outside the range', () => {
    beforeEach(() => {
      const EventWithinRange: React.FC = () => (
        <TimelineEvent
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          endDate={new Date(2020, 1, 10, 0, 0, 0)}
        >
          Event 1
        </TimelineEvent>
      )

      const EventOutsideRange: React.FC = () => (
        <TimelineEvent
          startDate={new Date(2020, 6, 1, 0, 0, 0)}
          endDate={new Date(2020, 6, 10, 0, 0, 0)}
        >
          Event 1
        </TimelineEvent>
      )

      wrapper = render(
        <Timeline startDate={new Date(2020, 1, 1, 0, 0, 0)}>
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <EventWithinRange />
                <EventOutsideRange />
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('renders the correct number of events', () => {
      expect(wrapper.queryAllByTestId('timeline-event-wrapper')).toHaveLength(1)
    })
  })

  describe('when months has `render` specified', () => {
    const CustomMonth = ({
      index,
      dayWidth,
      daysTotal,
      startDate,
      ...rest
    }: {
      index: number
      dayWidth: number
      daysTotal: number
      startDate: Date
    }) => {
      return (
        <span {...rest}>
          {startDate.toString()} - {index} - {dayWidth} - {daysTotal}
        </span>
      )
    }

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineMonths
            render={(index, dayWidth, daysTotal, startDate) => (
              <CustomMonth
                data-testid="timeline-custom-month"
                index={index}
                dayWidth={dayWidth}
                daysTotal={daysTotal}
                startDate={startDate}
              />
            )}
          />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('should render the day dates as specified', () => {
      const expected =
        'Sat Feb 01 2020 00:00:00 GMT+0000 (Coordinated Universal Time) - 0 - 30 - 29'
      const firstMonth = wrapper.getAllByTestId('timeline-custom-month')[0]

      expect(firstMonth).toHaveTextContent(expected)
    })
  })

  describe('when weeks has `render` specified', () => {
    const CustomWeek = ({
      index,
      isOddNumber,
      offsetPx,
      widthPx,
      dayWidth,
      daysTotal,
      startDate,
      ...rest
    }: {
      index: number
      isOddNumber: boolean
      offsetPx: string
      widthPx: string
      dayWidth: number
      daysTotal: number
      startDate: Date
    }) => {
      return (
        <span {...rest}>
          {startDate.toString()} - {index} - {isOddNumber.toString()} -{' '}
          {offsetPx} - {widthPx} - {dayWidth} - {daysTotal}
        </span>
      )
    }

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineWeeks
            render={(
              index,
              isOddNumber,
              offsetPx,
              widthPx,
              dayWidth,
              daysTotal,
              startDate
            ) => (
              <CustomWeek
                data-testid="timeline-custom-week"
                index={index}
                isOddNumber={isOddNumber}
                offsetPx={offsetPx}
                widthPx={widthPx}
                dayWidth={dayWidth}
                daysTotal={daysTotal}
                startDate={startDate}
              />
            )}
          />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('should render the day dates as specified', () => {
      const expected =
        'Mon Jan 27 2020 00:00:00 GMT+0000 (Coordinated Universal Time) - 0 - false - -150px - 210px - 30 - 7'
      const firstWeek = wrapper.getAllByTestId('timeline-custom-week')[0]

      expect(firstWeek).toHaveTextContent(expected)
    })
  })

  describe('when days has `render` specified', () => {
    const CustomDay = ({
      index,
      dayWidth,
      date,
      ...rest
    }: {
      index: number
      dayWidth: number
      date: Date
    }) => {
      return (
        <span {...rest}>
          {date.toString()} - {index} - {dayWidth}
        </span>
      )
    }

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays
            render={(index, dayWidth, date) => (
              <CustomDay
                data-testid="timeline-custom-day"
                index={index}
                dayWidth={dayWidth}
                date={date}
              />
            )}
          />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('should render the day dates as specified', () => {
      const firstDay = wrapper.getAllByTestId('timeline-custom-day')[0]
      const expected =
        'Sat Feb 01 2020 00:00:00 GMT+0000 (Coordinated Universal Time) - 0 - 30'

      expect(firstDay).toHaveTextContent(expected)
    })
  })

  describe('when hours has `render` specified', () => {
    const CustomHour = ({
      width,
      time,
      ...rest
    }: {
      width: number
      time: string
    }) => <span {...rest}>Time: {time}</span>

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineHours
            render={(width, time) => (
              <CustomHour
                data-testid="timeline-custom-hour"
                width={width}
                time={time}
              />
            )}
          />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )

      wrapper.getByTestId('timeline-toolbar-zoom-in').click()
    })

    it('should render the day dates as specified', () => {
      const firstHour = wrapper.getAllByTestId('timeline-custom-hour')[0]
      const expected = 'Time: 00:00'

      expect(firstHour).toHaveTextContent(expected)
    })
  })

  describe('when hours has `blockSize` specified', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineHours blockSize={TIMELINE_BLOCK_SIZE.HALF_DAY} />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )

      wrapper.getByTestId('timeline-toolbar-zoom-in').click()
    })

    it('renders the correct number of hours', () => {
      expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(14)
    })
  })

  describe('when events have time specified', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15, 12)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 14, 12)}
                  endDate={new Date(2020, 3, 18, 12)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('positions the TodayMarker correct', () => {
      expect(wrapper.getByTestId('timeline-today-marker')).toHaveStyle({
        left: '435px',
      })
    })

    it('positions the event correctly', () => {
      expect(wrapper.getByTestId('timeline-event')).toHaveStyle({
        left: '405px',
      })
    })
  })

  describe('when rows has `renderColumns` specified', () => {
    const CustomColumn = ({
      index,
      isOddNumber,
      offsetPx,
      widthPx,
    }: {
      index: number
      isOddNumber: boolean
      offsetPx: string
      widthPx: string
    }) => {
      return (
        <span>
          {index} - {isOddNumber.toString()} - {offsetPx} - {widthPx}
        </span>
      )
    }

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows
            renderColumns={(index, isOddNumber, offsetPx, widthPx) => (
              <CustomColumn
                index={index}
                isOddNumber={isOddNumber}
                offsetPx={offsetPx}
                widthPx={widthPx}
              />
            )}
          >
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
            <TimelineRow name="Row 2">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 15)}
                  endDate={new Date(2020, 3, 20)}
                >
                  Event 2
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render the row column wrapper', () => {
      expect(wrapper.getByTestId('timeline-columns')).toBeInTheDocument()
    })

    it('should render the correct number of columns', () => {
      expect(wrapper.getByTestId('timeline-columns').childNodes).toHaveLength(5)
    })

    it('should render the column content correctly', () => {
      expect(
        wrapper.getByTestId('timeline-columns').childNodes[0].textContent
      ).toBe('0 - false - -150px - 210px')
    })
  })

  describe('when an event has `render` specified', () => {
    beforeEach(() => {
      const EventWithRender: React.FC = () => (
        <TimelineEvent
          startDate={new Date(2020, 3, 16)}
          endDate={new Date(2020, 3, 20)}
          render={(
            startDate: Date,
            endDate: Date,
            widthPx: string,
            offsetPx: string,
            maxWidthPx: string,
            startsBeforeStart: boolean,
            endsAfterEnd: boolean,
            ...rest
          ) => {
            return (
              <div data-testid="timeline-custom-event" {...rest}>
                <span data-testid="timeline-custom-event-start-date">
                  {startDate.toString()}
                </span>
                <span data-testid="timeline-custom-event-end-date">
                  {endDate.toString()}
                </span>
                <span data-testid="timeline-custom-event-width-px">
                  {widthPx}
                </span>
                <span data-testid="timeline-custom-event-offset-px">
                  {offsetPx}
                </span>
                <span data-testid="timeline-custom-event-max-width-px">
                  {maxWidthPx}
                </span>
                <span data-testid="timeline-custom-event-starts-before-start">
                  {startsBeforeStart ? 'true' : 'false'}
                </span>
                <span data-testid="timeline-custom-event-ends-after-end">
                  {endsAfterEnd ? 'true' : 'false'}
                </span>
              </div>
            )
          }}
        />
      )

      wrapper = render(
        <Timeline startDate={new Date(2020, 3, 1, 0, 0, 0)}>
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <EventWithRender />
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render the event as specified', () => {
      expect(
        wrapper.getByTestId('timeline-custom-event-start-date')
      ).toHaveTextContent(
        'Thu Apr 16 2020 00:00:00 GMT+0000 (Coordinated Universal Time)'
      )
      expect(
        wrapper.getByTestId('timeline-custom-event-end-date')
      ).toHaveTextContent(
        'Mon Apr 20 2020 00:00:00 GMT+0000 (Coordinated Universal Time)'
      )
      expect(
        wrapper.getByTestId('timeline-custom-event-width-px')
      ).toHaveTextContent('120px')
      expect(
        wrapper.getByTestId('timeline-custom-event-offset-px')
      ).toHaveTextContent('450px')
      expect(
        wrapper.getByTestId('timeline-custom-event-max-width-px')
      ).toHaveTextContent('450px')
      expect(
        wrapper.getByTestId('timeline-custom-event-starts-before-start')
      ).toHaveTextContent('false')
      expect(
        wrapper.getByTestId('timeline-custom-event-ends-after-end')
      ).toHaveTextContent('false')
    })

    it('should set the `aria-label` on each event', () => {
      const week = wrapper.getAllByTestId('timeline-custom-event')[0]

      expect(week).toHaveAttribute(
        'aria-label',
        'Begins on 16th April 2020 and ends on 20th April 2020'
      )
    })

    it('should set the `title` on each week', () => {
      const week = wrapper.getAllByTestId('timeline-custom-event')[0]

      expect(week).toHaveAttribute(
        'title',
        'Begins on 16th April 2020 and ends on 20th April 2020'
      )
    })
  })

  describe('when today marker has `render` specified', () => {
    const CustomTodayMarker = ({
      today,
      offset,
    }: {
      today: Date
      offset: string
    }) => {
      return (
        <div>
          {today.toString()} - {offset}
        </div>
      )
    }

    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 1, 7, 0, 0, 0)}
        >
          <TimelineTodayMarker
            render={(today, offset) => (
              <CustomTodayMarker today={today} offset={offset} />
            )}
          />
          <TimelineRows>{}</TimelineRows>
        </Timeline>
      )
    })

    it('should render the today marker as specified', () => {
      expect(
        wrapper.getByTestId('timeline-today-marker-wrapper').innerHTML
      ).toBe(
        renderToStaticMarkup(
          <CustomTodayMarker
            today={new Date(2020, 1, 7, 0, 0, 0)}
            offset="180px"
          />
        )
      )
    })
  })

  describe('when today is not within range', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 4, 1, 0, 0, 0)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 1, 1, 0, 0, 0)}
                  endDate={new Date(2020, 1, 10, 0, 0, 0)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should not display the today marker', () => {
      expect(
        wrapper.queryAllByTestId('timeline-today-marker-wrapper')
      ).toHaveLength(0)
    })
  })

  describe('when custom range is provided', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 4, 1, 0, 0, 0)}
          range={6}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 1, 1, 0, 0, 0)}
                  endDate={new Date(2020, 1, 10, 0, 0, 0)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('renders the correct number of months', () => {
      expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(6)
    })
  })

  describe('when Timeline is initialized with a fixed endDate', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 6, 0, 0, 0)}
          endDate={new Date(2020, 1, 22, 0, 0, 0)}
          today={new Date(2020, 4, 1, 0, 0, 0)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineHours />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 1, 7, 0, 0, 0)}
                  endDate={new Date(2020, 1, 10, 0, 0, 0)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('renders the correct number of months', () => {
      expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
    })

    it('renders the correct number of weeks', () => {
      expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(3)
    })

    it('renders the correct number of days', () => {
      expect(wrapper.queryAllByTestId('timeline-day-title')).toHaveLength(17)
    })

    it('does not render hours', () => {
      expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(0)
    })

    it('positions the event correctly', () => {
      expect(wrapper.getByTestId('timeline-event')).toHaveStyle({
        left: `30px`,
      })
    })
  })

  describe('when composed with a custom root child component', () => {
    beforeEach(() => {
      const CustomTimelineComponent = () => {
        return (
          <div data-testid="custom-timeline-component">
            Custom Timeline Component
          </div>
        )
      }

      wrapper = render(
        <Timeline
          startDate={new Date(2020, 1, 1, 0, 0, 0)}
          today={new Date(2020, 4, 1, 0, 0, 0)}
        >
          <CustomTimelineComponent />
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 1, 1, 0, 0, 0)}
                  endDate={new Date(2020, 1, 10, 0, 0, 0)}
                >
                  Event
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render the custom component', () => {
      expect(
        wrapper.queryByTestId('custom-timeline-component')
      ).toBeInTheDocument()
    })
  })

  describe('when composed with a HOC for `TimelineRow`', () => {
    beforeEach(() => {
      function AnotherTimelineRow() {
        return (
          <TimelineRow name="Another row">
            <TimelineEvents>
              <TimelineEvent
                startDate={new Date(2020, 3, 13)}
                endDate={new Date(2020, 3, 18)}
              >
                Event 1
              </TimelineEvent>
            </TimelineEvents>
          </TimelineRow>
        )
      }

      wrapper = render(
        <Timeline
          hasSide
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
            <AnotherTimelineRow />
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render two rows', () => {
      expect(wrapper.getAllByTestId('timeline-row')).toHaveLength(2)
      expect(wrapper.getByText('Row 1')).toBeInTheDocument()
      expect(wrapper.getByText('Another row')).toBeInTheDocument()
    })
  })

  describe('when an event has arbitrary `children`', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  <div>Arbitrary event content</div>
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render the arbitrary content', () => {
      expect(wrapper.getByText('Arbitrary event content')).toBeInTheDocument()
    })

    it('should set the `aria-label` on the event', () => {
      const week = wrapper.getAllByTestId('timeline-event')[0]

      expect(week).toHaveAttribute(
        'aria-label',
        'Begins on 13th April 2020 and ends on 18th April 2020'
      )
    })
  })

  describe('when an event has a startDate out of bounds of the displayed range', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 2, 14)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('renders the event', () => {
      expect(wrapper.queryByTestId('timeline-event')).toBeInTheDocument()
    })
  })

  describe('when an event has an endDate out of bounds of the displayed range', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 2, 1)}
          today={new Date(2020, 2, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 2, 14)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('renders the event', () => {
      expect(wrapper.queryByTestId('timeline-event')).toBeInTheDocument()
    })
  })

  describe('when all events are outside the range', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 0, 1)}
          today={new Date(2020, 0, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should display 0 events', () => {
      expect(wrapper.queryAllByTestId('timeline-event-wrapper')).toHaveLength(0)
    })

    it('should render the "No events" cell', () => {
      expect(wrapper.getByText('No events')).toBeInTheDocument()
    })
  })

  describe('when scaling', () => {
    beforeEach(() => {
      wrapper = render(
        <Timeline
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineHours />
          <TimelineRows>
            <TimelineRow name="Row 1">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 13)}
                  endDate={new Date(2020, 3, 18)}
                >
                  Event 1
                </TimelineEvent>
              </TimelineEvents>
            </TimelineRow>
          </TimelineRows>
        </Timeline>
      )
    })

    it('should render months', () => {
      expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
    })

    it('should render weeks', () => {
      expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(5)
    })

    it('should render days', () => {
      expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(30)
    })

    it('should not render hours', () => {
      expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(0)
    })

    describe('and then zooming out once (year view)', () => {
      beforeEach(() => {
        wrapper.getByTestId('timeline-toolbar-zoom-out').click()
      })

      it('should render months', () => {
        expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(12)
      })

      it('should render weeks', () => {
        expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(0)
      })

      it('should render days', () => {
        expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(0)
      })

      it('should not render hours', () => {
        expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(0)
      })
    })

    describe('and then zooming out twice (5 year view)', () => {
      beforeEach(() => {
        wrapper.getByTestId('timeline-toolbar-zoom-out').click()
        wrapper.getByTestId('timeline-toolbar-zoom-out').click()
      })

      it('should render months', () => {
        expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(60)
      })

      it('should render weeks', () => {
        expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(0)
      })

      it('should render days', () => {
        expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(0)
      })

      it('should not render hours', () => {
        expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(0)
      })
    })

    describe('and then zooming in once (week view)', () => {
      beforeEach(() => {
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
      })

      it('should render months', () => {
        expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
      })

      it('should render weeks', () => {
        expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(2)
      })

      it('should render days', () => {
        expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(7)
      })

      it('should not render hours', () => {
        expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(28)
      })
    })

    describe('and then zooming in twice (1/4 day view)', () => {
      beforeEach(() => {
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
      })

      it('should render months', () => {
        expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
      })

      it('should render weeks', () => {
        expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(2)
      })

      it('should render days', () => {
        expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(7)
      })

      it('should not render hours', () => {
        expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(28)
      })
    })

    describe('and then zooming in thrice (1 hour view)', () => {
      beforeEach(() => {
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
        wrapper.getByTestId('timeline-toolbar-zoom-in').click()
      })

      it('should render months', () => {
        expect(wrapper.queryAllByTestId('timeline-month')).toHaveLength(1)
      })

      it('should render weeks', () => {
        expect(wrapper.queryAllByTestId('timeline-week')).toHaveLength(2)
      })

      it('should render days', () => {
        expect(wrapper.queryAllByTestId('timeline-day')).toHaveLength(7)
      })

      it('should not render hours', () => {
        expect(wrapper.queryAllByTestId('timeline-hour')).toHaveLength(28)
      })
    })
  })
})
