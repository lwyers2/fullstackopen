import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onClear = () => setValue('')

  return {
    inputProps: {type,value,onChange,},
    onClear,
  }
}

// modules can have several named exports
export const useAnotherHook = () => {
 useField
}