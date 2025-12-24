import { useState } from 'react'

interface BookingSummaryProps {
  shopId: string
  serviceIds: string[]
  date: Date
  timeSlot: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

interface Shop {
  id: string
  name: string
  address: string
  phone: string
}

function BookingSummary({ shopId, serviceIds, date, timeSlot, onConfirm, onCancel }: BookingSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data - should match the data from other components
  const shops: Shop[] = [
    { id: '1', name: 'Classic Cuts Barber Shop', address: '123 Main Street, Downtown', phone: '+1 234 567 8900' },
    { id: '2', name: 'Modern Trim Studio', address: '456 Oak Avenue, Midtown', phone: '+1 234 567 8901' },
    { id: '3', name: 'Gentleman\'s Grooming', address: '789 Pine Road, Uptown', phone: '+1 234 567 8902' },
    { id: '4', name: 'Style Masters Salon', address: '321 Elm Street, West End', phone: '+1 234 567 8903' },
  ]

  const allServices: Service[] = [
    { id: '1', name: 'Haircut', price: 450, duration: '30 min' },
    { id: '2', name: 'Beard Trim', price: 200, duration: '15 min' },
    { id: '3', name: 'Haircut + Beard', price: 600, duration: '45 min' },
    { id: '4', name: 'Hair Coloring', price: 800, duration: '60 min' },
    { id: '5', name: 'Facial', price: 500, duration: '45 min' },
    { id: '6', name: 'Head Massage', price: 300, duration: '20 min' },
  ]

  const selectedShop = shops.find(s => s.id === shopId)
  const selectedServices = allServices.filter(s => serviceIds.includes(s.id))
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = selectedServices.reduce((sum, service) => {
    const mins = parseInt(service.duration)
    return sum + mins
  }, 0)

  const handleConfirm = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onConfirm?.()
    }, 1500)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="page">
      <main className="summary-container">
        <div className="summary-header">
          <h1 className="summary-title">Booking Summary</h1>
          <p className="summary-subtitle">Review your booking details</p>
        </div>

        <div className="summary-card">
          <div className="summary-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h2 className="section-title">Shop Details</h2>
            </div>
            <div className="section-content">
              <p className="shop-name">{selectedShop?.name}</p>
              <p className="shop-info">{selectedShop?.address}</p>
              <p className="shop-info">{selectedShop?.phone}</p>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h2 className="section-title">Date & Time</h2>
            </div>
            <div className="section-content">
              <p className="booking-date">{formatDate(date)}</p>
              <p className="booking-time">{timeSlot}</p>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h2 className="section-title">Services</h2>
            </div>
            <div className="section-content">
              {selectedServices.map(service => (
                <div key={service.id} className="service-item">
                  <div className="service-details">
                    <p className="service-name">{service.name}</p>
                    <p className="service-duration">{service.duration}</p>
                  </div>
                  <p className="service-price">₹{service.price}</p>
                </div>
              ))}
              <div className="duration-info">
                <svg className="clock-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Total Duration: {totalDuration} mins</span>
              </div>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">₹{totalPrice}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button 
            className="cancel-button" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner" />
                Processing...
              </>
            ) : (
              'Confirm & Pay'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default BookingSummary
