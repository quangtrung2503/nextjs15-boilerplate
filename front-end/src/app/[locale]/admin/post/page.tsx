"use client"
import {default as CommonStyles} from "@/components/common"
import Post from "./post"
type IPostPageProps = {
    path: string
}

const PostPage = (props: IPostPageProps) => {
    return (
      <CommonStyles.Box>
        <Post />
      </CommonStyles.Box>
    );
}

export default PostPage;