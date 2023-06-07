import { Box, Typography, FormControl, FormHelperText, TextField, 
  TextareaAutosize, Stack, Select, MenuItem, Button } from
   '@pankod/refine-mui'

import { FormProps } from 'interfaces/common'
import CustomButton from './CustomButton'

const Form = ({ type, register, handleSubmit, 
  handleImageChange, formLoading, 
  onFinishHandler, reportImage }: FormProps) => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight=
      {700} color="#11142D">
        {type} a report
      </Typography>

      <Box mt={2.5} borderRadius="15px"
      padding="20px" bgcolor="#fcfcfc"
      >
        <form style={{ marginTop: '20px',
        width: '100%', display: 'flex',
        flexDirection: 'column', gap:'20px'}}
        onSubmit={handleSubmit(onFinishHandler)}
        >
        <FormControl>
          <FormHelperText sx={{
            fontWeight: 500, margin: '10px', 
            fontSize: 16, color: '#11142d'
          }} >Enter report title
          </FormHelperText>
          <TextField 
             fullWidth
             required
             id="outlined-basic"
             color="info"
             variant="outlined"
             {...register('title', {
              required: true})}
              />
        </FormControl>
        <FormControl>
          <FormHelperText sx={{
            fontWeight: 500, margin: '10px', 
            fontSize: 16, color: '#11142d'
          }} >Enter Description
          </FormHelperText>
          <TextareaAutosize 
            minRows={5}
            required
            placeholder='Write description'
            color='info'
            style={{ width: '100%', 
            background: 'transparent',
            fontSize: '16px', 
            borderColor: 'rgba(0,0,0,0.23)',
            borderRadius: 6, padding: 10,
          color: '#919191'}}
          {...register('description', {
            required: true})}
          />
        </FormControl>
         <FormControl>
            <FormHelperText sx={{
              fontWeight: 500,
              margin: '10px 0',
              fontSize: 16,
              color: '#11142d'
            }}>
              Select Report Type
            </FormHelperText>
            <Select 
              variant='outlined'
              color="info"
              displayEmpty
              required
              inputProps={{ 'aria-label': 'Without label' }}
              defaultValue=""
              {...register('reportType', {required: true})}
              >
                 <MenuItem value="theft">Theft</MenuItem>
                <MenuItem value="vandalism">Vandalism</MenuItem>
                <MenuItem value="harassment">Harassment</MenuItem>
                <MenuItem value="drug Abuse">Drug Abuse</MenuItem>
                <MenuItem value="assault">Assault</MenuItem>
                <MenuItem value="bullying">Bullying</MenuItem>
                <MenuItem value="Hazing">Hazing</MenuItem>
                <MenuItem value="stalking">Stalking</MenuItem>
                <MenuItem value="cybercrime">Cybercrime</MenuItem>
                <MenuItem value="disturbance">Disturbance</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
          </FormControl>
         <FormControl>
          <FormHelperText sx={{
            fontWeight: 500, margin: '10px', 
            fontSize: 16, color: '#11142d'
          }} >Enter Location
          </FormHelperText>
          <TextField 
             fullWidth
             required
             id="outlined-basic"
             color="info"
             variant="outlined"
             {...register('location', {
              required: true})}
              />
        </FormControl>
        <Stack direction="column" gap={1}
        justifyContent="center" mb={2}>
           <Stack direction="row" gap={2}>
            <Typography color="#11142d" fontSize={16}
            fontWeight={500} my="10px">Report Photo</Typography>

          <Button component="label" sx={{ width: 'fit-content', color: "#2ed480",
           textTransform: 'capitalize', fontSize: 16 }}>
            Upload *
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                // @ts-ignore
                handleImageChange(e.target.files[0])
              }} />
           </Button>
           </Stack>
           <Typography fontSize={14} color="#808191" sx=
           {{wordBreak: 'break-all'}}>{reportImage?.name}
            </Typography>
        </Stack>
        <CustomButton 
          type="submit"
          title={formLoading ? 'submitting...' : 'Submit'}
          backgroundColor="#475be8"
          color="#fcfcfc"
            />
        </form>
      </Box>
    </Box>
    )
}

export default Form

