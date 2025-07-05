import { createContext, useState, useEffect, useCallback } from 'react';

export const EthPriceContext = createContext();

export const EthPriceProvider = ({ children }) => {
    const [ethData, setEthData] = useState({
        price: null,
        lastUpdated: null,
        up: false,
        loading: true,
        error: null
    });

    const fetchEthPrice = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/eth-price');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched ETH price data:', data);
            setEthData({
                price: data.price,
                lastUpdated: data.lastUpdated,
                up: data.up,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching ETH price:', error);
            setEthData(prev => ({
                ...prev,
                loading: false,
                error: error.message,
            }));
        }
    }, []);

    useEffect(() => {
        fetchEthPrice();
        const interval = setInterval(fetchEthPrice, 10000);
        return () => clearInterval(interval);
    }, [fetchEthPrice]);

    return (
        <EthPriceContext.Provider value={ethData}>
            {children}
        </EthPriceContext.Provider>
    );
};