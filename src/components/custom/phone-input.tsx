import {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  createRef,
  useMemo
} from 'react'
import { Input } from '../ui/input'

interface PhoneInputProps {
  totalDigits: number
  onChange: any
}

/**
 * @example https://github.com/drac94/react-auth-code-input/blob/master/src/index.tsx
 * - https://www.luisguerrero.me/react-auth-code-input/
 *
 *
 */
export const PhoneInput = ({ totalDigits, onChange }: PhoneInputProps) => {
  const refs = useMemo(
    () => [...Array(totalDigits)].map(() => createRef<HTMLInputElement>()),
    [totalDigits]
  )

  const triggerOnChange = () => {
    const res = refs?.map((ref: any) => ref?.current?.value).join('')
    onChange && onChange(res)
  }

  const setFocus = (idx: number) => {
    const nextIdx = idx + 1
    if (nextIdx < totalDigits) {
      refs[nextIdx].current?.focus()
    }
  }

  function handleOnChange(
    event: ChangeEvent<HTMLInputElement>,
    idx: any
  ): void {
    const digit = event?.target?.value?.replace(/[^0-9]/g, '')
    // if just a space or empty, stay at spot
    if (digit?.trim() === '') {
      refs[idx].current?.focus()
      event.target.value = ''
      return
    }
    setFocus(idx)
    triggerOnChange()
  }

  function handleOnKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const { key } = event
    const target = event.target as HTMLInputElement
    if (key === 'Backspace') {
      if (target.value === '') {
        if (target.previousElementSibling !== null) {
          const pTarget = target.previousElementSibling as HTMLInputElement
          pTarget.value = ''
          pTarget.focus()
          event.preventDefault()
        }
      } else {
        target.value = ''
      }
    }
    triggerOnChange()
  }

  function handleOnFocus(event: FocusEvent<HTMLInputElement, Element>): void {
    event.target.select()
  }

  function handleOnPaste(event: ClipboardEvent<HTMLInputElement>): void {
    const pastedValue = event.clipboardData?.getData('Text')
    pastedValue.split('').forEach((char, idx) => {
      console.log('char', char, 'at', idx)
      if (refs?.[idx]?.current !== null) {
        const currentRef = refs[idx].current as any
        currentRef.value = char
        setFocus(idx)
      }
    })
    triggerOnChange()
    event.preventDefault()
  }

  return (
    <div className="flex flex-row space-x-4">
      {refs.map((ref, idx) => {
        return (
          <Input
            key={idx}
            className="w-4/12 h-20 text-center text-2xl"
            inputMode="numeric"
            maxLength={1}
            min={0}
            max={9}
            // pattern="[0-9]"
            pattern="\d*"
            autoComplete="one-time-code"
            ref={ref}
            onChange={(e) => handleOnChange(e, idx)}
            onKeyDown={(e) => handleOnKeyDown(e)}
            onFocus={handleOnFocus}
            onPaste={handleOnPaste}
          />
        )
      })}
    </div>
  )
}
