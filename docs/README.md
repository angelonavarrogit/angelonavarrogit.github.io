# Portfolio EVERGREEN — Documentación Completa

## Resumen del Proyecto

Portfolio profesional para posicionamiento como **Enterprise Systems Engineer** con enfoque en telecomunicaciones, automatización, data engineering e inteligencia artificial.

- **URL**: https://angelonavarrogit.github.io
- **Repo**: https://github.com/angelonavarrogit/angelonavarrogit.github.io
- **Stack**: Next.js 15 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Deploy**: GitHub Pages (static export) con GitHub Actions CI/CD
- **i18n**: Español / English (client-side con next-intl + Zustand)

---

## Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js
│   ├── page.tsx            # Home page (ensambla todas las secciones)
│   ├── layout.tsx          # Root layout (fonts, providers, header)
│   ├── globals.css         # Theme tokens, animaciones, utilities
│   └── blog/[slug]/        # Páginas de blog (MDX)
├── components/
│   ├── layout/             # Header, Footer, LanguageToggle, MobileMenu
│   ├── providers/          # I18nProvider, HtmlLangUpdater
│   ├── sections/           # Todas las secciones de la página
│   └── shared/             # Componentes reutilizables
├── content/blog/           # Artículos MDX
├── data/                   # Datos estáticos (experience, projects, skills, etc.)
├── hooks/                  # useLocale (Zustand store)
├── lib/                    # Utilidades (blog, github, i18n, seo, types, validations)
├── messages/               # Traducciones ES/EN (JSON)
└── __tests__/              # Tests unitarios y de integración
```

---

## Secciones de la Página (orden actual)

| # | Sección | Archivo | Propósito |
|---|---------|---------|-----------|
| 1 | Hero | `HeroSection.tsx` | Posicionamiento: nombre, título, tagline, CTAs, LinkedIn |
| 2 | What I Do | `WhatIDoSection.tsx` | 4 capacidades enterprise |
| 3 | Industries | `IndustriesSection.tsx` | 7 sectores donde puede aportar |
| 4 | Highlights | `HighlightsSection.tsx` | 6 métricas de impacto profesional |
| 5 | About | `AboutSection.tsx` | Storytelling + foto + info pills |
| 6 | Experience | `ExperienceSection.tsx` | Timeline con achievements |
| 7 | Philosophy | `PhilosophySection.tsx` | 5 principios de ingeniería |
| 8 | Featured Tech | `FeaturedTechSection.tsx` | Stack agrupado por dominio |
| 9 | Projects | `ProjectsSection.tsx` | Case studies (Problema/Solución/Resultado) |
| 10 | Cert Roadmap | `CertRoadmapSection.tsx` | Certificaciones + Credly badges |
| 11 | Learning | `LearningSection.tsx` | Qué está aprendiendo |
| 12 | Blog | `BlogSection.tsx` | Artículos técnicos MDX |
| 13 | Quote | `QuoteSection.tsx` | Frase personal |
| 14 | Outside Work | `OutsideWorkSection.tsx` | Lado humano |
| 15 | Contact | `ContactSection.tsx` | Formulario + social links |
| 16 | Footer | `Footer.tsx` | Tech stack + Made in Panama |

---

## Cómo Ejecutar Localmente

```bash
# 1. Clonar
git clone https://github.com/angelonavarrogit/angelonavarrogit.github.io.git
cd angelonavarrogit.github.io

# 2. Instalar dependencias
npm install

# 3. Desarrollo
npm run dev
# → http://localhost:3000

# 4. Build (static export)
npm run build
# → Genera carpeta /out con archivos estáticos

# 5. Tests
npx vitest run
```

---

## Cómo Hacer Cambios

### Cambiar datos personales
- **Contacto**: `src/components/sections/ContactSection.tsx` (social links)
- **Hero**: `src/components/sections/HeroSection.tsx` (LinkedIn URL, domains)
- **SEO**: `src/lib/seo.ts` (JSON-LD, sameAs URLs)

### Cambiar contenido/texto
- **Español**: `src/messages/es.json`
- **English**: `src/messages/en.json`
- Cada sección tiene su namespace (hero, about, experience, etc.)

### Agregar un proyecto
1. Editar `src/data/projects.ts` — agregar entrada al array
2. Agregar traducciones en `es.json` y `en.json` bajo `projects.{id}`
3. Agregar imagen en `public/images/projects/`

### Agregar artículo de blog
1. Crear archivo `.mdx` en `src/content/blog/`
2. Incluir frontmatter: title, publishedAt, summary, category, language
3. Build regenera la lista automáticamente

### Agregar certificación/badge
1. Editar `src/components/sections/CertRoadmapSection.tsx`
2. Agregar al array `ROADMAP` o `CREDLY_BADGES`

---

## Deploy (GitHub Pages)

El deploy es automático via GitHub Actions:

1. Push a `main` → dispara workflow
2. Workflow: instala deps → build → upload artifact → deploy to Pages
3. Archivo: `.github/workflows/deploy.yml`
4. Config Pages: Settings → Pages → Source: GitHub Actions

### Para deploy manual:
```bash
npm run build
# Sube la carpeta /out a cualquier hosting estático
```

---

## Archivos Clave de Configuración

| Archivo | Propósito |
|---------|-----------|
| `next.config.ts` | Static export, SVG support, optimization |
| `tailwind.config.ts` | Dark theme, colors, animations, fonts |
| `tsconfig.json` | TypeScript strict, path aliases |
| `.github/workflows/deploy.yml` | CI/CD a GitHub Pages |
| `public/sitemap.xml` | SEO sitemap estático |
| `public/robots.txt` | Directivas de crawling |

---

## Decisiones de Diseño

- **Dark mode only** — No hay toggle claro/oscuro. El verde bosque sobre negro es la marca.
- **No framework de componentes** — Todo es TailwindCSS puro, no shadcn/ui ni Material.
- **Static export** — Sin servidor. Compatible con GitHub Pages, Netlify, Cloudflare Pages.
- **Client-side i18n** — Sin prefijos de ruta (/en, /es). Cambio instantáneo sin reload.
- **Framer Motion** — Todas las animaciones respetan `prefers-reduced-motion`.
- **Case Study format** — Proyectos muestran Problema→Solución→Resultado, no solo descripción.
