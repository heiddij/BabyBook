import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import BabyForm from './BabyForm'
import BabyPostForm from './BabyPostForm'
import { deleteBaby } from '../../reducers/babyReducer'
import { formatDate } from '../../utils/formatDate'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import PostList from '../post/PostList'

const BabyView = () => {
  const babies = useSelector((state) => state.babies)
  const users = useSelector((state) => state.users)
  const babyId = useParams().babyId
  const userId = useParams().id
  const baby = babies.find((b) => b.id === Number(babyId))
  const user = users.find((u) => u.id === Number(userId))
  const loggedUser = useSelector((state) => state.user)
  const [modifyBaby, setModifyBaby] = useState(false)
  const [buttonText, setButtonText] = useState('Muokkaa tietoja')
  const [openDialog, setOpenDialog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!baby) {
    return <p>Vauvaa ei löydy</p>
  }

  if (!loggedUser) {
    return <p>Kirjaudu sisään nähdäksesi vauvan tiedot</p>
  }

  const isLoggedUser = loggedUser.id === baby.userId

  const handleModifyBaby = () => {
    setModifyBaby((prevState) => {
      const newModifyBaby = !prevState
      setButtonText(newModifyBaby ? 'Sulje lomake' : 'Muokkaa tietoja')
      return newModifyBaby
    })
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleDeleteBaby = () => {
    try {
      dispatch(deleteBaby(baby.id))
      navigate(`/users/${loggedUser.id}`)
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h2>Vauvakirja</h2>
      <div className="container mx-auto flex justify-center items-center flex-col">
        {baby.profilepic ? (
          <img
            src={baby.profilepic}
            alt={`${baby.firstname}'s profile`}
            className="w-96 h-96 rounded-full object-cover mb-4"
          />
        ) : (
          <img src="/profile.jpg" alt="empty profilepic" className="w-72 h-72 rounded-md object-cover mb-4" />
        )}
        <h2 className="text-xl font-semibold">{baby.firstname} {baby.lastname}</h2>
        <p className="text-lg">{formatDate(baby.birthdate)}</p>
        <p className="text-lg">{baby.birthplace}</p>
        {isLoggedUser &&
          <div>
            <button onClick={handleClickOpen}
              className="font-semibold bg-my-pink hover:scale-105 flex justify-self-center text-lg p-4"
              data-testid="open-dialog-button"
            >
              Poista
            </button>
            <button onClick={handleModifyBaby}
              className="font-semibold hover:scale-105 flex justify-self-center text-lg py-4"
            >
              {buttonText}
            </button>
          </div>
        }
        {modifyBaby && <BabyForm baby={baby} />}
        <Dialog
          open={openDialog}
          onClose={handleClose}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
        >
          <DialogTitle id="alert-dialog-title">
            {`Poistetaanko vauva ${baby.firstname}?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Peruuta</Button>
            <Button
              className="!text-red-400 hover:!bg-red-50"
              onClick={handleDeleteBaby}
              autoFocus
              data-testid="confirm-delete-button"
            >
              Poista
            </Button>
          </DialogActions>
        </Dialog>
        {isLoggedUser &&
          <BabyPostForm baby={baby} />
        }
        <PostList baby={baby} user={user} />
      </div>
    </div>
  )
}

export default BabyView