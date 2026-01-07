import { useState, useEffect } from 'react'
import { getShops } from '../services/firestoreService'
import type { Shop } from '../services/firestoreService'

interface ShopSelectionProps {
  onShopSelect?: (shopId: string) => void
}

function ShopSelection({ onShopSelect }: ShopSelectionProps) {
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const fetchedShops = await getShops()
        setShops(fetchedShops)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching shops:', err)
        setError('Failed to load shops. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

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

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a5acba' }}>
            Loading shops...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {!loading && !error && shops.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a5acba' }}>
            No shops available. Click "Seed Test Data" button to create sample shops.
          </div>
        )}

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
