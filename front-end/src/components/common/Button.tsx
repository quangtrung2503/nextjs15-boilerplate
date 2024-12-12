import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { SxProps } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";

export type ColorButton = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'outlined';
export type Variant= 'text' | 'outlined' | 'contained';
interface IButtonProps {
    label?: string;
    className?: string;
    colorBtn?: ColorButton;
    variant?: 'text' | 'outlined' | 'contained';
    loading?: boolean;
    startIcon?: ReactNode;
    children?: ReactNode;
}

type CommonButtonProps = IButtonProps & ButtonProps;

export const CommonButton = (props: CommonButtonProps) => {
  
  const { 
    startIcon,
    label,
    className,
    loading,
    variant="contained",
    colorBtn="primary",
    sx, 
    children,
    ...rest } = props

  const stylesByColor = useMemo(() => {
    const styled = new Map<ColorButton, SxProps>();
    const styledVariant = new Map<Variant, SxProps>();

    styled.set('primary', {
      color: "#1C2B38",
      background:
        variant==="outlined" ? "transparent" : "#FFDA32",
    });

    styled.set('info',{
      color: "#FFFFFF",
      background: "#495560"
    })

    styledVariant.set('outlined',{
      color: "#495560",
      borderColor: '#7BBCB0',
      background: "transparent",
      '&.rounded':{
        borderRadius: '30px',
      },
      ':active': {
        color: "#FFF",
        backgroundColor: "#7BBCB0"
      },
      '&.active': {
        color: "#FFF",
        backgroundColor: "#7BBCB0",
      },
      '&.outlined':{
        borderRadius: '40px',
        border: "none",
        color: "#1C2B38",
        boxShadow: "0px 8px 20px 0px #FFDA3280",
        backgroundColor: "#FFDA32"
      }
    })

    return {
      fontSize: '16px',
      textTransform: 'capitalize',
      boxShadow: 'none',
      height: '50px',
      padding: '16.5px 14px',
      borderRadius: '3px',
      ':disabled': {
        opacity: 0.6,
      },
      ...styled.get(colorBtn),
      ...styledVariant.get(variant),
      ...sx,
    };
  }, [colorBtn, sx, variant]) as SxProps;


    return (
        <Button
          startIcon={startIcon}
          className={className}
          sx={{...stylesByColor}}
          variant={variant}
          {...rest}>
            {label}
            {children}
        </Button>
    )
}