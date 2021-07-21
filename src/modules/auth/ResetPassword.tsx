import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Container, Typography, Paper, Box } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useParams } from 'react-router-dom';
// import { useMutation } from "urql";
import { Form, Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';

import Copyright from '../../components/Copyright';
import { useStyles } from './style';

export default function ResetPassword() {
    const classes = useStyles();
    const { token } = useParams<{ token?: string }>();
    // const Navigator = useHistory();
    const [uialert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    // const [response, resetPassword] = useMutation<{ auth: IAuth }>(`
    //     mutation ($password: String!, $token: String!){
    //         auth: resetPassword(password: $password, token: $token){
    //             token
    //         }
    //     }
    // `);

    // useEffect(() => {
    //     if (response.data?.auth.token) {
    //         setAlert({ message: "Reset password successfully", severity: "success" });
    //         setTimeout(() => {
    //             Navigator.push("/login");
    //         }, 300)
    //     }

    //     if (response.error?.message) {
    //         setAlert({ message: response.error?.message, severity: "error" });
    //     }
    // }, [Navigator, response])

    const onSubmit = (data: any) => Promise.resolve(token);

    return (
        <Container className="toolbar" component="main" maxWidth="xs">
            <Paper className={clsx(classes.paper)}>
                <Typography component="h1" variant="h5">
                    {' '}
                    Reset Password{' '}
                </Typography>
                <Formik
                    initialValues={{
                        password: '',
                        confirm: '',
                    }}
                    onSubmit={onSubmit}
                    validationSchema={yup.object({
                        password: yup
                            .string()
                            .min(8, 'At least 8 characters')
                            .max(20, 'Must be 20 characters or less')
                            .required('Required'),
                        confirm: yup
                            .string()
                            .min(8, 'At least 8 characters')
                            .max(20, 'Must be 20 characters or less')
                            .oneOf([yup.ref('password')], 'Passwords must match')
                            .required('Required'),
                    })}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form className={classes.form}>
                            <Field
                                className={classes.field}
                                component={TextField}
                                name="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                            />

                            <Field
                                className={classes.field}
                                component={TextField}
                                name="confirm"
                                type="password"
                                label="Confirm Password"
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
            </Paper>

            <Box mt={8}>
                <Copyright title="Kyros" />
            </Box>
        </Container>
    );
}
