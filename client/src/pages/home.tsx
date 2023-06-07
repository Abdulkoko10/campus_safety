import { useList, useGetIdentity } from '@pankod/refine-core';
import SafetyTips from 'components/home/SafetyTips';

import { Typography, Box, Stack } from '@pankod/refine-mui'

import { ReportCard, TopStudent } from 'components'

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: 'reports',
    config: {
      pagination: {
        pageSize: 5,
      }
    }
  })

  const { data: user } = useGetIdentity();

  const latestReports = data?.data ?? [];

  if (isLoading) return <Typography>Loading...</Typography>
  if (isError) return <Typography>Something went wrong</Typography>

   const isSecurityStaff = user?.role === 'SecurityStaff';

   const filteredReports = latestReports.filter((report) => (isSecurityStaff? true : report.creator === user._id && report.isReviewed));

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color='#11142D'>
        Dashboard
      </Typography>

      <Stack>
        <SafetyTips />
      </Stack>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">Latest Reports</Typography>

        <Box mt={2.5} sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
         {filteredReports.map((report) => (
            <ReportCard
              key={report._id}
              id={report._id}
              title={report.title}
              location={report.location}
              reportType={report.reportType}
              photo={report.photo}
              isReviewed={report.isReviewed}
            />
          ))}
        </Box>

      </Box>
    </Box>
  )
}

export default Home;
