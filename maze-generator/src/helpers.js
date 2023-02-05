import { OPTIONS } from "./constants";

export const generateDefaultOptions = () => {
  return {
    ...Object.values(OPTIONS).reduce((acc, value) => {
      acc[value.key] = value.default
      return acc
    }, {}),
  }
}