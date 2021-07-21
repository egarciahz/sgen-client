import React, { createContext, useContext, useState } from 'react';
import { Provider as GraphQLProvider } from 'urql';
import { ClientOptions, createClient } from '@urql/core';

interface IGQLContext {
    resetClient(): void;
}

interface GQLProviderProps {
    options: ClientOptions;
    children: React.ReactNode;
}

const Context = createContext<IGQLContext>({
    resetClient() {
        throw new Error('Not yet implemented');
    },
});

export const GQLProvider = ({ children, options }: GQLProviderProps) => {
    const [client, setClient] = useState(() => createClient(options));
    return (
        <Context.Provider
            value={{
                resetClient: () => setClient(createClient(options)),
            }}
        >
            <GraphQLProvider value={client}>{children}</GraphQLProvider>
        </Context.Provider>
    );
};

export const useGQLClient = () => {
    return useContext(Context);
};
