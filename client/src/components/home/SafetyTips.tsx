import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia } from '@pankod/refine-mui';
import { makeStyles } from '@material-ui/core/styles';

import { logo,
    alhikmah,
    info,
    light,
    lock,
    night,
    report, 
    security,
    surroundings,
    belongings } from "../../assets"

const useStyles = makeStyles(() => ({
  boxContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '15px',
    padding: '20px',
    backgroundColor: '#fcfcfc',
    minHeight: '250px',
  },
  tipCard: {
    width: '100%',
    marginTop: '20px'
  },
  media: {
    height: '150px',
  },
}));

// Static list of safety tips with images
const safetyTips = [
    { tip: 'Always be aware of your surroundings.', image: surroundings },
    { tip: 'Do not walk alone at night.', image: night },
    { tip: 'Keep your personal belongings secure at all times.', image: belongings },
    { tip: 'Know the location of campus security offices.', image: security },
    { tip: 'Report any suspicious activity to campus security.', image: report },
    { tip: 'Always lock your doors and windows.', image: lock },
    { tip: 'Do not share personal information with strangers.', image: info },
    { tip: 'Stay in well-lit areas.', image: light },
  ];
  

const SafetyTips = () => {
  const styles = useStyles();

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % safetyTips.length);
    }, 5000); // Change tip every 5 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [])

  return (
    <Box className={styles.boxContainer}>
      <Typography fontSize="18px" fontWeight={600} color="#11142d" >Safety Tip</Typography>
      <Box mt={2.5} sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Card className={styles.tipCard}>
          <CardMedia
            className={styles.media}
            image={safetyTips[currentTipIndex].image}
            title="Safety tip image"
          />
          <CardContent>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              component="p"
            >
              {safetyTips[currentTipIndex].tip}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default SafetyTips;
