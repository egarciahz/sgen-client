import React from 'react';
import { Redirect } from 'react-router-dom';
import { SignProps } from './SignIn';

import { removeToken } from '../../lib/auth/store';
import { useGQLClient } from '../../lib/urql';

export default function SignOut({ defaultUrl }: SignProps) {
    const client = useGQLClient();
    removeToken();
    client.resetClient();

    return <Redirect to={defaultUrl} />;
}
