import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Avatar, AvatarGroup, CardHeader } from '@mui/material'

const User = ({ user }) => {
  return (
    <>
      <Link to={`/users/${user.id}`}>
        <Card
          className="!bg-my-green !text-center transform transition-transform hover:scale-105 hover:shadow-xl"
          data-testid="user-card"
        >
          <CardHeader title={user.username} />
          <CardContent className='flex !justify-center'>
            <AvatarGroup max={4}>
              {user.babies.length > 0 ? (user.babies.map(baby =>
                <Avatar key={baby.id} alt={`${baby.firstname}'s profilepic`} src={baby.profilepic} />
              )) : <p>Ei vielä vauvoja</p>}
            </AvatarGroup>
          </CardContent>
        </Card>
      </Link>
    </>
  )
}

export default User