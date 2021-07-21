import React, { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { useMutation, UseMutationResponse, useQuery } from 'urql';
import gql from 'graphql-tag';

import { removeToken, storeToken, tokenStractor } from './store';
import { AuthContext } from './IContext';
import { IUser, IAuth, ISignInOnMutationArguments } from '../../schema';

interface ProviderProps {
    children: ReactNode | ReactElement;
}

const authContext = createContext<AuthContext>({
    user: null,
    token: null,
    userId: null,
    logout() {
        throw new Error('Not yet implemented');
    },
});
authContext.displayName = 'AuthContext';

const tenantFragment = gql`
    fragment tenantFragment on Tenant {
        id
        token
        description
    }
`;

const permissionFragment = gql`
    fragment permissionFragment on Permission {
        id
        name
        description
    }
`;

const userFragment = gql`
    fragment userFragment on User {
        permissions {
            ...permissionFragment
        }
        roles {
            id
            name
            level
            isSpecial
            description
            permissions {
                ...permissionFragment
            }
        }
        tenant {
            ...tenantFragment
        }
        tenantId
        ownerId
        email
        id
    }
    ${tenantFragment}
    ${permissionFragment}
`;

export function useLogin(): UseMutationResponse<{ signIn: IAuth }, ISignInOnMutationArguments> {
    const [response, login] = useMutation<{ signIn: IAuth }, ISignInOnMutationArguments>(gql`
        mutation login($data: SiginIn!) {
            signIn(data: $data) {
                id
                token
                user {
                    ...userFragment
                }
            }
        }
        ${userFragment}
    `);

    useEffect(() => {
        if (response.data?.signIn?.token) {
            storeToken(response.data?.signIn?.token);
        }
    }, [response.data]);

    return [response, login];
}

export function useToken(): string | null {
    const { token } = useContext(authContext);
    return token || null;
}

export function useAuth() {
    return useContext(authContext);
}

export function useUserId() {
    const [response] = useQuery<{ me: IAuth }>({
        requestPolicy: 'cache-only',
        query: gql`
            query userId {
                me {
                    id
                }
            }
        `,
    });

    return response.data?.me.id ?? null;
}

export function useSessionUser() {
    const [user, setData] = useState<IUser | null>(null);
    const [response] = useQuery<{ me: IAuth | null }>({
        requestPolicy: 'cache-and-network',
        query: gql`
            query authData {
                me {
                    id
                    user {
                        ...userFragment
                    }
                    token
                }
            }
            ${userFragment}
        `,
    });

    useEffect(() => {
        if (response.data?.me) {
            const { user } = response.data.me!;
            setData(user);
        } else {
            setData(null);
        }
    }, [response.data, response.fetching]);

    if (response.fetching && !user) {
        return undefined;
    }
    return user;
}

export function useUserRoles() {
    const [roles, setRoles] = useState<IUser['roles']>(() => []);
    const user = useSessionUser();

    useEffect(() => {
        if (user) {
            setRoles(user?.roles);
        }
    }, [user]);

    return roles;
}

// export function useUserTenant(param?: { pause: boolean }) {
//     const [tenant, setData] = useState<ITenant | null | undefined>();
//     const [response] = useQuery<{ tenant: ITenant | null }>({
//         pause: param?.pause,
//         requestPolicy: 'cache-first',
//         query: `
//             query user_tenant {
//                 tenant {
//                     ...tenantFragment
//                 }
//             }
//             ${tenantFragment}
//         `,
//     });

//     useEffect(() => {
//         if (response.data?.tenant) {
//             setData(response.data.tenant);
//         } else {
//             setData(!tenant && response.fetching ? undefined : null);
//         }
//     }, [response.data, response.fetching]);

//     return tenant;
// }

export function AuthProvider({ children }: ProviderProps) {
    //const [statechange, dispatchChange] = useState();
    const user = useSessionUser();

    const logout = () => {
        removeToken();
    };

    const token = tokenStractor(false);

    return (
        <authContext.Provider
            value={{
                user,
                token,
                userId: user?.id || null,
                logout,
            }}
        >
            {children}
        </authContext.Provider>
    );
}
