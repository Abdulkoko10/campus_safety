import { useGetIdentity, useOne } from "@pankod/refine-core"

import { Profile } from "components"

const MyProfile = () => {
  const { data: user } = useGetIdentity();
  console.log(user)
  const { data, isLoading, isError } = useOne({
    resource:'users',
    id: user?._id,
  })

const myProfile = data?.data ?? {};

if(isLoading) return <div>Loading...</div>
if (isError) return <div>error...</div>



  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      reports={myProfile.allReports}
      phoneNumber={myProfile.phoneNumber}
      />
  )
}

export default MyProfile