"use client"
import {default as CommonStyles} from "@/components/common"
import User from "./user"
type IUserPageProps = {
    path: string
}

const UserPage = (props: IUserPageProps) => {
    return (
      <CommonStyles.Box>
        <User />
      </CommonStyles.Box>
    );
}

export default UserPage;