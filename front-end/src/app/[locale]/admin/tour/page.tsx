"use client"
import {default as CommonStyles} from "@/components/common"
import Tour from "./tour"
type ITourPageProps = {
    path: string
}

const TourPage = (props: ITourPageProps) => {
    return (
      <CommonStyles.Box>
        <Tour/>
      </CommonStyles.Box>
    );
}

export default TourPage;