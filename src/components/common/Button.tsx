import type { ButtonProps } from "@mui/material";
import { Button as FlButton, Typography } from "@mui/material";

interface IButtonProps {
    label: string;
}

type CommonButtonProps = IButtonProps & ButtonProps;

export const CommonButton = (props: CommonButtonProps) => {
    const { label, ...rest } = props
    return (
        <FlButton {...rest}>
            <Typography >{label}</Typography>
        </FlButton>
    )
}