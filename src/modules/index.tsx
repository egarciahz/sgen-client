import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import PageNotFound from '../components/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/layout/header';
import { ButtonLink } from '../components/Link';
import { useSessionUser } from '../lib/auth';

import { SignIn, ForgotPassword, ResetPassword, SignOut } from './auth';
import Home from './home';

const DefaultHeader = (props: { children?: React.ReactElement }) => (
    <Header BrandIcon={<img src="/kyros_mipmap.png" width={120} alt="Kyros" />} subTitle="B1 Geoplus" {...props} />
);

export default function Routes() {
    const user = useSessionUser();
    const isLoggedIn = Boolean(user);
    return (
        <Router>
            <Switch>
                <Route path={'/'} exact>
                    <DefaultHeader>
                        <ButtonLink to={isLoggedIn ? '/dashboard' : '/sign-in'} title="Sign In" size="medium" variant="outlined">
                            Sign In
                        </ButtonLink>
                    </DefaultHeader>
                    <Home />
                </Route>

                <Route path={'/sign-in'}>
                    <DefaultHeader />
                    <div className="toolbar">
                        <SignIn defaultUrl="/dashboard" />
                    </div>
                </Route>

                <Route path={'/sign-out'}>
                    <SignOut defaultUrl="/" />
                </Route>

                <Route path={'/forgot-password/'}>
                    <DefaultHeader />
                    <div className="toolbar">
                        <ForgotPassword />
                    </div>
                </Route>

                <Route path={'/reset-password/:token/'}>
                    <DefaultHeader />
                    <div className="toolbar">
                        <ResetPassword />
                    </div>
                </Route>

                <ProtectedRoute isLoggedIn={true} path={'/dashboard'} fallback={'/sign-in'}>
                    <main>Protectred main</main>
                </ProtectedRoute>

                <Route path={'*'}>
                    <PageNotFound defaultUrl="/" />
                </Route>
            </Switch>
        </Router>
    );
}
