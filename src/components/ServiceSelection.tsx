import { useState } from 'react'

interface Service {
  id: string
  name: string
  price: number
  duration: string
  description?: string
  image?: string
}

interface ServiceSelectionProps {
  shopId: string
  onServiceSelect?: (serviceId: string) => void
  onBack?: () => void
}

function ServiceSelection({ shopId, onServiceSelect, onBack }: ServiceSelectionProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Mock data - replace with API call based on shopId
  const services: Service[] = [
    {
      id: '1',
      name: 'Haircut',
      price: 450,
      duration: '30 min',
      description: 'Professional haircut and styling',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=250&fit=crop'
    },
    {
      id: '2',
      name: 'Beard Trim',
      price: 200,
      duration: '15 min',
      description: 'Precise beard trim and shaping',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=250&fit=crop'
    },
    {
      id: '3',
      name: 'Haircut + Beard',
      price: 600,
      duration: '45 min',
      description: 'Complete grooming package',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=250&fit=crop'
    },
    {
      id: '4',
      name: 'Hair Coloring',
      price: 800,
      duration: '60 min',
      description: 'Premium hair coloring service',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=250&fit=crop'
    },
    {
      id: '5',
      name: 'Facial',
      price: 500,
      duration: '40 min',
      description: 'Refreshing facial treatment',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop'
    },
    {
      id: '6',
      name: 'Head Massage',
      price: 300,
      duration: '20 min',
      description: 'Relaxing head and scalp massage',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop'
    }
  ]

  const handleServiceClick = (serviceId: string) => {
    setSelectedServices((prev) => 
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      onServiceSelect?.(selectedServices.join(','))
    }
  }

  return (
    <div className="page">
      <main className="service-container">
        <div className="service-header">
          {onBack && (
            <button className="back-button" onClick={onBack} aria-label="Go back">
              <svg viewBox="0 0 24 24" className="back-icon">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="service-title">Select Your Service</h1>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <button
              key={service.id}
              className={`service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}
              onClick={() => handleServiceClick(service.id)}
              style={{
                backgroundImage: service.image ? `url(${service.image})` : 'none'
              }}
            >
              <div className="service-overlay" />
              <div className="service-content">
                <div className="service-main">
                  <h3 className="service-name">{service.name}</h3>
                  <span className="service-duration">{service.duration}</span>
                </div>
                <div className="service-price">₹{service.price}</div>
              </div>

              {selectedServices.includes(service.id) && (
                <div className="service-check">
                  <svg viewBox="0 0 24 24" className="check-icon">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedServices.length > 0 && (
          <div className="price-summary">
            <div className="summary-row">
              <span className="summary-label">
                {selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'} selected
              </span>
              <span className="summary-total">₹{getTotalPrice()}</span>
            </div>
          </div>
        )}

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
        >
          Continue
        </button>
      </main>
    </div>
  )
}

export default ServiceSelection
