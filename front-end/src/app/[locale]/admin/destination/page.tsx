"use client"
import {default as CommonStyles} from "@/components/common"
import Destination from "./destination"
type IDestinationPageProps = {
    path: string
}

const DestinationPage = (props: IDestinationPageProps) => {
    return (
      <CommonStyles.Box>
        <Destination />
      </CommonStyles.Box>
    );
}

export default DestinationPage;