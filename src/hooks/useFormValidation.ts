import { useState, useCallback } from "react";

/* ── Types ── */

export type ValidationRule = {
  test: (value: string, allValues?: Record<string, string>) => boolean;
  message: string;
};

type FieldErrors = Record<string, string>;
type FieldTouched = Record<string, boolean>;

/* ── Built-in rules ── */

export const rules = {
  required: (label = "Campo"): ValidationRule => ({
    test: (v) => v.trim().length > 0,
    message: `${label} é obrigatório.`,
  }),

  email: (): ValidationRule => ({
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "E-mail inválido.",
  }),

  minLength: (min: number, label = "Campo"): ValidationRule => ({
    test: (v) => v.length >= min,
    message: `${label} deve ter no mínimo ${min} caracteres.`,
  }),

  maxLength: (max: number, label = "Campo"): ValidationRule => ({
    test: (v) => v.length <= max,
    message: `${label} deve ter no máximo ${max} caracteres.`,
  }),

  matches: (fieldKey: string, label = "Senhas"): ValidationRule => ({
    test: (v, all) => !!all && v === all[fieldKey],
    message: `${label} não coincidem.`,
  }),

  noSpaces: (label = "Campo"): ValidationRule => ({
    test: (v) => !/\s/.test(v),
    message: `${label} não pode conter espaços.`,
  }),

  strongPassword: (): ValidationRule => ({
    test: (v) =>
      /[a-z]/.test(v) &&
      /[A-Z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[^a-zA-Z0-9]/.test(v),
    message: "Senha deve conter letra maiúscula, minúscula, número e caractere especial.",
  }),

  username: (): ValidationRule => ({
    test: (v) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
    message: "Use 3-20 caracteres: letras, números e _",
  }),

  minAge: (min: number): ValidationRule => ({
    test: (v) => {
      const n = Number(v);
      return !isNaN(n) && n >= min;
    },
    message: `Idade mínima é ${min} anos.`,
  }),

  maxAge: (max: number): ValidationRule => ({
    test: (v) => {
      const n = Number(v);
      return !isNaN(n) && n <= max;
    },
    message: `Idade máxima é ${max} anos.`,
  }),

  code: (length = 6): ValidationRule => ({
    test: (v) => v.trim().length === length,
    message: `O código deve ter ${length} caracteres.`,
  }),

  strongPassword: (): ValidationRule => ({
    test: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(v),
    message: "Senha deve conter letra maiúscula, minúscula, número e caractere especial.",
  }),
};

/* ── Hook ── */

export function useFormValidation<T extends Record<string, string>>(
  schema: Record<keyof T, ValidationRule[]>,
) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  /** Validate a single field — returns the first error or empty string */
  const validateField = useCallback(
    (name: string, value: string, allValues: Record<string, string>): string => {
      const fieldRules = schema[name as keyof T];
      if (!fieldRules) return "";
      for (const rule of fieldRules) {
        if (!rule.test(value, allValues)) return rule.message;
      }
      return "";
    },
    [schema],
  );

  /** Validate all fields — returns true if valid */
  const validate = useCallback(
    (values: T): boolean => {
      const newErrors: FieldErrors = {};
      let valid = true;

      for (const key of Object.keys(schema) as Array<keyof T & string>) {
        const msg = validateField(key, values[key], values);
        if (msg) {
          newErrors[key] = msg;
          valid = false;
        }
      }

      setErrors(newErrors);
      setSubmitted(true);
      // mark all as touched
      const allTouched: FieldTouched = {};
      for (const key of Object.keys(schema)) allTouched[key] = true;
      setTouched(allTouched);

      return valid;
    },
    [schema, validateField],
  );

  /** Call on blur — validates only if field was touched or form was submitted */
  const onBlur = useCallback(
    (name: string, value: string, allValues: Record<string, string>) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const msg = validateField(name, value, allValues);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [validateField],
  );

  /** Call on change — clears error if now valid (only when touched) */
  const onChange = useCallback(
    (name: string, value: string, allValues: Record<string, string>) => {
      if (!touched[name] && !submitted) return;
      const msg = validateField(name, value, allValues);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [touched, submitted, validateField],
  );

  /** Get error to display: only when touched or form submitted */
  const fieldError = useCallback(
    (name: string): string => {
      if (!touched[name] && !submitted) return "";
      return errors[name] ?? "";
    },
    [errors, touched, submitted],
  );

  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setFormError("");
  }, []);

  /** Set field errors returned from the backend — marks affected fields as touched */
  const setServerErrors = useCallback((serverErrors: Record<string, string>) => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
    setTouched((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(serverErrors)) next[key] = true;
      return next;
    });
  }, []);

  return { errors, validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors, reset, submitted };
}
