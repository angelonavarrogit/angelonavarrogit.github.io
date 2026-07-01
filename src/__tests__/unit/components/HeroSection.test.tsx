import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroSection from '@/components/sections/HeroSection';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';

// Mock framer-motion to avoid animation-related test complexity
vi.mock('framer-motion', () => ({
  motion: {
    h1: (props: Record<string, unknown>) => {
      const { children, initial, animate, transition, ...rest } = props;
      return React.createElement('h1', rest, children as React.ReactNode);
    },
  },
  useReducedMotion: () => false,
}));

function renderWithI18n(locale: 'es' | 'en' = 'en') {
  const messages = locale === 'en' ? enMessages : esMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeroSection />
    </NextIntlClientProvider>
  );
}

describe('HeroSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with section id="hero" and aria-labelledby', () => {
    renderWithI18n();
    const section = screen.getByRole('region', { name: /angelo navarro/i });
    expect(section).toHaveAttribute('id', 'hero');
  });

  it('renders the name "Angelo Navarro" in a heading', () => {
    renderWithI18n();
    const heading = screen.getByRole('heading', { level: 1, name: /angelo navarro/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'hero-heading');
  });

  it('renders greeting text from translations (EN)', () => {
    renderWithI18n('en');
    expect(screen.getByText("Hi, I'm")).toBeInTheDocument();
  });

  it('renders greeting text from translations (ES)', () => {
    renderWithI18n('es');
    expect(screen.getByText('Hola, soy')).toBeInTheDocument();
  });

  it('renders "Hire Me" CTA button in English', () => {
    renderWithI18n('en');
    expect(screen.getByRole('button', { name: /hire me/i })).toBeInTheDocument();
  });

  it('renders "Download CV" CTA button in English', () => {
    renderWithI18n('en');
    expect(screen.getByRole('button', { name: /download cv/i })).toBeInTheDocument();
  });

  it('renders CTA buttons in Spanish', () => {
    renderWithI18n('es');
    expect(screen.getByRole('button', { name: /contrátame/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /descargar cv/i })).toBeInTheDocument();
  });

  it('"Hire Me" button scrolls to #contact section', () => {
    // Create a contact section in the document
    const contactDiv = document.createElement('div');
    contactDiv.id = 'contact';
    contactDiv.scrollIntoView = vi.fn();
    document.body.appendChild(contactDiv);

    renderWithI18n('en');
    const hireBtn = screen.getByRole('button', { name: /hire me/i });
    fireEvent.click(hireBtn);

    expect(contactDiv.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(contactDiv);
  });

  it('shows error message when CV PDF is not available (404)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    renderWithI18n('en');
    const downloadBtn = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('CV not available at this time');
    });
  });

  it('shows error message when CV fetch throws a network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithI18n('en');
    const downloadBtn = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('CV not available at this time');
    });
  });

  it('triggers download when CV PDF is available', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    // Mock DOM manipulation for download
    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    renderWithI18n('en');
    const downloadBtn = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      // Verify fetch was called to check the file
      expect(global.fetch).toHaveBeenCalledWith('/cv/angelo-navarro-cv.pdf', { method: 'HEAD' });
    });

    // No error should be shown
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('clears previous error on new download attempt', async () => {
    // First attempt: fail
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    renderWithI18n('en');
    const downloadBtn = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Second attempt: succeed
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
