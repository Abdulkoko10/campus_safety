/* eslint-disable no-restricted-globals */
import { Typography, Box, Stack } from '@pankod/refine-mui';
import { useDelete, useGetIdentity, useShow, useUpdate, useNotification } from '@pankod/refine-core';
import { useParams, useNavigate } from '@pankod/refine-react-router-v6';
import { ChatBubble, Delete, Edit, Phone, Place, MarkEmailRead } from '@mui/icons-material';

import { CustomButton } from 'components';

function checkImage(url: any) {
  let img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const ReportDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const { queryResult } = useShow();
  const { mutate: deleteMutate } = useDelete();
  const { mutate: updateMutate } = useUpdate();
  const { id } = useParams();
  const { open: showNotification } = useNotification(); // Use "open" function from useNotification and rename it to "showNotification"

  const { data, isLoading, isError } = queryResult;

  const reportDetails = data?.data ?? {};

  const isCurrentUser = user?.email === reportDetails.creator?.email;
  const isSecurityStaff = user?.role === 'SecurityStaff' || user?.role === 'Admin';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  const handleDeleteReport = () => {
    const response = confirm('Are you sure you want to delete this report?');
    if (response) {
      deleteMutate({
        resource: 'reports',
        id: id as string,
      }, {
        onSuccess: () => {
          navigate('/reports');
        },
      });
    }
  };

  const handleMarkAsReviewed = () => {
    updateMutate(
      {
        resource: 'reports',
        id: id as string,
        values: {
          isReviewed: !reportDetails.isReviewed,
        },
      },
      {
        onSuccess: () => {
          if (showNotification) {
            showNotification({
              type: 'success',
              message: 'Success',
              description: 'Report marked as reviewed successfully.',
            });
          }
        },
      },
    );
  };

  const handleSendMessage = () => {
    const emailSubject = `Regarding Report: ${reportDetails.title}`;
    const emailBody = `Hello, Security Staff,\n\nI am reaching out regarding the following report:\n\nTitle: ${reportDetails.title}\nDescription: ${reportDetails.description}\n\nPlease take necessary actions.\n\nBest regards,\n${user?.name}`;
    const mailtoUrl = `mailto:${reportDetails.creator.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoUrl, '_blank');
  };
  

  const handleMakeCall = () => {
    // Navigate to the call application
    window.open(`tel:${reportDetails.creator.phoneNumber}`, '_blank');
  };


  return (
    <Box borderRadius="15px" padding="20px" bgcolor="#FCFCFC" width="fit-content">
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Details
      </Typography>

      <Box mt="20px" display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={4}>
        <Box flex={1} maxWidth={764}>
          <img
            src={reportDetails.photo}
            alt="report_details-img"
            height={546}
            style={{ objectFit: 'cover', borderRadius: '10px' }}
            className="report_details-img"
          />

          <Box mt="15px">
            <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center">
              <Typography fontSize={18} fontWeight={500} color="#11142D" textTransform="capitalize">
                {reportDetails.reportType}
              </Typography>
              {/* Removed the star ratings */}
            </Stack>

            <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={2}>
              <Box>
                <Typography fontSize={22} fontWeight={600} mt="10px" color="#11142D">
                  {reportDetails.title}
                </Typography>
                <Stack mt={0.5} direction="row" alignItems="center" gap={0.5}>
                  <Place sx={{ color: '#808191' }} />
                  <Typography fontSize={14} color="#808191">
                    {reportDetails.location}
                  </Typography>
                </Stack>
              </Box>

              {/* Removed the price details */}
            </Stack>

            <Stack mt="25px" direction="column" gap="10px">
              <Typography fontSize={18} color="#11142D">
                Description
              </Typography>
              <Typography fontSize={14} color="#808191">
                {reportDetails.description}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Box width="100%" flex={1} maxWidth={326} display="flex" flexDirection="column" gap="20px">
          <Stack
            width="100%"
            p={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            border="1px solid #E4E4E4"
            borderRadius={2}
          >
            <Stack mt={2} justifyContent="center" alignItems="center" textAlign="center">
              <img
                src={checkImage(reportDetails.creator.avatar) ? reportDetails.creator.avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'}
                alt="avatar"
                width={90}
                height={90}
                style={{ borderRadius: '100%', objectFit: 'cover' }}
              />

              <Box mt="15px">
                <Typography fontSize={18} fontWeight={600} color="#11142D">
                  {reportDetails.creator.name}
                </Typography>
                <Typography mt="5px" fontSize={14} fontWeight={400} color="#808191">
                  Student
                </Typography>
              </Box>

              <Stack mt="15px" direction="row" alignItems="center" gap={1}>
                <Phone sx={{ color: '#808191' }} />
                <Typography fontSize={14} fontWeight={400} color="#808191">
                  {reportDetails.creator.phoneNumber}
                </Typography>
              </Stack>

              <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                {reportDetails.creator.allReports.length} Reports
              </Typography>
            </Stack>

            <Stack width="100%" mt="25px" direction="row" flexWrap="wrap" gap={2}>
            <CustomButton
               title={!isCurrentUser ? 'Message' : 'Edit'}
               backgroundColor="#475BE8"
               color="#FCFCFC"
               fullWidth
               icon={!isCurrentUser ? <ChatBubble /> : <Edit />}
               handleClick={() => {
                 if (isCurrentUser) {
                   navigate(`/reports/edit/${reportDetails._id}`);
                 } else if (isSecurityStaff) {
                   handleSendMessage();
                 }
              }}
             />
             <CustomButton
               title={!isCurrentUser ? 'Call' : 'Delete'}
               backgroundColor={!isCurrentUser ? '#2ED480' : '#d42e2e'}
               color="#FCFCFC"
               fullWidth
               icon={!isCurrentUser ? <Phone /> : <Delete />}
               handleClick={() => {
                 if (isCurrentUser) {
                   handleDeleteReport();
                 } else if (isSecurityStaff) {
                   handleMakeCall();
                 }
               }}
            />


              {/* Mark as Reviewed/Pending button */}
              {isSecurityStaff && (
                <CustomButton
                  title={reportDetails.isReviewed ? 'Reviewed' : 'Mark as Reviewed' }
                  backgroundColor={reportDetails.isReviewed ? '#2ED480' : '#d42e2e'}
                  color="#FCFCFC"
                  fullWidth
                  icon={reportDetails.isReviewed ? <MarkEmailRead /> : <Edit /> }
                  handleClick={handleMarkAsReviewed}
                />
              )}

              {/* Navigation buttons */}
      {/* {isSecurityStaff && (
        <>
          <CustomButton
            title="Message"
            backgroundColor="#475BE8"
            color="#FCFCFC"
            fullWidth
            icon={<ChatBubble />}
            handleClick={handleSendMessage}
          />
          <CustomButton
            title="Call"
            backgroundColor="#2ED480"
            color="#FCFCFC"
            fullWidth
            icon={<Phone />}
            handleClick={handleMakeCall}
          />
        </>
      )} */}

            </Stack>
          </Stack>

          <Stack>
            <img
              src="https://serpmedia.org/scigen/images/googlemaps-nyc-standard.png?crc=3787557525"
              width="100%"
              height={306}
              style={{ borderRadius: 10, objectFit: 'cover' }}
            />
          </Stack>

          {/* Removed the "Book Now" button */}
        </Box>
      </Box>
    </Box>
  );
};

export default ReportDetails;
