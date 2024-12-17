"use client"
import {default as CommonStyles} from "@/components/common"
import Admin from "./admin"
type IAdminPageProps = {
    path: string
}

const AdminPage = (props: IAdminPageProps) => {
    return (
      <CommonStyles.Box>
        <Admin />
      </CommonStyles.Box>
    );
}

export default AdminPage;