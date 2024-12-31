'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthSchema = z.infer<typeof authSchema>

export function AuthTabs() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    if (user) {
      console.log('User is authenticated, redirecting to dashboard...')
      router.replace('/dashboard')
    }
  }, [user, router])

  const signInForm = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const signUpForm = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const onSignIn = async (data: AuthSchema) => {
    try {
      setIsLoading(true)
      console.log('Attempting to sign in...')
      
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      console.log('Sign in successful:', signInData)
      toast.success('Successfully signed in!')
      
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: AuthSchema) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success('Check your email to confirm your account!')
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg p-6">
        <CardTitle className="text-2xl font-bold text-center">Welcome to HealthyDB</CardTitle>
        <CardDescription className="text-center text-primary-foreground/80">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" className="text-base">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-base">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11"
                  {...signInForm.register('email')}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-base">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  className="h-11"
                  {...signInForm.register('password')}
                />
                {signInForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-base">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11"
                  {...signUpForm.register('email')}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-base">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  className="h-11"
                  {...signUpForm.register('password')}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
