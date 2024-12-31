'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type AuthSchema = z.infer<typeof authSchema>

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthSchema) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast.success('Check your email for the login link!')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-gray-500">Enter your email to sign in or create an account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="name@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending link...' : 'Send magic link'}
        </Button>
      </form>
    </div>
  )
}
