import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

type CopyrightProps = {
    title: string;
};
export default function Copyright({ title }: CopyrightProps) {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
                {title}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
