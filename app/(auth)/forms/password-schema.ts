import { z } from 'zod';

export const getPasswordSchema = (minLength = 8) => {
  return z.string().refine(
    (password) => {
      return (
        password.length >= minLength &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
      );
    },
    {
      message: 'La contraseña no cumple con los requisitos.',
    },
  );
};

export const getPasswordRequirements = (minLength = 8) => [
  `Al menos ${minLength} caracteres`,
  'Al menos una letra mayúscula',
  'Al menos una letra minúscula',
  'Al menos un número',
  'Al menos un carácter especial',
];

export const checkPasswordRequirements = (password: string, minLength = 8) => {
  return [
    {
      text: `Al menos ${minLength} caracteres`,
      met: password.length >= minLength,
    },
    { text: 'Al menos una letra mayúscula', met: /[A-Z]/.test(password) },
    { text: 'Al menos una letra minúscula', met: /[a-z]/.test(password) },
    { text: 'Al menos un número', met: /\d/.test(password) },
    {
      text: 'Al menos un carácter especial',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
};
