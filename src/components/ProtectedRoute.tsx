import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import Loading from './Loading';

interface ProtectedRouteProps extends Omit<RouteProps, 'render' | 'component'> {
    fallback: string;
    isLoggedIn: boolean | null;
}

export default function ProtectedRoute({ children, fallback, isLoggedIn, ...rest }: ProtectedRouteProps): React.ReactElement {
    return (
        <Route
            {...rest}
            render={({ match }) => {
                return isLoggedIn === null ? (
                    <Loading />
                ) : isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: `${fallback}?from=${match.url}`,
                            state: { from: match.url },
                        }}
                    />
                );
            }}
        />
    );
}
