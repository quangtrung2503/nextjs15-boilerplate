import { Text } from '@fluentui/react-components';
import { ControllerFieldState } from 'react-hook-form';

const FormInfo = (props: ControllerFieldState): JSX.Element | null => {
    const { error, isTouched } = props;
    if (!error || !isTouched) return null;

    return (
        <Text >{error?.message}</Text>
    );
};

export default FormInfo;