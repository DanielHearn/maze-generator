import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import Slider from '@mui/joy/Slider';

function SideEditor(props) {
  const { options, setOptions } = props

  const setOptionField = (field, value) => {
    setOptions({
      ...options,
      [field]: value
    })
  }

  return (
    <div className="SideEditor">
      <Sheet variant="outlined">
        <Stack>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Slider value={options.scale} min={1} max={30} onChange={(value) => setOptionField('scale', value.target.value)}/>;
          </Grid>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Button variant="solid">Save</Button>
            <Button variant="solid">Print</Button>
          </Grid>
        </Stack>
      </Sheet>
    </div>
  );
}

export default SideEditor;
