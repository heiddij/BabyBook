import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import { CardHeader, CardMedia } from '@mui/material'


const Baby = ({ baby, userId }) => {
  return (
    <>
      <Link to={`/users/${userId}/${baby.id}`}>
        <Card className="!bg-my-green !text-center transform transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader title={baby.firstname} />
          <CardMedia sx={{ height: 150 }} image={baby.profilepic || '/profile.jpg'} title={`${baby.firstname}'s profilepic`} />
        </Card>
      </Link>
    </>
  )
}

export default Baby