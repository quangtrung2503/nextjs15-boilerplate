"use client"
import {default as CommonStyles} from "@/components/common"
import Theme from "./theme"
type IThemePageProps = {
    path: string
}

const ThemePage = (props: IThemePageProps) => {
    return (
      <CommonStyles.Box>
        <Theme/>
      </CommonStyles.Box>
    );
}

export default ThemePage;