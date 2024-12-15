import { ClipLoader } from 'react-spinners'

const Spinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <ClipLoader color="#333" loading={true} size={50} />
    </div>
  )
}

export default Spinner