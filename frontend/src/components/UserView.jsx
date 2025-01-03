import { useParams } from 'react-router-dom'
import Baby from './Baby'
import BabyForm from './BabyForm'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { followUser, unfollowUser } from '../reducers/usersReducer'

const UserView = () => {
  const id = useParams().id
  const users = useSelector((state) => state.users)
  const user = users.find((u) => u.id === Number(id))
  const babies = useSelector((state) => state.babies) // this is because the users state is not updated when adding baby
  const userBabies = user ? babies.filter((b) => b.userId === user.id) : []
  const loggedUser = useSelector((state) => state.user)
  const [addBaby, setAddBaby] = useState(false)
  const [addButtonText, setAddButtonText] = useState('Lisää vauva')
  const [followButtonText, setFollowButtonText] = useState('Seuraa')
  const [isFollowing, setIsFollowing] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const followerIds = user.followers ? user.followers.map((u) => u.id) : []
      if (followerIds.includes(loggedUser.id)) {
        setFollowButtonText('Lopeta seuraaminen')
        setIsFollowing(true)
      } else {
        setFollowButtonText('Seuraa')
        setIsFollowing(false)
      }
    }
  }, [user, loggedUser])

  if (!user) {
    return <p>Käyttäjää ei löydy</p>
  }

  const handleAddBaby = () => {
    setAddBaby((prevState) => {
      const newAddBaby = !prevState
      setAddButtonText(newAddBaby ? 'Sulje lomake' : 'Lisää vauva')
      return newAddBaby
    })
  }

  const handleFollowUser = async () => {
    dispatch(followUser(loggedUser.id, user.id))
  }

  const handleUnfollowUser = async () => {
    dispatch(unfollowUser(loggedUser.id, user.id))
  }

  return (
    <div>
      <h1>Käyttäjän {user.username} vauvat:</h1>
      <div className="container">
        <div className="grid gap-5 md:grid-cols-3">
          {userBabies.length > 0 ? (
            userBabies.map(baby => (
              <Baby key={baby.id} baby={baby} userId={id} />
            ))
          ) : (
            <p>Käyttäjällä ei ole vielä vauvoja lisättynä.</p>
          )}
        </div>
        {user.id === loggedUser.id ?
          (
            <button onClick={handleAddBaby}
              className="font-semibold hover:font-bold flex justify-self-center text-lg py-4">
              {addButtonText}
            </button>
          ) :
          (
            <button onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
              className="font-semibold hover:font-bold flex justify-self-center text-lg py-4">
              {followButtonText}
            </button>
          )
        }
        {addBaby && <BabyForm />}
      </div>
    </div>

  )
}

export default UserView