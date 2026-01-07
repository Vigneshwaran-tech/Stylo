import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getShopById, getServices, safeBookSlot } from '../services/firestoreService'
import { initiatePayment } from '../services/paymentService'
import type { Shop, Service } from '../services/firestoreService'

interface BookingSummaryProps {
  shopId: string
  serviceIds: string[]
  date: Date
  timeSlot: string
  onConfirm?: () => void
  onCancel?: () => void
}

function BookingSummary({ shopId, serviceIds, date, timeSlot, onConfirm, onCancel }: BookingSummaryProps) {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shop, setShop] = useState<Shop | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [fetchedShop, fetchedServices] = await Promise.all([
          getShopById(shopId),
          getServices(shopId),
        ])
        setShop(fetchedShop)
        const selectedServices = fetchedServices.filter(s => serviceIds.includes(s.id))
        setServices(selectedServices)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [shopId, serviceIds])

  const totalPrice = services.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = services.reduce((sum, service) => sum + (typeof service.duration === 'string' ? parseInt(service.duration) : service.duration), 0)

  const handleConfirm = async () => {
    if (!user || !shop) return
    
    setIsProcessing(true)
    setError(null)

    try {
      // Initiate payment
      const paymentResult = await initiatePayment({
        amount: totalPrice,
        name: shop.name,
        description: `Booking at ${shop.name}`,
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
      })

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment failed')
        setIsProcessing(false)
        return
      }

      // Payment successful - create booking in Firestore
      const dateStr = date.toISOString().split('T')[0]
      await safeBookSlot(user.uid, shopId, dateStr, timeSlot, serviceIds)

      console.log('Payment ID:', paymentResult.paymentId)
      console.log('Booking confirmed!')
      
      setIsProcessing(false)
      onConfirm?.()
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'Booking failed. Please try again.')
      setIsProcessing(false)
    }
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

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#a5acba' }}>
          Loading booking details...
        </div>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          {error || 'Shop not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <main className="summary-container">
        <div className="summary-header">
          <h1 className="summary-title">Booking Summary</h1>
          <p className="summary-subtitle">Review your booking details</p>
        </div>

        {error && (
          <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px' }}>
            {error}
          </div>
        )}

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
              <p className="shop-name">{shop?.name}</p>
              <p className="shop-info">{shop?.address}</p>
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
              {services.map(service => (
                <div key={service.id} className="service-item">
                  <div className="service-details">
                    <p className="service-name">{service.name}</p>
                    <p className="service-duration">{service.duration} min</p>
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
