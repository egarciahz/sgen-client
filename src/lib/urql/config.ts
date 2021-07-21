import gql from 'graphql-tag';
import { dedupExchange, ClientOptions } from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';
import { getIntrospectedSchema } from '@urql/introspection';
import { simplePagination } from '@urql/exchange-graphcache/extras';

import { addAuthToOperation, didAuthError, willAuthError, getAuth } from '../auth/strategy';

import schema from '../../schema/schema.json';

const simpleOptions = {
    limitArgument: 'limit',
    offsetArgument: 'offset',
};

export const options: ClientOptions = {
    url: 'http://localhost',
    exchanges: [
        dedupExchange,
        cacheExchange({
            schema: getIntrospectedSchema(JSON.stringify(schema)),
            resolvers: {
                Query: {
                    users: simplePagination(simpleOptions),
                    people: simplePagination(simpleOptions),
                    places: simplePagination(simpleOptions),
                    costCenters: simplePagination(simpleOptions),
                    // location
                    addresses: simplePagination(simpleOptions),
                    countries: simplePagination(simpleOptions),
                    states: simplePagination(simpleOptions),
                    cities: simplePagination(simpleOptions),
                },
            },
            updates: {
                Mutation: {
                    signIn(result, _args, cache, _info) {
                        if (!result) return;
                        const autho = gql`
                            {
                                me {
                                    id
                                }
                            }
                        `;
                        cache.updateQuery<{ me: any }>({ query: autho }, data => {
                            if (data) {
                                data.me = result.signIn;
                            } else {
                                data = {
                                    me: result.signIn,
                                };
                            }

                            return data;
                        });
                    },
                },
            },
        }),
        authExchange({
            addAuthToOperation,
            willAuthError,
            didAuthError,
            getAuth,
        }),
        multipartFetchExchange,
    ],
    preferGetMethod: true,
};
