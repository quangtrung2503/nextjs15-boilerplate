import AvatarMui, { AvatarProps } from "@mui/material/Avatar";
import CommonIcons from "../CommonIcons";

function Avatar(props: AvatarProps) {
  return (
    <AvatarMui {...props}>
      {props.src ? null : <CommonIcons.Avatar1 />}
    </AvatarMui>
  );
}

export default Avatar;
