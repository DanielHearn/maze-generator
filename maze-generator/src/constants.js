import { v4 } from "uuid";

export const OPTION_TYPES = {
  NUMBER: 'number',
  STRING: 'string',
  COLOR: 'color',
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
    default: 1,
    min: 1,
    max: 5
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