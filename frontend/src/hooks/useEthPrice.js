// hooks/useEthPrice.js
import { useContext } from 'react';
import { EthPriceContext } from '../context/EthPriceContext';

const useEthPrice = () => {
    return useContext(EthPriceContext);
};

export default useEthPrice;