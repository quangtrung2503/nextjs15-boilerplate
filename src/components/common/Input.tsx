import { Field, Input } from '@fluentui/react-components';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface CustomInputProps<T extends FieldValues> extends UseControllerProps<T> {
    label?: string;
    placeholder?: string;
    type?: "number" | "text" | "search" | "time" | "email" | "password" | "tel" | "url" | "date" | "datetime-local" | "month" | "week" | undefined;
}

const InputField = <T extends FieldValues>({
    label,
    placeholder,
    type = 'text',
    ...controllerProps
}: CustomInputProps<T>): JSX.Element => {
    const {
        field,
        fieldState: { error },
    } = useController(controllerProps);

    return (
        <Field
            {...field}
            label={label}
            validationMessage={error?.message}
        >
            <Input
                // {...field}
                id={controllerProps.name}
                name={controllerProps.name}
                type={type}
                placeholder={placeholder}
            />
        </Field>
    );
};

export default InputField;