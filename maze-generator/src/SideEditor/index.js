import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Slider from '@mui/joy/Slider';
import Input from '@mui/joy/Input';
import { v4 } from "uuid";
import './style.css';
import { OPTIONS, OPTION_TYPES } from '../constants';

function SideEditor(props) {
  const { options, setOptions } = props
  
  const setOptionField = (field, value) => {
    setOptions({
      ...options,
      solved: false,
      [field]: value
    })
  }

  const updateOptiosn = (updates) => {
    setOptions({
      ...options,
      ...updates
    })
  }

  const Option = (props) => {
    const { option } = props;
    const optionValue = options[option.key]

    switch (option.type) {
      case OPTION_TYPES.NUMBER:
        return <Stack>
          <span>{option.label}</span>
          <Input value={optionValue} type="number" min={4} max={50} onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
          <Slider value={optionValue} min={4} max={50} onChange={(value) => setOptionField(option.key, value.target.value)}/>
        </Stack>
      case OPTION_TYPES.STRING:
        return <Stack>
          <span>{option.label}</span>
          <Input value={optionValue} type="string" onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
        </Stack>
      default:
        return null;
    }
  }

  const Options = (props) => {
    const { options } = props;
    return Object.values(options).map(option => <Option key={option.key} option={option}/>)
  }

  return (
    <div className="SideEditor">
      <Sheet>
        <Stack>
          <Options options={OPTIONS} />
          <Stack spacing={1}>
            <Button variant="solid" onClick={() => { 
              updateOptiosn({ id: v4(), solved: false});
            }}>Regenerate</Button>
            <Button variant="solid" onClick={() => setOptionField('solved', !options.solved)}>{ !options.solved ? 'Solve' : 'Unsolve' }</Button>
            <Button variant="outlined">Save</Button>
            <Button variant="outlined">Print</Button>
          </Stack>
        </Stack>
      </Sheet>
    </div>
  );
}

export default SideEditor;
