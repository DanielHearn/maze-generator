import { useCallback } from 'react'
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Slider from '@mui/joy/Slider';
import Input from '@mui/joy/Input';
import { v4 } from "uuid";
import './style.css';
import { OPTIONS, OPTION_TYPES } from '../constants';

const Option = (props) => {
  const { option, value, setOptionField } = props;

  if (value === undefined) {
    return null
  }
  
  switch (option.type) {
    case OPTION_TYPES.NUMBER:
      return <Stack>
        <span>{option.label}</span>
        <Input value={value} type="number" min={4} max={50} onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
        <Slider value={value} min={4} max={50} onChange={(value) => setOptionField(option.key, value.target.value)}/>
      </Stack>
    case OPTION_TYPES.STRING:
      return <Stack>
        <span>{option.label}</span>
        <Input value={value} type="string" onChange={(value) => setOptionField(option.key, Number(value.target.value))}/>
      </Stack>
    default:
      return null;
  }
}

const Options = (props) => {
  const { options, optionValues, setOptionField } = props;
  return Object.values(options).map(option => <Option key={option.key} option={option} value={optionValues[option.key]} setOptionField={setOptionField}/>)
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
      <Sheet>
        <Stack>
          <Options options={OPTIONS} setOptionField={setOptionField} optionValues={options}/>
          <Stack spacing={1}>
            <Button variant="solid" onClick={() => { 
              updateOptions({ id: v4(), solved: false});
            }}>Regenerate</Button>
            <Button variant="solid" onClick={() => setOptionField('solved', !options.solved)}>{ !options.solved ? 'Solve' : 'Unsolve' }</Button>
            <Button variant="outlined" onClick={() => maze.save()}>Save</Button>
            <Button variant="outlined" onClick={() => maze.print()}>Print</Button>
          </Stack>
        </Stack>
      </Sheet>
    </div>
  );
}

export default SideEditor;
