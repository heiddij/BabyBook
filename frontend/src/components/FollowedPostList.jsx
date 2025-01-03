import { useSelector } from "react-redux"
import Post from "./Post"


const FollowedPostsList = () => {
    const followedPosts = useSelector((state) => state.followedPosts)

    const sortedPosts = followedPosts
        ? [...followedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : []

    return (
        <>
            <h1>BabyBook</h1>
            <div className="container mx-auto flex justify-center items-center flex-col">
                {sortedPosts.length > 0 ? (sortedPosts.map((post) => 
                    <Post key={post.postId} user={post.followingUser} baby={post.baby} post={post} />
                )) : <p>Ei julkaisuja saatavilla</p>}
            </div>
        </>
    )
}

export default FollowedPostsList