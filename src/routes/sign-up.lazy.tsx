import { AltForm } from '@/components/custom/altform'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute } from '@tanstack/react-router'
import z from 'zod'

const USE_SCHEMA_VALIDATION = false

export const Route = createLazyFileRoute('/sign-up')({
  component: SignUp
})

function SignUp() {
  async function onSubmitUser(data: any) {
    console.log('data', data)
    throw new Error('failed to save down to server')
  }

  /**
   * https://github.com/colinhacks/zod?tab=readme-ov-file#superrefine
   * https://github.com/colinhacks/zod/discussions/938
   */
  const schema = z
    .object({
      full_name: z.string().max(6, 'max is 6'),
      // code: z.string().max(10, 'phonenumber'),
      // email: z.string().email(),
      counter: z.coerce.number().positive(),
      email: z.string().optional(), // Keeping both email and phone optional on base schema and validating values inside `superRefine`
      phone: z.string().optional()
      // phoneNumber: z.string().max(10),
      // dob: z.date({
      //   required_error: 'A date of birth is required.'
      // })
    })
    .superRefine(({ email, phone }, ctx) => {
      if (email === '' && phone !== '') {
        if (!phone) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Required phone data',
            path: ['phone']
          })
        }
      }

      if (email !== '' && phone === '') {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required Email',
          path: ['email']
        })
      }
    })

  const resolver = USE_SCHEMA_VALIDATION ? zodResolver(schema) : undefined

  return (
    <div className="h-screen px-3">
      <Card className={cn('w-full')}>
        <CardHeader>
          <CardTitle>Check-Inz</CardTitle>
          <CardDescription>Sign up to volunteer.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <AltForm
            onSubmit={onSubmitUser}
            name="user"
            resolver={resolver}
            altfields={[
              {
                name: 'full_name',
                label: 'Name',
                component: 'input',
                attributes: {
                  type: 'text'
                }
              },
              {
                name: 'counter',
                label: 'Counter',
                component: 'input',
                attributes: {
                  type: 'number'
                },
                parentFieldId: 'full_name'
              },
              {
                name: 'email',
                label: 'Email',
                component: 'input',
                attributes: {
                  type: 'email'
                }
              },
              {
                name: 'phone',
                label: 'Phone',
                component: 'input',
                attributes: {
                  type: 'tel'
                }
              }
            ]}
          />
        </CardContent>
        {/* <CardFooter>
          <Button className="w-full">
            <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}
