'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinners';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';

export default function Page() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    mode: 'onBlur',
    defaultValues: {
      email: 'demo@kt.com',
      password: 'demo123',
      rememberMe: false,
    },
  });

  async function onSubmit(values: SigninSchemaType) {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (response?.error) {
        const errorData = JSON.parse(response.error);
        setError(errorData.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      );
      // } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div className="space-y-15 ">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Iniciar sesión
          </h1>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          ¿Necesitas una cuenta?{' '}
          <Link
            href="/signup"
            className="text-sm font-semibold text-blue-600 hover:font-bold hover:text-primary"
          >
            Regístrate
          </Link>
        </p>
        {/* <Alert size="sm" close={false}>
          <AlertIcon>
            <RiErrorWarningFill className="text-primary" />
          </AlertIcon>
          <AlertTitle className="text-accent-foreground">
            Use <span className="text-mono font-semibold">demo@kt.com</span>{' '}
            username and{' '}
            <span className="text-mono font-semibold">demo123</span> for demo
            access.
          </AlertTitle>
        </Alert> */}

        {/* <div className="flex flex-col gap-3.5">
          <Button
            variant="outline"
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <Icons.googleColorful className="size-5! opacity-100!" /> Sign in
            with Google
          </Button>
        </div>

        <div className="relative py-1.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div> */}

        {error && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="email@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>Contraseña</FormLabel>
                <Link
                  href="/reset-password"
                  className="text-sm font-semibold text-blue-600 hover:font-bold hover:text-primary"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="Ingresa la contraseña"
                  type={passwordVisible ? 'text' : 'password'} // Toggle input type
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                  className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                  aria-label={
                    passwordVisible ? 'Hide password' : 'Show password'
                  }
                >
                  {passwordVisible ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label
                  htmlFor="remember-me"
                  className={`text-sm leading-none cursor-pointer ${
                    field.value
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  Recuérdame
                </label>
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            type="submit"
            disabled={
              isProcessing || !form.watch('email') || !form.watch('password')
            }
          >
            {isProcessing ? <Spinner className="size-4 animate-spin" /> : null}
            Iniciar sesión
          </Button>
        </div>
      </form>
    </Form>
  );
}
