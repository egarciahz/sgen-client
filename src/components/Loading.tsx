import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loading() {
    return (
        <Container component="main" maxWidth="xs">
            <Box margin="auto" display="block" paddingTop={16}>
                <CircularProgress
                    style={{
                        margin: 'auto',
                        display: 'block',
                    }}
                />
            </Box>
        </Container>
    );
}
