import { useList } from "@pankod/refine-core";
import { Box, Typography }  from '@pankod/refine-mui';

import { StudentCard } from 'components';

const Students = () => {
  const { data, isLoading, isError } = useList({
    resource:'users',
  });

const allStudents = data?.data ?? [];

if(isLoading) return <div>Loading...</div>
if(isError) return <div>error...</div>

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700}
      color="#11142d">Students Lists</Typography>

      <Box 
        mt="20px"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          backgroundColor: '#fcfcfc'
        }}
      >
        {allStudents.map((student) => (
        <StudentCard 
        key={student._id}
        id={student._id}
        name={student.name}
        email={student.email}
        avatar={student.avatar}
        phoneNumber={student.phoneNumber}
        noOfReports={student.allReports.length}
        />
      ))}
    </Box>
    </Box> 
  )
}


export default Students