import { FormState, UseFormGetFieldState } from 'react-hook-form'
import { AltFieldsMap } from './altform'

export const isParentFieldAnswered = (
  parentId: string,
  formState: FormState<any>
) => {
  //   console.log('parentId', parentId)
  //   console.log('formstate', formState)
  const { defaultValues, errors, dirtyFields } = formState

  const isParentDirty = dirtyFields[parentId] === true
  const doesParentHaveDefaultValue = defaultValues?.[parentId] !== ''
  const doesParentHaveError = errors?.[parentId] === null

  if (isParentDirty) {
    return true
  }
  return doesParentHaveDefaultValue && doesParentHaveError
}

export const prepareFormData = (
  answers: Record<string, string | number | boolean>,
  altfieldsMap: AltFieldsMap,
  formState: FormState<any>,
  getFieldState: UseFormGetFieldState<any>
) => {
  //   const { defaultValues, dirtyFields } = formState
  console.log('formState', formState)
  console.log('altfieldsMap', altfieldsMap)
  console.log('getFieldState', getFieldState)

  const keys: string[] = Object.keys(answers)

  const finalData = keys.reduce((acc, curr) => {
    const fieldAnswer = answers[curr]
    const parentFieldId = altfieldsMap.map[curr]?.parentFieldId
    if (parentFieldId) {
      const doesParentFieldHaveAnswer =
        answers[parentFieldId]?.toString().length > 0
      acc[curr] = doesParentFieldHaveAnswer ? fieldAnswer : null
    } else {
      acc[curr] = fieldAnswer
    }
    return acc
  }, {})
  console.log('finalData', finalData)
  return finalData
}
