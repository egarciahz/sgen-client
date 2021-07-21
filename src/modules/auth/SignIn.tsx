import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Container, Box, Paper, Grid, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';

import { useLogin, useSessionUser } from '../../lib/auth';
import Copyright from '../../components/Copyright';
import Loading from '../../components/Loading';
import { useStyles } from './style';

export type SignProps = {
    defaultUrl: string;
};

export default function SignIn({ defaultUrl }: SignProps) {
    const classes = useStyles();
    const [uialert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const { state } = useLocation<{ from?: string }>();
    const [response, login] = useLogin();
    const user = useSessionUser();

    useEffect(() => {
        if (response.error) {
            setAlert({ message: response.error?.message, severity: 'error' });
        }
    }, [response.error]);

    const onSubmit = (data: any) => login({ data });

    if (user === undefined) {
        return <Loading />;
    }

    if (user) {
        return <Redirect to={state?.from ? state.from : defaultUrl} />;
    }

    return (
        <Container className="toolbar" component="main" maxWidth="xs">
            <Paper className={clsx(classes.paper)}>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <Link to="/">
                        <img src="/kyros_logo.png" width={150} alt="App Logo" />
                    </Link>
                </Box>

                <Formik
                    initialValues={{
                        password: '',
                        username: '',
                    }}
                    onSubmit={onSubmit}
                    validationSchema={yup.object({
                        password: yup
                            .string()
                            .min(8, 'At least 8 characters')
                            .max(20, 'Must be 20 characters or less')
                            .required('Required'),
                        username: yup.string().email().required('Required'),
                    })}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form className={classes.form}>
                            <Field
                                className={classes.field}
                                component={TextField}
                                name="username"
                                type="email"
                                label="Email"
                                variant="outlined"
                            />

                            <Field
                                className={classes.field}
                                component={TextField}
                                name="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                            />

                            {uialert && (
                                <MuiAlert className={classes.field} severity={uialert.severity} onClose={() => setAlert(null)}>
                                    {uialert?.message}
                                </MuiAlert>
                            )}
                            <Button
                                className={classes.submit}
                                onClick={submitForm}
                                disabled={isSubmitting}
                                startIcon={isSubmitting && <CircularProgress size={8} />}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Grid container direction="row-reverse">
                    <Grid item xs>
                        <Link to={'/forgot-password'}>
                            <span> Forgot password? </span>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
            <Box mt={8}>
                <Copyright title="Kyros" />
            </Box>

            {/* {response.data?.auth.user && <Redirect to={state?.from ? state.from : defaultUrl} />} */}
        </Container>
    );
}
