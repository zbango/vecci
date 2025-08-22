'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@/lib/api';
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
import { Icons } from '@/components/common/icons';
import { RecaptchaPopover } from '@/components/common/recaptcha-popover';
import { checkPasswordRequirements } from '../forms/password-schema';
import { getSignupSchema, SignupSchemaType } from '../forms/signup-schema';

export default function Page() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(getSignupSchema()),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      accept: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await form.trigger();
    if (!result) return;

    setShowRecaptcha(true);
  };

  const handleVerifiedSubmit = async (token: string) => {
    try {
      const values = form.getValues();

      setIsProcessing(true);
      setError(null);
      setShowRecaptcha(false);

      const response = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': token,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Alert onClose={() => setSuccess(false)}>
        <AlertIcon>
          <Check />
        </AlertIcon>
        <AlertTitle>
          ¡Te has registrado exitosamente! Revisa tu correo electrónico para
          verificar tu cuenta y luego{' '}
          <Link
            href="/signin/"
            className="text-primary hover:text-primary-darker"
          >
            Iniciar sesión
          </Link>
          .
        </AlertTitle>
      </Alert>
    );
  }

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="block w-full space-y-5">
          <div className="space-y-1.5 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Crear una cuenta
            </h1>
          </div>

          <div className="flex flex-col gap-3.5">
            <Button
              variant="outline"
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              <Icons.googleColorful className="size-4!" /> Registrarse con
              Google
            </Button>
          </div>

          <div className="relative py-1.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                o
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" onClose={() => setError(null)}>
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre y Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre y apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="Tu correo electrónico" {...field} />
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
                <FormLabel>Contraseña</FormLabel>
                <div className="relative">
                  <Input
                    placeholder="Tu contraseña"
                    type={passwordVisible ? 'text' : 'password'}
                    onFocus={() => setShowPasswordRequirements(true)}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      const requirements = checkPasswordRequirements(
                        field.value,
                      );
                      const allMet = requirements.every((req) => req.met);
                      if (allMet) {
                        setShowPasswordRequirements(false);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    size="sm"
                    onClick={() => setPasswordVisible(!passwordVisible)}
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
                {form.watch('password') && showPasswordRequirements && (
                  <div className="mt-2 space-y-1">
                    {checkPasswordRequirements(form.watch('password')).map(
                      (req, index) => (
                        <div
                          key={index}
                          className={`text-xs flex items-center gap-1 ${req.met ? 'text-green-600' : 'text-red-500'}`}
                        >
                          <span>{req.met ? '✓' : '•'}</span>
                          <span>{req.text}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}
                {!showPasswordRequirements && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <div className="relative">
                  <Input
                    type={passwordConfirmationVisible ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Trigger validation immediately for password confirmation
                      form.trigger('passwordConfirmation');
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    size="sm"
                    onClick={() =>
                      setPasswordConfirmationVisible(
                        !passwordConfirmationVisible,
                      )
                    }
                    className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    aria-label={
                      passwordConfirmationVisible
                        ? 'Hide password confirmation'
                        : 'Show password confirmation'
                    }
                  >
                    {passwordConfirmationVisible ? (
                      <EyeOff className="text-muted-foreground" />
                    ) : (
                      <Eye className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {!(
                  field.value &&
                  form.watch('password') &&
                  field.value === form.watch('password')
                ) && <FormMessage />}
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="accept"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        id="accept"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                      <label
                        htmlFor="accept"
                        className={`text-sm leading-none cursor-pointer ${
                          field.value
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Acepto la
                      </label>
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="-ms-0.5 text-sm font-semibold text-blue-600 hover:font-bold hover:text-primary"
                      >
                        Términos y Condiciones
                      </Link>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <RecaptchaPopover
              open={showRecaptcha}
              onOpenChange={(open) => {
                if (!open) {
                  setShowRecaptcha(false);
                }
              }}
              onVerify={handleVerifiedSubmit}
              trigger={
                <Button
                  type="submit"
                  disabled={
                    isProcessing ||
                    !form.watch('name') ||
                    !form.watch('email') ||
                    !form.watch('password') ||
                    !form.watch('passwordConfirmation') ||
                    !form.watch('accept')
                  }
                >
                  {isProcessing ? (
                    <Spinner className="size-4 animate-spin" />
                  ) : null}
                  Registrarse
                </Button>
              }
            />
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Ya tienes una cuenta?{' '}
            <Link
              href="/signin"
              className="text-sm text-sm font-semibold text-blue-600 hover:font-bold hover:text-primary"
            >
              Iniciar sesión
            </Link>
          </div>
        </form>
      </Form>
    </Suspense>
  );
}
