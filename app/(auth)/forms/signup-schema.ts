import { z } from 'zod';
import { getPasswordSchema } from './password-schema';

export const getSignupSchema = () => {
  return z
    .object({
      name: z
        .string()
        .min(1, { message: 'Nombre y apellido es requerido.' })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}.*$/, {
          message: 'Nombre ingresado no válido.',
        }),
      email: z
        .string()
        .email({ message: 'Email ingresado no válido.' })
        .min(1, { message: 'Email es requerido.' }),
      password: getPasswordSchema(), // Uses the updated password schema with direct messages
      passwordConfirmation: z.string().min(1, {
        message: 'Confirmación de contraseña es requerida.',
      }),
      accept: z.boolean().refine((val) => val === true, {
        message: 'Debe aceptar los términos y condiciones.',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Las contraseñas no coinciden.',
      path: ['passwordConfirmation'],
    });
};

export type SignupSchemaType = z.infer<ReturnType<typeof getSignupSchema>>;
