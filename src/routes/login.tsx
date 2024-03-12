import {
  createFileRoute,
  getRouteApi,
  useNavigate
} from '@tanstack/react-router'
import { flushSync } from 'react-dom'
import { z } from 'zod'

import { AltForm } from '@/components/custom/altform'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAuth } from '../auth'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().catch('/')
  }),
  component: LoginComponent
})

const routeApi = getRouteApi('/login')

function LoginComponent() {
  const auth = useAuth()
  const navigate = useNavigate()

  const search = routeApi.useSearch()

  async function handleLogin(data: any) {
    console.log('data', data)
    const user = 'hb'
    flushSync(() => {
      auth.setUser(user)
    })

    navigate({ to: search.redirect })
  }

  const schema = z.object({
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

  return (
    <div className="h-screen px-3">
      <Card className={cn('w-full')}>
        <CardHeader>
          <CardTitle>Check-Inz</CardTitle>
          <CardDescription>
            Enter Phone Number to checkin the event
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <AltForm
            onSubmit={handleLogin}
            name="user"
            // resolver={zodResolver(schema)}
            altfields={[
              {
                name: 'phone_number',
                label: 'Phone Number',
                component: 'verification',
                attributes: {
                  type: 'text'
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
