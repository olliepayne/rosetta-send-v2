import { useHistory } from 'react-router-dom'
import CSS from './AddClimb.module.css'
import * as climbsAPI from '../../services/climbsAPI'
import AddClimbForm from '../../components/AddClimbForm/AddClimbForm'

const AddClimb = (props) => {
 const history = useHistory()

 const { user, usersAPI, climbGrades } = props

 const handleAddClimb = async (form) => {
  const result = await climbsAPI.create(form)
  usersAPI.addSubmittedClimb(user._id, result)
  history.push(`/routes/${result._id}`)
 }

 return (
  <div className={CSS.page}>
   {user ?
    <AddClimbForm user={user} climbGrades={climbGrades} handleAddClimb={handleAddClimb} />
    :
    <p>You must be logged in to add a route.</p>
   }
  </div>
 )
}

export default AddClimb