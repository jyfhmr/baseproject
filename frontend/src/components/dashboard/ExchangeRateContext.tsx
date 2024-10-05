import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLastExchangeRates } from '@/services';
import { toast } from 'react-toastify';

interface ExchangeRate {
    currencyId: {
        symbol: string;
        file: string;
    };
    exchange: number;
}

interface ExchangeRateContextType {
    exchangeRates: ExchangeRate[];
    setExchangeRates: (
        rates: ExchangeRate[] | ((prevRates: ExchangeRate[]) => ExchangeRate[]),
    ) => void;
}

export const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export const ExchangeRateProvider = ({ children }: any) => {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const rates = await getLastExchangeRates();
            setExchangeRates(rates);
        };

        fetchExchangeRates();
    }, []);

    return (
        <ExchangeRateContext.Provider value={{ exchangeRates, setExchangeRates }}>
            {children}
        </ExchangeRateContext.Provider>
    );
};

export const useExchangeRate = (): ExchangeRateContextType => {
    const context = useContext(ExchangeRateContext);
    if (!context) {
        throw new Error('useExchangeRate must be used within a ExchangeRateProvider');
    }
    return context;
};
