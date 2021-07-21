import React from 'react';
import { Box, Container, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonLink } from './Link';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        padding: theme.spacing(4, 0),
    },
    content: {
        margin: theme.spacing(2, 0),
        display: 'inline-block',
        position: 'relative',
        textAlign: 'center',
    },
    button: {
        borderRadius: 20,
    },
}));

interface PageNotFoundProps {
    defaultUrl?: string;
    title?: string;
}

export default function NotFound({ defaultUrl = '/', title = 'Page Not Found' }: PageNotFoundProps) {
    const classes = useStyles();

    return (
        <Container className={classes.root} maxWidth="md">
            <Typography variant="h1" color="textSecondary">
                <img src={'/404.png'} alt="404" style={{ maxHeight: 320, maxWidth: '100%' }} />
            </Typography>
            <Box className={classes.content}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                <Divider />
            </Box>
            <ButtonLink className={classes.button} to={defaultUrl} replace={true} variant="outlined" color="primary">
                Go Back
            </ButtonLink>
        </Container>
    );
}
