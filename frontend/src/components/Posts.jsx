import { useSelector } from "react-redux"
import Post from "./Post"

const Posts = ({ baby, user }) => {
    const posts = useSelector((state) => state.posts)
    const babyPosts = posts.filter((p) => p.babyId === baby.id)

    if (!babyPosts) {
        return null
    }

    return (
        <>
            {babyPosts.map((post) => <Post user={user} baby={baby} post={post} />)}
        </>
    )
}

export default Posts