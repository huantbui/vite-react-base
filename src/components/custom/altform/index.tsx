import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { CalendarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { ControllerRenderProps, UseFormReturn, useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Button } from '../../ui/button'
import { Calendar } from '../../ui/calendar'
import { Input } from '../../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select'
import { Slider } from '../../ui/slider'
import { Textarea } from '../../ui/textarea'
import { toast } from '../../ui/use-toast'
import { PhoneInput } from '../phone-input'
import { AltField, AltFieldsMap, AltFormProps } from './altform'
import { isParentFieldAnswered, prepareFormData } from './states'

export const AltForm = (props: AltFormProps) => {
  const { onSubmit, altfields, resolver } = props

  const altfieldsMap: AltFieldsMap = altfields.reduce(
    (acc: any, curr: AltField, index: number) => {
      acc[curr?.name] = curr.defaultValue || ''
      return {
        initialValues: {
          ...acc.initialValues,
          [curr.name]: curr.defaultValue || ''
        },
        map: {
          ...acc.map,
          [curr.name]: {
            order: index,
            toHide: false,
            ...curr
          }
        }
      }
    },
    {
      initialValues: {},
      map: {}
    }
  )

  const form: UseFormReturn = useForm({
    resolver: resolver || undefined,
    defaultValues: altfieldsMap.initialValues
  })

  const { getFieldState, formState } = form

  async function handleOnSubmit(data: any) {
    const finalData = prepareFormData(
      data,
      altfieldsMap,
      formState,
      getFieldState
    )
    try {
      await onSubmit(finalData)
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(finalData, null, 2)}
            </code>
          </pre>
        )
      })
    } catch (error: any) {
      console.log('error', error)
      toast({
        variant: 'destructive',
        title: 'Error submitting:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{`${error}`}</code>
          </pre>
        )
      })
    }
  }

  // console.log('getValues', getValues())
  // console.log('formState', formState)

  console.log('re-render')
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="w-full space-y-6"
      >
        {altfields.map((altfield) => {
          const key =
            altfield.name?.toLowerCase()?.replaceAll(' ', '-') || uuid()

          /**
           * if current field has parent, then based on parent's state,
           * determine if current field hide/show
           */
          if (altfield?.parentFieldId) {
            const shouldShowField = isParentFieldAnswered(
              altfield?.parentFieldId,
              formState
            )
            if (!shouldShowField) return null
          }
          return (
            <FormField
              key={key}
              control={form.control}
              name={altfield.name}
              render={({ field }) => (
                <FormItem>
                  {altfield.label ? (
                    <FormLabel>{altfield.label}</FormLabel>
                  ) : null}
                  <FormControl>
                    <Field altfield={altfield} field={field} />
                  </FormControl>
                  {altfield.description ? (
                    <FormDescription>{altfield.description}</FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}

interface FieldProps {
  altfield: AltField
  field: ControllerRenderProps
}

const Field = ({ altfield, field }: FieldProps) => {
  const { component, attributes } = altfield
  const { onChange } = field

  switch (component) {
    case 'verification':
      return <PhoneInput totalDigits={10} onChange={onChange} />
    case 'input':
      return (
        <Input
          placeholder={altfield?.placeholder}
          className="resize-none w-full"
          {...field}
          {...attributes}
        />
      )
    case 'select':
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      )
    case 'slider':
      return (
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className={cn('w-[60%]')}
          {...attributes}
        />
      )
    case 'textarea':
      return (
        <Textarea
          placeholder={altfield?.placeholder}
          className="resize-none"
          {...field}
          {...attributes}
        />
      )
    case 'datepicker':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full pl-3 text-left font-normal',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode={altfield?.attributes?.mode}
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )
    default: {
      const errorMessage = `Component "${component}" does not exist`
      console.error(errorMessage)
      return (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )
    }
  }
}
