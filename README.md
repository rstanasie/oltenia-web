# Oltenia — sitio web

Sitio web de Oltenia (ventilación, climatización y aire acondicionado, Zaragoza).
Objetivo principal: captación de personal. Objetivo secundario: presentar los servicios.

Next.js 16 (App Router) · TypeScript estricto · Tailwind CSS 4 · Sanity (contenido) · Vercel (hosting).
Sin base de datos propia, sin formularios con backend, sin analítica, cookies ni scripts de terceros.

Los propietarios editan el contenido en **Sanity Studio** (`/studio`), sin tocar código ni Git.
Ver [`GUIA_PROPIETARIOS.md`](./GUIA_PROPIETARIOS.md) para la guía de uso en castellano sencillo.

## Requisitos

- Node.js 20.9 o superior (recomendado 22+ para las herramientas de línea de comandos de Sanity)
- npm
- Una cuenta gratuita en [sanity.io](https://www.sanity.io/) y un proyecto creado (ver más abajo)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y rellena las variables de Sanity (ver siguiente sección)
npm run dev                  # http://localhost:3000
```

Studio queda disponible en `http://localhost:3000/studio` (pide iniciar sesión con una cuenta de
Sanity que tenga acceso al proyecto).

## Configurar Sanity (una sola vez)

1. Crea un proyecto en [manage.sanity.io](https://manage.sanity.io) (o `npx sanity@latest init` desde
   esta carpeta, que puede crear el proyecto y el dataset por ti). Dataset recomendado: `production`.
2. Copia el **Project ID** y el nombre del **dataset** a `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. En manage.sanity.io → tu proyecto → **API → Tokens**, crea dos tokens:
   - Uno con rol **Viewer** → `SANITY_API_READ_TOKEN` en `.env.local`. Permite ver borradores en
     modo vista previa; nunca se expone al navegador.
   - Uno con rol **Editor** → `SANITY_API_WRITE_TOKEN` en `.env.local`. Solo se usa para
     `npm run sanity:migrate`, ejecutado desde tu máquina; nunca lo pongas en Vercel.
4. En manage.sanity.io → tu proyecto → **API → CORS Origins**, añade (esto es necesario para que
   `/studio` funcione desde el navegador; las páginas públicas se generan en el servidor y no lo
   necesitan):
   - `http://localhost:3000` (permitir credenciales: sí)
   - tu dominio de producción cuando lo tengas, p. ej. `https://oltenia.es` (permitir credenciales: sí)
   - opcional: `https://*.vercel.app` (permitir credenciales: sí), si quieres usar `/studio` desde
     las URLs Preview de Vercel (una distinta por cada rama/PR)
5. Añade personas con acceso en **manage.sanity.io → tu proyecto → Members**. El plan gratuito de
   Sanity ("Free") incluye varios puestos de **Editor**; roles más avanzados (p. ej. permisos por
   tipo de documento) requieren un plan de pago — comprueba los límites actuales en tu panel antes
   de asumir que están disponibles.
6. Siembra el contenido inicial (idempotente, puedes volver a ejecutarlo sin duplicar nada ni
   pisar ediciones ya hechas en Studio):
   ```bash
   npm run sanity:migrate
   ```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (sitio + Studio en `/studio`) |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera tipos de rutas y ejecuta `tsc` |
| `npm run content:check` | Valida el contenido publicado en Sanity (falla solo con errores de formato) |
| `npm run content:check:launch` | Valida para lanzamiento (falla si falta información crítica) |
| `npm run sanity:migrate` | Siembra/actualiza el contenido inicial en Sanity (seguro de repetir) |
| `npm run check` | lint + typecheck + content:check + build |

## Editar el contenido

Todo el contenido editable vive en Sanity (`/studio`), agrupado por tipo:

- **Marca y publicación** — nombre, logo, ciudad, e interruptor de publicación.
- **Presentación de la empresa** — texto breve, historia, forma de trabajar, certificaciones, zona
  de trabajo, marcas.
- **Contacto** — teléfono/WhatsApp/correo de clientes y de candidaturas, dirección, horario,
  mensajes prellenados.
- **Datos legales** — todo lo que alimenta Aviso legal y Privacidad.
- **Equipo** — una persona por documento: nombre, cargo, biografía, foto.
- **Servicios** — ventilación, climatización, aire acondicionado: descripción, actividades, foto.
- **Ofertas de empleo** — cada oferta abierta o cerrada, con sus condiciones.
- **Fotos** — la galería de proyectos (y, si se añaden, equipo/instalaciones).
- **Etapas del oficio** — el contenido educativo del camino profesional en «Trabaja con nosotros».
- **Páginas de inicio / servicios / «Trabaja con nosotros» / «En detalle»** — titulares, textos de
  introducción y botones de cada página.
- **SEO por página** — títulos y descripciones para buscadores, opcionales (si se dejan vacíos, el
  sitio genera unos por defecto).

Reglas que sigue aplicando el validador y el propio Studio:

- Añade solo información confirmada por la empresa; dejar un campo vacío es la opción correcta
  mientras no se sepa algo.
- Los campos de Sanity tienen validación integrada (formato de teléfono, longitud del texto
  alternativo de las fotos, rango salarial, etc.) y avisan en rojo antes de poder publicar.
- Las secciones opcionales (historia, equipo, fotos, certificaciones, zona de trabajo, marcas,
  horario, dirección…) aparecen en el sitio solo cuando tienen contenido.
- Ejecuta `npm run content:check` después de cambios grandes, o antes de lanzar.

### Flujo de edición

1. Entra en `/studio` e inicia sesión.
2. Elige el documento (página, servicio, oferta, foto…).
3. Cambia el texto o sube una imagen. Sanity guarda un borrador automáticamente.
4. Pulsa **Publish**. El cambio aparece en el sitio público en segundos, sin tocar Vercel ni Git
   (ver «Cómo se actualiza el sitio» más abajo).

### Fotos

Sube las imágenes directamente en Sanity Studio (arrastrar y soltar). Para cada foto:

- Rellena el **texto alternativo** describiendo qué se ve y dónde (obligatorio).
- Activa **Permiso de publicación** solo con permiso por escrito (personas que aparecen, cliente,
  obra). Mientras esté desactivado, la foto no se muestra en el sitio.
- Asigna la **colección** (proyectos, equipo o instalaciones) y, si quieres agruparla con otras,
  el mismo texto de **pie de foto / categoría**.
- El **orden** controla la posición dentro de su categoría.

Sanity optimiza automáticamente el tamaño y formato de cada imagen para cada dispositivo.

### Fabricación propia (contenido histórico)

Oltenia ya no fabrica conductos. Las fotos del taller de fabricación solo existen en la página
**«En detalle»**, con el contexto explicado (fue una etapa anterior). No las uses en «Servicios»
como si fueran un servicio actual, y no desactives la nota de archivo de esa página.

## Cómo se actualiza el sitio (sin redesplegar)

Las páginas se generan en el servidor con `sanityFetch` (`src/sanity/lib/fetch.ts`), que lee el
contenido publicado desde el CDN de Sanity y lo cachea 5 minutos (300 segundos). Al publicar un
cambio en Studio, cada visitante lo verá en cuanto esa caché expire para la página que esté
visitando — no es instantáneo ni garantiza que todos lo vean a los 5 minutos exactos, pero no
requiere redesplegar, esperar una compilación, ni mantener un webhook. El navegador de los
visitantes nunca contacta con la API de Sanity directamente (las imágenes siguen sirviéndose desde
su CDN, `cdn.sanity.io`, que no tiene este problema).

Previsualización de borradores (Draft Mode): `/api/draft-mode/enable` activa un modo que muestra
contenido sin publicar (usado por el botón "Presentation"/previsualización de Sanity Studio);
`/api/draft-mode/disable` lo desactiva. Con Draft Mode activado, `sanityFetch` obtiene el borrador
sin caché en cada petición. Los visitantes normales nunca ven borradores: sin modo borrador
activado, siempre reciben contenido publicado.

## Variables de entorno

Ver `.env.example`. Resumen:

| Variable | Secreta | Dónde se usa |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No | Sitio y Studio (identifica el proyecto) |
| `NEXT_PUBLIC_SANITY_DATASET` | No | Sitio y Studio |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Opcional, por defecto `2025-01-01` |
| `SANITY_API_READ_TOKEN` | Sí | Servidor: previsualizar borradores |
| `SANITY_API_WRITE_TOKEN` | Sí | Solo local/CI: `npm run sanity:migrate` |
| `NEXT_PUBLIC_SITE_URL` | No | Dominio definitivo (canonical, sitemap, Open Graph) |
| `SITE_INDEXING` | No | `true` para permitir indexación |

## Indexación: vista previa y producción

El sitio es indexable **solo** si se cumplen todas estas condiciones:

1. `SITE_INDEXING=true`
2. `NEXT_PUBLIC_SITE_URL` válido (https, no localhost, no `*.vercel.app`)
3. No es un despliegue de Vercel Preview/Development (`VERCEL_ENV`)
4. En Sanity, «Marca y publicación» → «Contenido aprobado para publicar» está activado

Si no, todas las páginas llevan `noindex, nofollow`, `robots.txt` bloquea todo, el sitemap está
vacío, se envía `X-Robots-Tag: noindex` y aparece la franja "Vista previa" en la parte superior.
Las páginas legales siguen siendo `noindex` hasta que «Datos legales» → «Revisado por un asesor
cualificado» esté activado.

## Despliegue en Vercel

1. Sube el repositorio a GitHub/GitLab/Bitbucket (ver «Primer commit» más abajo si el proyecto
   aún no tiene su propio repositorio Git).
2. En Vercel: *Add New → Project*, importa el repositorio. Vercel detecta Next.js; no cambies los
   comandos (`npm install`, `npm run build`).
3. En *Settings → Environment Variables*, añade (solo para **Production**, salvo que se indique
   otra cosa):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` → en Production **y** Preview,
     para que las URLs de vista previa de Vercel también puedan leer Sanity.
   - `SANITY_API_READ_TOKEN` → en Production y Preview.
   - **No** añadas `SANITY_API_WRITE_TOKEN` a Vercel: solo se usa en local/CI para migrar.
   - `NEXT_PUBLIC_SITE_URL` y `SITE_INDEXING` → solo en Production, y `SITE_INDEXING` solo al
     lanzar (ver checklist).
4. Añade el dominio de producción a los **CORS Origins** del proyecto en manage.sanity.io (ver
   «Configurar Sanity» más arriba) — si no, el sitio desplegado no podrá leer Sanity.
5. Cada push a la rama principal despliega Producción; cada rama/PR genera una URL Preview
   (siempre `noindex`).
6. Recomendado: añade `npm run check` como paso de CI o ejecútalo antes de cada push.

### Primer commit (si el proyecto todavía no es un repositorio Git propio)

Ejecuta esto desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "feat: sitio Oltenia con gestión de contenido en Sanity"
git branch -M main
git remote add origin <url-de-tu-repositorio-vacio>
git push -u origin main
```

## Dominio

1. Compra el dominio (o usa el existente).
2. Vercel → Project → *Settings → Domains* → añade el dominio y, si quieres, la variante `www`
   con redirección a la principal.
3. Configura en el proveedor del dominio los registros DNS que indique Vercel (A / CNAME).
   Vercel emite el certificado HTTPS automáticamente. **No borres ni modifiques registros MX o de
   correo existentes** al añadir los registros de Vercel.
4. En *Settings → Environment Variables*, solo para **Production**:
   `NEXT_PUBLIC_SITE_URL=https://<dominio>` y, al lanzar, `SITE_INDEXING=true`.
5. Añade `https://<dominio>` a los CORS Origins del proyecto de Sanity.
6. Redespliega Producción para aplicar las variables (se leen en el build).

Ver `LAUNCH_CHECKLIST.md` antes de activar la indexación.

## Recuperarse de un error

- **Publicaste algo por error en Sanity**: abre el documento → menú del documento (···) →
  *Review changes* / historial, y restaura la versión anterior. Sanity guarda el historial de
  cada documento.
- **Quieres deshacer solo texto, no volver a una versión entera**: edítalo de nuevo y publica —
  no hay "producción" que romper hasta que publiques.
- **Un despliegue de Vercel falla**: Vercel mantiene el despliegue de producción anterior activo;
  arregla el error (normalmente visible en el log del build) y vuelve a desplegar. No afecta al
  contenido en Sanity.
- **Token comprometido**: revócalo en manage.sanity.io → API → Tokens y crea uno nuevo.

## Estructura

```
sanity.config.ts     configuración de Sanity Studio (esquema, estructura, plugins)
sanity.cli.ts         configuración para los comandos `sanity` (si se usan)
src/
  app/
    (site)/          rutas del sitio público, con su propio layout (Header/Footer)
    studio/          Studio embebido en /studio, con su propio layout (sin Header/Footer)
    api/draft-mode/  activar/desactivar la vista previa de borradores
    robots.ts, sitemap.ts, icon.svg, apple-icon.tsx, social-preview.png/route.tsx
  components/        cabecera, navegación móvil, pie, botones, contacto, ofertas, galería, avisos
  content/           funciones que leen Sanity y devuelven los tipos de content/types.ts
  data/              tipos compartidos (sin datos codificados)
  lib/               enlaces de contacto, configuración del sitio, metadatos, datos estructurados
  sanity/            cliente, consultas GROQ, mapeo a los tipos de la app, esquema de contenido
scripts/             validate-content.ts, migrate-to-sanity.ts
```

La navegación móvil (`SiteNav`) y el formulario de candidatura (`ApplicationForm`) son los únicos
componentes de cliente con lógica propia; el resto del sitio se renderiza en el servidor.
