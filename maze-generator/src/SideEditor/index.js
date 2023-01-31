import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

function SideEditor() {
  return (
    <div className="SideEditor">
      <Sheet variant="outlined">
        <Stack>
          <Button variant="solid">Save</Button>
          <Button variant="solid">Print</Button>
        </Stack>
      </Sheet>
    </div>
  );
}

export default SideEditor;
