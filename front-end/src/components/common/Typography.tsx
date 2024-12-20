import { SxProps, Theme } from "@mui/material";
import TypographyMui, { TypographyProps } from "@mui/material/Typography";
import { useMemo } from "react";
import { useTheme } from "@mui/material";

export type TypeTypographyClient =
  | "size12Weight400"
  | "size12Weight600"
  | "size13Weight500"
  | "size13Weight600"
  | "size13Weight700"
  | "size14Weight400"
  | "size14Weight500"
  | "size14Weight600"
  | "size14Weight700"
  | "size15Weight300"
  | "size15Weight400"
  | "size15Weight500"
  | "size15Weight600"
  | "size15Weight700"
  | "size18Weight500"
  | "size18Weight600"
  | "size18Weight700"
  | "size16Weight600"
  | "size16Weight500"
  | "size20Weight600"
  | "size20Weight700"
  | "size20Weight800"
  | "size22Weight700"
  | "size23Weight300"
  | "size14Weight600"
  | "size16Weight400"
  | "size30Weight600"
  | "size13Weight400"
  | "size11Weight400"
  | "size10Weight600"
  | "size10Weight400"
  | "size11Weight600"
  | "size75Weight600"
  | "size25Weight600"
  | "size26Weight400"
  | "size9Weight600"
  | "size23Weight600"
  | "size36Weight700"
  | "size36Weight900"
  | "size48Weight700"
  | "size48Weight900"
  | "size64Weight700";

interface Props extends TypographyProps {
  type?: TypeTypographyClient;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
}

const Typography = (props: Props) => {
  //! State
  // const theme = useTheme();
  const { type = "size14Weight400", sx, ...restProps } = props;

  const sxCustomize: SxProps<Theme> | undefined = useMemo(() => {
    const styles = new Map<TypeTypographyClient, SxProps>();

    styles.set("size12Weight400", {
      fontSize: "12px",
      fontWeight: 400,
    });

    styles.set("size12Weight600", {
      fontSize: "12px",
      fontWeight: 600,
    });

    styles.set("size13Weight500", {
      fontSize: "13px",
      fontWeight: 500,
    });
    styles.set("size13Weight600", {
      fontSize: "13px",
      fontWeight: 600,
    });
    styles.set("size13Weight600", {
      fontSize: "13px",
      fontWeight: 700,
    });
    styles.set("size14Weight400", {
      fontSize: "14px", //0.875rem
      fontWeight: 400,
    });
    styles.set("size14Weight500", {
      fontSize: "14px", //0.875rem
      fontWeight: 500,
    });
    styles.set("size14Weight600", {
      fontSize: "14px", //0.875rem
      fontWeight: 600,
    });

    styles.set("size14Weight700", {
      fontSize: "14px", //0.875rem
      fontWeight: 700,
    });
    styles.set("size15Weight300", {
      fontSize: "15px", //0.875rem
      fontWeight: 300,
    });
    styles.set("size15Weight400", {
      fontSize: "15px", //0.875rem
      fontWeight: 400,
    });
    styles.set("size15Weight500", {
      fontSize: "15px", //0.875rem
      fontWeight: 500,
    });
    styles.set("size15Weight600", {
      fontSize: "15px", //0.875rem
      fontWeight: 600,
    });
    styles.set("size15Weight700", {
      fontSize: "15px", //0.875rem
      fontWeight: 700,
    });
    styles.set("size16Weight400", {
      fontSize: "16px",
      fontWeight: 400,
    });
    styles.set("size16Weight500", {
      fontSize: "16px",
      fontWeight: 400,
    });
    styles.set("size14Weight600", {
      fontSize: "14px", //0.875rem
      fontWeight: 600,
    });
    styles.set("size18Weight500", {
      fontSize: "18px",
      fontWeight: 500,
    });
    styles.set("size18Weight600", {
      fontSize: "18px",
      fontWeight: 600,
    });
    styles.set("size18Weight600", {
      fontSize: "18px",
      fontWeight: 700,
    });
    styles.set("size16Weight600", {
      fontWeight: 600,
      fontSize: "16px", //1rem
    });
    styles.set("size20Weight800", {
      fontSize: "20px",
      fontWeight: 800,
    });
    styles.set("size20Weight700", {
      fontSize: "20px",
      fontWeight: 700,
    });
    styles.set("size20Weight600", {
      fontSize: "20px",
      fontWeight: 600,
    });
    styles.set("size22Weight700", {
      fontSize: "22px",
      fontWeight: 700,
    });
    styles.set("size23Weight300", {
      fontSize: "23px",
      fontWeight: 300,
    });
    styles.set("size30Weight600", {
      fontSize: "30px", // 1.875rem
      fontWeight: 600,
    });
    styles.set("size13Weight400", {
      fontSize: "13px",
      fontWeight: 400,
    });
    styles.set("size11Weight400", {
      fontSize: "11px",
      fontWeight: 400,
    });
    styles.set("size10Weight400", {
      fontSize: "10px",
      fontWeight: 600,
    });
    styles.set("size10Weight600", {
      fontSize: "10px",
      fontWeight: 600,
    });
    styles.set("size11Weight600", {
      fontSize: "11px",
      fontWeight: 600,
    });
    styles.set("size75Weight600", {
      fontSize: "75px",
      fontWeight: 600,
    });
    styles.set("size25Weight600", {
      fontSize: "25px",
      fontWeight: 600,
    });
    styles.set("size23Weight600", {
      fontSize: "23px",
      fontWeight: 600,
    });
    styles.set("size26Weight400", {
      fontSize: "26px",
      fontWeight: 400,
    });
    styles.set("size9Weight600", {
      fontSize: "9px",
      fontWeight: 600,
    });
    styles.set("size36Weight900", {
      fontSize: "36px",
      fontWeight: 900,
    });
    styles.set("size36Weight700", {
      fontSize: "36px",
      fontWeight: 700,
    });
    styles.set("size48Weight700", {
      fontSize: "48px",
      fontWeight: 700,
    });
    styles.set("size48Weight900", {
      fontSize: "48px",
      fontWeight: 900,
    });
    styles.set("size64Weight700", {
      fontSize: "64px",
      fontWeight: 700,
    });
    

    return styles.get(type);
  }, [type]);

  //! Render
  return (
    <TypographyMui
      sx={
        {
          ...sxCustomize,
          ...sx,
        } as SxProps<Theme>
      }
      {...restProps}
    >
      {props.children}
    </TypographyMui>
  );
};

export default Typography;
