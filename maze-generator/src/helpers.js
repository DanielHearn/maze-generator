import { OPTIONS } from './constants'
import { v4 } from 'uuid'

export const generateDefaultOptions = () => {
  return {
    ...Object.values(OPTIONS).reduce((acc, value) => {
      if (value.items) {
        Object.values(value.items).forEach((subValue) => {
          acc[subValue.key] = subValue.default
        })
      } else {
        acc[value.key] = value.default
      }
      return acc
    }, {}),
    solved: false,
    id: v4(),
  }
}

export const copyToClipboard = function (str) {
  const el = document.createElement('textarea') // Create a <textarea> element
  el.value = str // Set its value to the string that you want copied
  el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
  el.style.position = 'absolute'
  el.style.left = '-9999px' // Move outside the screen to make it invisible
  document.body.appendChild(el) // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false // Mark as false to know no selection existed before
  el.select() // Select the <textarea> content
  document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el) // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges() // Unselect everything on the HTML document
    document.getSelection().addRange(selected) // Restore the original selection
  }
}
