import type { ButtonProps } from "@fluentui/react-components";
import { Button as FlButton, Label } from "@fluentui/react-components";

interface IButtonProps {
    label: string;
}

type CommonButtonProps = IButtonProps & ButtonProps;

export const CommonButton = (props: CommonButtonProps) => {
    const { label, ...rest } = props
    return (
        <FlButton {...rest}>
            <Label size="small">{label}</Label>
        </FlButton>
    )
}