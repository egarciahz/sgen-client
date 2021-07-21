import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Container, Typography, Paper, Grid, Box } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
// import { useMutation } from "urql";
import { Form, Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';

import Copyright from '../../components/Copyright';
import { useStyles } from './style';

export default function ForgotPassword() {
    const classes = useStyles();
    const [uialert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    // const [response, forgotPassword] = useMutation<{ user: { email: string } }>(`
    //     mutation ($email: String!){
    //         user: forgotPassword(email: $password){
    //             email
    //         }
    //     }
    // `);

    // useEffect(() => {
    //     if (response.data?.user.email) {
    //         setAlert({ message: "The recovery mail It has been sent", severity: "success" });
    //     }

    //     if (response.error?.message) {
    //         setAlert({ message: response.error?.message, severity: "error" });
    //     }
    // }, [response]);

    const onSubmit = (data: any) => Promise.resolve();

    return (
        <Container className="toolbar" component="main" maxWidth="xs">
            <Paper className={clsx(classes.paper)}>
                <Typography component="h1" variant="h5">
                    {' '}
                    Forgot Password{' '}
                </Typography>
                <Formik
                    initialValues={{
                        password: '',
                        confirm: '',
                    }}
                    onSubmit={onSubmit}
                    validationSchema={yup.object({
                        email: yup.string().email().required('Required'),
                    })}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form className={classes.form}>
                            <Field
                                className={classes.field}
                                component={TextField}
                                name="email"
                                type="email"
                                label="Email"
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
                        <Link to={'/sign-in'}>
                            <span> Sign In </span>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
            <Box mt={8}>
                <Copyright title="Kyros" />
            </Box>
        </Container>
    );
}
