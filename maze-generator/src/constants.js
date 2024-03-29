import { v4 } from 'uuid'

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
  CENTER: 'center',
}

export const SIDE_OPTION_TITLES = {
  [SIDE_OPTION_TYPES.TOP]: 'Top',
  [SIDE_OPTION_TYPES.BOTTOM]: 'Bottom',
  [SIDE_OPTION_TYPES.LEFT]: 'Left',
  [SIDE_OPTION_TYPES.RIGHT]: 'Right',
  [SIDE_OPTION_TYPES.CENTER]: 'Center',
}

export const SHAPE_OPTION_TYPES = {
  SQUARE: 'square',
  HOLLOW_SQUARE: 'hollow_square',
  CIRCLE: 'circle',
  HOLLOW_CIRCLE: 'hollow_circle',
  DIAMOND: 'diamond',
  DONUT: 'donut',
}

export const SHAPE_OPTION_TITLES = {
  [SHAPE_OPTION_TYPES.SQUARE]: 'Square',
  [SHAPE_OPTION_TYPES.HOLLOW_SQUARE]: 'Hollow Square',
  [SHAPE_OPTION_TYPES.CIRCLE]: 'Circle',
  [SHAPE_OPTION_TYPES.HOLLOW_CIRCLE]: 'Hollow Circle',
  [SHAPE_OPTION_TYPES.DIAMOND]: 'Diamond',
  [SHAPE_OPTION_TYPES.DONUT]: 'Donut',
}

export const OPTIONS = {
  shape: {
    title: 'Shape',
    items: {
      shape: {
        key: 'shape',
        label: 'Shape',
        type: OPTION_TYPES.RADIO,
        regen: true,
        default: SHAPE_OPTION_TYPES.SQUARE,
        options: {
          [SHAPE_OPTION_TYPES.SQUARE]: SHAPE_OPTION_TITLES[SHAPE_OPTION_TYPES.SQUARE],
          [SHAPE_OPTION_TYPES.HOLLOW_SQUARE]: SHAPE_OPTION_TITLES[SHAPE_OPTION_TYPES.HOLLOW_SQUARE],
          [SHAPE_OPTION_TYPES.DIAMOND]: SHAPE_OPTION_TITLES[SHAPE_OPTION_TYPES.DIAMOND],
          [SHAPE_OPTION_TYPES.CIRCLE]: SHAPE_OPTION_TITLES[SHAPE_OPTION_TYPES.CIRCLE],
          [SHAPE_OPTION_TYPES.HOLLOW_CIRCLE]: SHAPE_OPTION_TITLES[SHAPE_OPTION_TYPES.HOLLOW_CIRCLE],
        },
      },
      scale: {
        key: 'scale',
        label: 'Scale',
        type: OPTION_TYPES.NUMBER,
        regen: false,
        default: 1,
        min: 1,
        max: 100,
      },
      width: {
        key: 'width',
        label: 'Width',
        type: OPTION_TYPES.NUMBER,
        regen: true,
        default: 20,
        min: 4,
        max: 50,
      },
      height: {
        key: 'height',
        label: 'Height',
        type: OPTION_TYPES.NUMBER,
        regen: true,
        default: 20,
        min: 4,
        max: 50,
      },
    },
  },
  wall: {
    title: 'Walls',
    items: {
      wallWidth: {
        key: 'wallWidth',
        label: 'Wall Width',
        type: OPTION_TYPES.NUMBER,
        regen: false,
        default: 2,
        min: 1,
        max: 5,
      },
    },
  },
  start: {
    title: 'Start & End',
    items: {
      startLocation: {
        key: 'startLocation',
        label: 'Start Location',
        type: OPTION_TYPES.RADIO,
        regen: true,
        default: SIDE_OPTION_TYPES.TOP,
        options: {
          [SIDE_OPTION_TYPES.TOP]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.TOP],
          [SIDE_OPTION_TYPES.BOTTOM]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.BOTTOM],
          [SIDE_OPTION_TYPES.LEFT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.LEFT],
          [SIDE_OPTION_TYPES.RIGHT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.RIGHT],
          [SIDE_OPTION_TYPES.CENTER]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.CENTER],
        },
        blockLinked: 'endLocation',
        optionDisabled: (options, key) => {
          if (
            options.shape === SHAPE_OPTION_TYPES.HOLLOW_SQUARE &&
            key === SIDE_OPTION_TYPES.CENTER
          ) {
            return true
          }

          return false
        },
      },
      endLocation: {
        key: 'endLocation',
        label: 'End Location',
        type: OPTION_TYPES.RADIO,
        regen: true,
        default: SIDE_OPTION_TYPES.BOTTOM,
        options: {
          [SIDE_OPTION_TYPES.TOP]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.TOP],
          [SIDE_OPTION_TYPES.BOTTOM]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.BOTTOM],
          [SIDE_OPTION_TYPES.LEFT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.LEFT],
          [SIDE_OPTION_TYPES.RIGHT]: SIDE_OPTION_TITLES[SIDE_OPTION_TYPES.RIGHT],
        },
        blockLinked: 'startLocation',
      },
    },
  },
  /*rotate: {
    key: 'rotate',
    label: 'Rotate',
    type: OPTION_TYPES.NUMBER,
    regen: false,
    default: 0,
    min: 0,
    max: 360
  },*/
  color: {
    title: 'Color',
    items: {
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
        default: '#00ff19',
      },
      endColor: {
        key: 'endColor',
        label: 'End Color',
        type: OPTION_TYPES.COLOR,
        regen: false,
        default: '#e02d2d',
      },
      solvedColor: {
        key: 'solvedColor',
        label: 'Solved Color',
        type: OPTION_TYPES.COLOR,
        regen: false,
        default: '#456ecf',
      },
    },
  },
  id: {
    key: 'id',
    label: 'id',
    type: OPTION_TYPES.string,
    regen: true,
    default: v4(),
    hidden: false,
  },
  solved: {
    key: 'solved',
    label: 'solved',
    type: OPTION_TYPES.string,
    regen: false,
    default: false,
    hidden: false,
  },
}
