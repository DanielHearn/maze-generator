import { useCallback, useState } from 'react'
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Slider from '@mui/joy/Slider';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import { HexColorPicker } from "react-colorful";
import { v4 } from "uuid";
import { OPTIONS, OPTION_TYPES } from '../constants';
import { generateDefaultOptions } from '../helpers';
import { toast } from 'react-toastify';
import './style.css';

const DEFAULT_NUMBER_MIN = 1;
const DEFAULT_NUMBER_MAX = 10;


const ColorInput = (props) => {
  const { option, value, setOptionField } = props;
  const [open, setOpen] = useState(false)

  return <Stack className="ColorInput">
    <span>{option.label}</span>
    <span>
      <div className="ColorInput__color" style={{ background: value || '#FFFFFF' }} onClick={() => setOpen(!open)}></div>
      <Input value={value} type="string" onChange={(value) => setOptionField(option.key, value.target.value)}/>
    </span>
    {open && <HexColorPicker color={value} onChange={(value) => setOptionField(option.key, value)} />}
  </Stack>
} 

const Option = (props) => {
  const { option, value, optionValues, setOptionField, disabledKey = null } = props;

  if (value === undefined) {
    return null
  }
  
  switch (option.type) {
    case OPTION_TYPES.NUMBER:
      return <Stack>
        <span>{option.label}</span>
        <Input value={value} type="number" min={option.min || DEFAULT_NUMBER_MIN} max={option.max || DEFAULT_NUMBER_MAX} onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
        <Slider value={value} min={option.min || DEFAULT_NUMBER_MIN} max={option.max || DEFAULT_NUMBER_MAX} onChange={(value) => setOptionField(option.key, value.target.value)}/>
      </Stack>
    case OPTION_TYPES.STRING:
      return <Stack>
        <span>{option.label}</span>
        <Input value={value} type="string" onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
      </Stack>
    case OPTION_TYPES.COLOR:
      return <ColorInput option={option} value={value} setOptionField={setOptionField}/>
    case OPTION_TYPES.RADIO:
      return  <Stack>
        <span>{option.label}</span>
        <RadioGroup
          value={value}
          onChange={(value) => setOptionField(option.key, value.target.value)}
        >
          {Object.keys(option.options).map((key) => <Radio value={key} label={option.options[key]} disabled={disabledKey === key || (option.optionDisabled?.(optionValues, key) || false)}/>)}
        </RadioGroup>
      </Stack>
    default:
      return null;
  }
}

const Options = (props) => {
  const { options, optionValues, setOptionField } = props;
  return Object.values(options).map(option => <Option key={option.key} option={option} value={optionValues[option.key]} optionValues={optionValues} setOptionField={setOptionField} disabledKey={option.blockLinked ? optionValues[option.blockLinked] : null}/>)
}


function SideEditor(props) {
  const { options, setOptions, maze } = props
  
  const setOptionField = useCallback((field, value) => {
    setOptions({
      ...options,
      solved: false,
      [field]: value
    })
 }, [options, setOptions]);

  const updateOptions = useCallback((updates) => {
    setOptions({
      ...options,
      ...updates
    })
 }, [options, setOptions]);

 if (!maze) {
  return null;
 }

  return (
    <div className="SideEditor">
      <Sheet className="scrolling">
        <Stack        
          sx={{
            py: 2,
            px: 2,
          }}>
          <Options options={OPTIONS} setOptionField={setOptionField} optionValues={options}/>
          <Stack spacing={1} className="sticky">
          <Button variant="outlined" onClick={() => { 
                toast.clearWaitingQueue();
                toast(`Reset Maze`);
              updateOptions(generateDefaultOptions());
            }}>Reset</Button>
            <Button variant="solid" onClick={() => { 
              updateOptions({ id: v4(), solved: false});
            }}>Regenerate</Button>
            <Button variant="solid" onClick={() => setOptionField('solved', !options.solved)}>{ !options.solved ? 'Solve' : 'Unsolve' }</Button>
            <Button variant="outlined" onClick={() => {
              toast.clearWaitingQueue();
              toast(`Downloaded Maze as Image`);
              maze.save()
            }}>Download</Button>
            <Button variant="outlined" onClick={() => maze.print()}>Print</Button>
          </Stack>
        </Stack>
      </Sheet>
    </div>
  );
}

export default SideEditor;
