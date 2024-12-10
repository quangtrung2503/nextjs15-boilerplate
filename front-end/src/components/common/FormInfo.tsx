import { Typography } from '@mui/material';
import { ControllerFieldState } from 'react-hook-form';

const FormInfo = (props: ControllerFieldState): JSX.Element | null => {
    const { error, isTouched } = props;
    if (!error || !isTouched) return null;

    return (
        <Typography color='error' >{error?.message}</Typography>
    );
};

export default FormInfo;