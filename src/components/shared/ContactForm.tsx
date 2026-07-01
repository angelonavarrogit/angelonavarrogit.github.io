'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { contactFormSchema } from '@/lib/validations/contact';
import type { ContactFormData } from '@/lib/types';

/**
 * ContactForm — Accessible contact form with Zod validation via React Hook Form.
 *
 * Features:
 * - Validates on blur (mode: 'onBlur') and re-validates on change after first error
 * - Field-specific inline error messages (<100ms render)
 * - Submit flow: disable button → show loader → success message (5s) → reset
 * - On server/network error: show error, preserve data, re-enable button
 * - Accessible: labels, aria-describedby for errors, required attributes
 *
 * @see Requirements 10.1, 10.2, 10.3, 10.4
 */
export default function ContactForm() {
  const t = useTranslations('contact');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (formStatus === 'success') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus, reset]);

  const onSubmit = useCallback(async (data: ContactFormData) => {
    setFormStatus('submitting');
    setServerError('');

    try {
      // Static export: use mailto as fallback (no server API available on GitHub Pages)
      const subject = encodeURIComponent(data.subject);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      );
      const mailtoUrl = `mailto:navarro.angelo@outlook.com?subject=${subject}&body=${body}`;
      
      window.open(mailtoUrl, '_blank');
      setFormStatus('success');
    } catch {
      setFormStatus('error');
      setServerError(t('errors.submitFailed'));
    }
  }, [t]);

  /**
   * Returns the translated error message for a given field error.
   */
  function getErrorMessage(field: keyof ContactFormData): string | undefined {
    const error = errors[field];
    if (!error) return undefined;

    const errorMap: Record<string, Record<string, string>> = {
      name: {
        too_small: t('errors.nameMin'),
        too_big: t('errors.nameMax'),
      },
      email: {
        too_big: t('errors.emailMax'),
        invalid_string: t('errors.emailInvalid'),
      },
      subject: {
        too_small: t('errors.subjectMin'),
        too_big: t('errors.subjectMax'),
      },
      message: {
        too_small: t('errors.messageMin'),
        too_big: t('errors.messageMax'),
      },
    };

    const type = error.type as string;
    return errorMap[field]?.[type] ?? error.message;
  }

  const isSubmitting = formStatus === 'submitting';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-label={t('title')}
    >
      {/* Name field */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1">
          {t('fields.name')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          placeholder={t('fields.name')}
          {...register('name')}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="mt-1 text-sm text-red-400">
            {getErrorMessage('name')}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1">
          {t('fields.email')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          placeholder={t('fields.email')}
          {...register('email')}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="mt-1 text-sm text-red-400">
            {getErrorMessage('email')}
          </p>
        )}
      </div>

      {/* Subject field */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1">
          {t('fields.subject')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          placeholder={t('fields.subject')}
          {...register('subject')}
        />
        {errors.subject && (
          <p id="contact-subject-error" role="alert" className="mt-1 text-sm text-red-400">
            {getErrorMessage('subject')}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1">
          {t('fields.message')} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-y min-h-[120px]"
          placeholder={t('fields.message')}
          {...register('message')}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 text-sm text-red-400">
            {getErrorMessage('message')}
          </p>
        )}
      </div>

      {/* Server error message */}
      {formStatus === 'error' && serverError && (
        <div role="alert" className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Success message */}
      {formStatus === 'success' && (
        <div role="status" className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
          <p className="text-sm text-green-400">{t('success')}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-all hover:brightness-110 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{t('fields.submit')}...</span>
          </span>
        ) : (
          t('fields.submit')
        )}
      </button>
    </form>
  );
}
