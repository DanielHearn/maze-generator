import { v4 } from "uuid";

export const OPTION_TYPES = {
  NUMBER: 'number',
  STRING: 'string',
  COLOR: 'color',
  RADIO: 'radio',
}

export const SIDE_OPTION_TYPES = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
}

export const SIDE_OPTION_TITLES = {
  [SIDE_OPTION_TYPES.TOP]: 'Top',
  [SIDE_OPTION_TYPES.BOTTOM]: 'Bottom',
  [SIDE_OPTION_TYPES.LEFT]: 'Left',
  [SIDE_OPTION_TYPES.RIGHT]: 'Right',
}

export const OPTIONS = {
  scale: {
    key: 'scale',
    label: 'Scale',
    type: OPTION_TYPES.NUMBER,
    regen: false,
    default: 2,
    min: 1,
    max: 5
  },
  width: {
    key: 'width',
    label: 'Width',
    type: OPTION_TYPES.NUMBER,
    regen: true,
    default: 20,
    min: 4,
    max: 50
  },
  height: {
    key: 'height',
    label: 'Height',
    type: OPTION_TYPES.NUMBER,
    regen: true,
    default: 20,
    min: 4,
    max: 50
  },
  wallWidth: {
    key: 'wallWidth',
    label: 'Wall Width',
    type: OPTION_TYPES.NUMBER,
    regen: false,
    default: 2,
    min: 1,
    max: 5
  },
  rotate: {
    key: 'rotate',
    label: 'Rotate',
    type: OPTION_TYPES.NUMBER,
    regen: false,
    default: 0,
    min: 1,
    max: 360
  },
  startSide: {
    key: 'startSide',
    label: 'Start Side',
    type: OPTION_TYPES.RADIO,
    regen: true,
    default: SIDE_OPTION_TYPES.TOP,
    options: {
      [SIDE_OPTION_TYPES.TOP]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.TOP],
      [SIDE_OPTION_TYPES.BOTTOM]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.BOTTOM],
      [SIDE_OPTION_TYPES.LEFT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.LEFT],
      [SIDE_OPTION_TYPES.RIGHT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.RIGHT],
    }
  },
  endSide: {
    key: 'endSide',
    label: 'End Side',
    type: OPTION_TYPES.RADIO,
    regen: true,
    default: SIDE_OPTION_TYPES.TOP,
    options: {
      [SIDE_OPTION_TYPES.TOP]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.TOP],
      [SIDE_OPTION_TYPES.BOTTOM]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.BOTTOM],
      [SIDE_OPTION_TYPES.LEFT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.LEFT],
      [SIDE_OPTION_TYPES.RIGHT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.RIGHT],
    }
  },
  borderColor: {
    key: 'borderColor',
    label: 'Border Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#000000',
  },
  wallColor: {
    key: 'wallColor',
    label: 'Wall Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#1a282f',
  },
  pathColor: {
    key: 'pathColor',
    label: 'Path Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#cfcfcf',
  },
  emptyColor: {
    key: 'emptyColor',
    label: 'Empty Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#ffffff',
  },
  startColor: {
    key: 'startColor',
    label: 'Start Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#ffd100',
  },
  endColor: {
    key: 'endColor',
    label: 'End Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#2ce141',
  },
  solvedColor: {
    key: 'solvedColor',
    label: 'Solved Color',
    type: OPTION_TYPES.COLOR,
    regen: false,
    default: '#456ecf',
  },
  id: {
    key: 'id',
    label: 'id',
    type: OPTION_TYPES.string,
    regen: true,
    default: v4(),
    hidden: false
  }
}