import { useSelector } from "react-redux"

const Notification = () => {
    const notification = useSelector((state) => state.notification)
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1,
      fontWeight: 'bold'
    }
  
    if (notification === null) {
      return null
    }
  
    return (
      <>
        <div style={style}>{notification}</div>
        <br />
      </>
    )
}

export default Notification