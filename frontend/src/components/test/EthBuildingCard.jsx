import useEthPrice from '../../hooks/useEthPrice';
import './EthBuildingCard.css';

const EthBuildingCard = () => {
    const { price, lastUpdated, up, loading, error, refreshPrice } = useEthPrice();

    const ETH_AMOUNT = 300;
    const totalValue = price ? price * ETH_AMOUNT : 0;

    const formatPrice = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatEthPrice = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getBackgroundClass = () => {
        if (loading || error) return 'bg-gray';
        return up ? 'bg-green' : 'bg-red';
    };

    const getPriceIndicator = () => {
        if (loading || error) return '';
        return up ? '↗️' : '↘️';
    };

    const getPriceChangeText = () => {
        if (loading || error) return '';
        return up ? 'Price Increased' : 'Price Decreased';
    };

    return (
        <div className={'eth-building-card ' + getBackgroundClass()}>
            <div className="card-header">
                <div className="building-info">
                    <h3 className="building-title">Premium ETH Building</h3>
                    <p className="building-subtitle">Luxury Real Estate Investment</p>
                </div>
                <div className="price-indicator-section">
                    <span className="price-indicator">{getPriceIndicator()}</span>
                    {!loading && !error && (
                        <span className="price-change-text">{getPriceChangeText()}</span>
                    )}
                </div>
            </div>

            <div className="price-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading current price...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>⚠️ Price temporarily unavailable</p>
                        <p className="error-message">{error}</p>
                        <button className="retry-btn" onClick={refreshPrice}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="total-value">
                            <span className="value-label">Total Property Value</span>
                            <span className="value-amount">{formatPrice(totalValue)}</span>
                        </div>

                        <div className="eth-details">
                            <div className="eth-amount-section">
                                <span className="eth-amount">{ETH_AMOUNT} ETH</span>
                                <span className="eth-label">Ethereum Holdings</span>
                            </div>
                            <div className="eth-price-section">
                                <span className="eth-price">{formatEthPrice(price)}</span>
                                <span className="eth-price-label">per ETH</span>
                            </div>
                        </div>

                        <div className="last-updated">
                            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
                            <button className="refresh-btn" onClick={refreshPrice} title="Refresh price">
                                🔄
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="card-actions">
                <button className="btn-primary">View Property Details</button>
                <button className="btn-secondary">Investment Calculator</button>
            </div>
        </div>
    );
};

export default EthBuildingCard;