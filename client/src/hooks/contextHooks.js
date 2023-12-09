import React, { useContext, useState } from 'react';

const DetailsContext = React.createContext();

export function useDetails() {
	return useContext(DetailsContext);
}

export function DetailsProvider({ children }) {
    const [chainId, setChainId] = useState();

	
	return (
		<DetailsContext.Provider
			value={{
                chainId,
                setChainId
			}}
		>
			{children}
		</DetailsContext.Provider>
	);
}