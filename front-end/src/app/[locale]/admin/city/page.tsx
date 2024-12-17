"use client"
import {default as CommonStyles} from "@/components/common"
import City from "./city"
type ICityPageProps = {
    path: string
}

const CityPage = (props: ICityPageProps) => {
    return (
      <CommonStyles.Box>
        <City/>
      </CommonStyles.Box>
    );
}

export default CityPage;