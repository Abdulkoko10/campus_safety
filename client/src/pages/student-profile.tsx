import { useOne } from "@pankod/refine-core"
import { useParams } from "@pankod/refine-react-router-v6";

import { Profile } from "components"

const StudentProfile = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useOne({
    resource:'users',
    id: id as string
  })

const myProfile = data?.data ?? {};

if(isLoading) return <div>Loading...</div>
if (isError) return <div>error...</div>



  return (
    <Profile
      type="Student"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      phoneNumber={myProfile.phoneNumber}
      reports={myProfile.allReports}
      />
  )
}

export default StudentProfile