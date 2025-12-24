import { useState } from 'react'

interface Shop {
  id: string
  name: string
  address: string
  rating: number
  distance: string
  image?: string
}

interface ShopSelectionProps {
  onShopSelect?: (shopId: string) => void
}

function ShopSelection({ onShopSelect }: ShopSelectionProps) {
  const [selectedShop, setSelectedShop] = useState<string | null>(null)

  // Mock data - replace with API call
  const shops: Shop[] = [
    {
      id: '1',
      name: 'Style Master Barber',
      address: '123 Main Street, Downtown',
      rating: 4.8,
      distance: '0.5 km',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Classic Cuts Studio',
      address: '456 Oak Avenue, City Center',
      rating: 4.6,
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Elite Grooming Lounge',
      address: '789 Pine Road, Westside',
      rating: 4.9,
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      name: 'Premium Barber Shop',
      address: '321 Elm Street, Eastside',
      rating: 4.7,
      distance: '1.8 km',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop'
    }
  ]

  const handleShopClick = (shopId: string) => {
    setSelectedShop(shopId)
  }

  const handleContinue = () => {
    if (selectedShop) {
      onShopSelect?.(selectedShop)
    }
  }

  return (
    <div className="page">
      <main className="selection-container">
        <div className="selection-header">
          <h1 className="selection-title">Select a Barber Shop</h1>
          <p className="selection-subtitle">Choose your preferred location</p>
        </div>

        <div className="shops-grid">
          {shops.map((shop) => (
            <button
              key={shop.id}
              className={`shop-card ${selectedShop === shop.id ? 'selected' : ''}`}
              onClick={() => handleShopClick(shop.id)}
            >
              {shop.image && (
                <div className="shop-image">
                  <img src={shop.image} alt={shop.name} />
                </div>
              )}

              <div className="shop-info">
                <h3 className="shop-name">{shop.name}</h3>
                <p className="shop-address">{shop.address}</p>
                
                <div className="shop-meta">
                  <div className="shop-rating">
                    <svg viewBox="0 0 24 24" className="star-icon">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{shop.rating}</span>
                  </div>
                  <div className="shop-distance">
                    <svg viewBox="0 0 24 24" className="location-icon">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{shop.distance}</span>
                  </div>
                </div>
              </div>

              {selectedShop === shop.id && (
                <div className="shop-check">
                  <svg viewBox="0 0 24 24" className="check-icon">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedShop}
        >
          Continue
        </button>
      </main>
    </div>
  )
}

export default ShopSelection
