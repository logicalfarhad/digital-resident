// misc/Property.js - Simplified version with no class conflicts
import React, { useEffect } from 'react'
import './Property.css'
import { Link } from "react-router-dom"
import useEthPrice from '../../hooks/useEthPrice'

const Property = ({ property }) => {
  const { price: ethPriceUSD, up, loading, error } = useEthPrice();

  // Check if this is the special ETH property (300 ETH)
  const isEthProperty = property.isEthProperty || property.price === 300;

  // Calculate USD value for ETH properties
  const calculateUSDValue = () => {
    if (!isEthProperty || !ethPriceUSD) return null;
    return (property.price * ethPriceUSD).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get price indicator for ETH property
  const getPriceIndicator = () => {
    if (!isEthProperty || loading || error) return '';
    return up ? '↗️' : '↘️';
  };

  // Get USD price class based on direction
  const getUsdPriceClass = () => {
    if (loading) return 'usd-price loading';
    if (error) return 'usd-price error';
    if (!isEthProperty) return 'usd-price';
    return up ? 'usd-price price-up' : 'usd-price price-down';
  };

  // Debug logging - remove this after testing
  useEffect(() => {
    if (isEthProperty) {
      console.log('ETH Property Data:', {
        propertyPrice: property.price,
        ethPriceUSD,
        up,
        loading,
        error,
        calculatedUSD: calculateUSDValue()
      });
    }
  }, [ethPriceUSD, up, loading, error, isEthProperty]);

  return (
    <React.Fragment>
      <div className="property">
        <div className="property-image">
          <img src={property.images[0]} alt="property" />
          {isEthProperty && (
            <div className="eth-badge">
              <span className="eth-icon">⟠</span>
              <span>LIVE</span>
            </div>
          )}
        </div>
        <div className="property-details">
          <div className="property-details-2">
            <div className="property-details-2-l">
              <h3>{property.name}</h3>
              {isEthProperty ? (
                <div className="price-section">
                  <h3 className="eth-price">{property.price} ETH</h3>
                  {ethPriceUSD && !loading && !error && (
                    <p className={getUsdPriceClass()}>
                      {calculateUSDValue()} {getPriceIndicator()}
                    </p>
                  )}
                  {loading && (
                    <p className="usd-price loading">Loading price...</p>
                  )}
                  {error && (
                    <p className="usd-price error">Price unavailable</p>
                  )}
                </div>
              ) : (
                <h3>{property.price} ETH</h3>
              )}
            </div>
            <div className="property-details-2-r">
              <h3 className="profit">{property.profit}%</h3>
              <p className="profitability">profitability</p>
            </div>
          </div>
          <div className="property-details-1">
            <p>Funded by {property.investors} investors</p>
            <Link to={'property/' + property.id}>
              <button className="invest-button">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Property;