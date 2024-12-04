import React from 'react';
import { Alert, AlertProps } from '@mui/material';

interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
    message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, ...props }) => {
    return (
        <Alert severity="error" {...props}>
            {message}
        </Alert>
    );
};

export default ErrorAlert;
