import { useState } from 'react'

interface DateSelectionProps {
  shopId: string
  serviceIds: string[]
  onDateSelect?: (date: Date, timeSlot: string) => void
  onBack?: () => void
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

function DateSelection({ shopId, serviceIds, onDateSelect, onBack }: DateSelectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '01:00 PM', available: true },
    { id: '6', time: '02:00 PM', available: true },
    { id: '7', time: '03:00 PM', available: false },
    { id: '8', time: '04:00 PM', available: true },
    { id: '9', time: '05:00 PM', available: true },
    { id: '10', time: '06:00 PM', available: true },
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to 6, shift others
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (!isDateDisabled(date)) {
      setSelectedDate(date)
      setSelectedTimeSlot(null) // Reset time slot when date changes
    }
  }

  const handleTimeSlotClick = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId)
    if (slot?.available) {
      setSelectedTimeSlot(slotId)
    }
  }

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      const slot = timeSlots.find(s => s.id === selectedTimeSlot)
      if (slot) {
        onDateSelect?.(selectedDate, slot.time)
      }
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const disabled = isDateDisabled(date)
      const selected = isSameDay(date, selectedDate)

      days.push(
        <button
          key={day}
          className={`calendar-day ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="page">
      <main className="date-container">
        <div className="date-header">
          {onBack && (
            <button className="back-button" onClick={onBack} aria-label="Go back">
              <svg viewBox="0 0 24 24" className="back-icon">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="date-title">Select Your Date</h1>
        </div>

        <div className="calendar-card">
          <div className="calendar-header">
            <button className="month-nav" onClick={handlePrevMonth} aria-label="Previous month">
              <svg viewBox="0 0 24 24" className="nav-icon">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button className="month-nav" onClick={handleNextMonth} aria-label="Next month">
              <svg viewBox="0 0 24 24" className="nav-icon">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
            <div className="weekday">Sun</div>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        {selectedDate && (
          <div className="time-slots-section">
            <h2 className="time-title">Select Time Slot</h2>
            <div className="time-slots-grid">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTimeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotClick(slot.id)}
                  disabled={!slot.available}
                >
                  <span className="time-text">{slot.time}</span>
                  {!slot.available && <span className="unavailable-badge">Booked</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          Continue
        </button>
      </main>
    </div>
  )
}

export default DateSelection
