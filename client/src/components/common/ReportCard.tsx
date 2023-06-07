import React from 'react';
import { Place } from '@mui/icons-material';
import { Link } from '@pankod/refine-react-router-v6';
import { Typography, Box, Card, CardMedia, CardContent, Stack } from '@pankod/refine-mui';

import { ReportCardProps } from 'interfaces/report';

const ReportCard = ({ id, title, location, reportType, photo, isReviewed }: ReportCardProps) => {
  return (
    <Card
      component={Link}
      to={`/reports/show/${id}`}
      sx={{
        maxWidth: '330px',
        padding: '10px',
        '&:hover': {
          boxShadow: '0 22px 45px 2px rgba(176, 176, 176, 0.1)',
        },
        cursor: 'pointer',
      }}
      elevation={0}
    >
      <CardMedia
        component="img"
        width="100%"
        height={210}
        image={photo}
        alt="card image"
        sx={{ borderRadius: '10px' }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', paddingX: '5px' }}>
        <Stack direction="column" gap={1}>
          <Typography fontSize={16} fontWeight={500} color="#11142d">{title}</Typography>
          <Stack direction="row" gap={0.5} alignItems="flex-start">
            <Place sx={{ fontSize: 18, color: '#11142d', marginTop: 0.5 }} />
            <Typography fontSize={14} color="#808191">{location}</Typography>
          </Stack>
        </Stack>
        {/* <Box px={1.5} py={0.5} borderRadius={1}
          bgcolor="#dadefa" height="fit-content">
            <Typography fontSize={12} fontWeight={600}
            color="#475be8">{reportType}</Typography>
          </Box> */}
          <Box px={1.5} py={0.5} borderRadius={1} bgcolor={isReviewed ? '#2ED480' : '#dadefa'} height="fit-content">
          <Typography fontSize={12} fontWeight={600} color={isReviewed ? '#FCFCFC' : '#475be8'}>
            {isReviewed ? 'Reviewed' : reportType }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ReportCard;
