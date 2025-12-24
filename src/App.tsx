import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import ShopSelection from './components/ShopSelection'
import ServiceSelection from './components/ServiceSelection'
import DateSelection from './components/DateSelection'
import BookingSummary from './components/BookingSummary'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleShopSelect = (shopId: string) => {
    setSelectedShop(shopId)
  }

  const handleServiceSelect = (serviceIds: string) => {
    setSelectedService(serviceIds)
  }

  const handleDateSelect = (date: Date, timeSlot: string) => {
    setSelectedDate(date)
    setSelectedTimeSlot(timeSlot)
    console.log('Selected date:', date, 'Time slot:', timeSlot)
  }

  const handleBackToShops = () => {
    setSelectedShop(null)
  }

  const handleBackToServices = () => {
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleBackToDate = () => {
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleConfirmBooking = () => {
    setIsBookingConfirmed(true)
    console.log('Booking confirmed!')
  }

  const handleCancelBooking = () => {
    setSelectedShop(null)
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  if (isBookingConfirmed) {
    return (
      <div className="page">
        <div className="confirmation-container">
          <div className="confirmation-icon">✓</div>
          <h1 className="confirmation-title">Booking Confirmed!</h1>
          <p className="confirmation-text">Your appointment has been successfully booked.</p>
          <button className="home-button" onClick={() => {
            setIsBookingConfirmed(false)
            setSelectedShop(null)
            setSelectedService(null)
            setSelectedDate(null)
            setSelectedTimeSlot(null)
          }}>Back to Home</button>
        </div>
      </div>
    )
  }

  if (isAuthenticated && selectedShop && selectedService && selectedDate && selectedTimeSlot) {
    return (
      <BookingSummary
        shopId={selectedShop}
        serviceIds={selectedService.split(',')}
        date={selectedDate}
        timeSlot={selectedTimeSlot}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
    )
  }

  if (isAuthenticated && selectedShop && selectedService) {
    return (
      <DateSelection 
        shopId={selectedShop}
        serviceIds={selectedService.split(',')}
        onDateSelect={handleDateSelect}
        onBack={handleBackToDate}
      />
    )
  }

  if (isAuthenticated && selectedShop) {
    return (
      <ServiceSelection 
        shopId={selectedShop}
        onServiceSelect={handleServiceSelect}
        onBack={handleBackToShops}
      />
    )
  }

  if (isAuthenticated) {
    return <ShopSelection onShopSelect={handleShopSelect} />
  }

  return (
    <>
      {isLogin ? (
        <Login 
          onSwitchToSignup={() => setIsLogin(false)} 
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        <Signup 
          onSwitchToLogin={() => setIsLogin(true)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  )
}

export default App
