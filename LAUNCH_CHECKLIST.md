# Lista de lanzamiento

No actives la indexación hasta completar todos los puntos.

## 1. Contenido
- [ ] `CONTENT_CHECKLIST.md` completado
- [ ] `npm run content:check:launch` termina sin errores ni bloqueos
- [ ] Ningún dato inventado: cada teléfono, correo, dirección, oferta y foto confirmados por la empresa
- [ ] Las ofertas publicadas siguen abiertas; las cerradas tienen `status: "closed"`
- [ ] Textos revisados por alguien nativo (castellano de España)

## 2. Enlaces de contacto (probar en un móvil real)
- [ ] El botón de teléfono abre la llamada al número correcto
- [ ] WhatsApp abre el chat correcto con el mensaje prellenado bien escrito
- [ ] El correo abre el cliente de correo con destinatario, asunto y cuerpo correctos
- [ ] "Ver en el mapa" muestra la ubicación correcta (si hay dirección)
- [ ] Se ha enviado un mensaje de prueba por cada canal y alguien lo ha recibido

## 3. Páginas legales
- [ ] Aviso legal completo, sin marcas `[Pendiente: …]` ni aviso de borrador
- [ ] Privacidad completa, sin marcas `[Pendiente: …]` ni aviso de borrador
- [ ] Revisadas por un profesional; `legal.reviewed: true` y `legal.lastReviewed`
- [ ] Revisado si algún cambio (analítica, formularios, mapas embebidos) exige actualizar textos o cookies

## 4. Móvil y teclado
- [ ] Inicio, Trabaja con nosotros, Servicios, Sobre Oltenia y Contacto en un móvil estrecho (320–375 px) y en escritorio
- [ ] Sin desplazamiento horizontal
- [ ] Menú móvil: abre, cierra con Escape (el foco vuelve al botón) y al elegir una página
- [ ] Con Tab: aparece "Saltar al contenido", el foco es visible y el orden es lógico
- [ ] Con zoom al 200 % el contenido sigue siendo legible

## 5. Dominio y metadatos
- [ ] Dominio conectado en Vercel con HTTPS
- [ ] `NEXT_PUBLIC_SITE_URL=https://<dominio>` solo en Production
- [ ] El código fuente de cada página tiene `<link rel="canonical">` con el dominio definitivo
- [ ] Títulos y descripciones correctos en cada página
- [ ] La vista previa al compartir un enlace (WhatsApp, redes) muestra la imagen y el título

## 6. Indexación
- [ ] En Sanity Studio → «Marca y publicación»: «Contenido aprobado para publicar» activado, con «Aprobado por» y «Fecha de aprobación»
- [ ] `SITE_INDEXING=true` solo en Production y redespliegue hecho
- [ ] `https://<dominio>/robots.txt` permite el rastreo y enlaza al sitemap
- [ ] `https://<dominio>/sitemap.xml` lista solo páginas publicables
- [ ] Las páginas no tienen `noindex` ni cabecera `X-Robots-Tag: noindex`; no aparece la franja "Vista previa"
- [ ] Una URL Preview de Vercel sigue mostrando `noindex`
- [ ] (Opcional) Dominio verificado en Google Search Console y sitemap enviado
- [ ] (Opcional) Datos estructurados comprobados con la prueba de resultados enriquecidos de Google

## 7. Build y despliegue
- [ ] `npm run check` sin errores en local
- [ ] El build de Vercel termina sin errores ni avisos nuevos
- [ ] Todas las rutas responden 200 en producción y una ruta inexistente muestra la página 404 en castellano
- [ ] Cabeceras de seguridad presentes (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Strict-Transport-Security`)

## 8. Sanity / Studio
- [ ] `npm run sanity:migrate` ejecutado al menos una vez contra el dataset de producción
- [ ] El dominio de producción y `http://localhost:3000` están en los orígenes CORS permitidos del proyecto (manage.sanity.io → API → CORS Origins), con credenciales permitidas
- [ ] `/studio` carga, pide iniciar sesión y solo los propietarios/editores tienen acceso
- [ ] Publicar un cambio de prueba en Studio lo refleja el sitio público en segundos, sin redesplegar
- [ ] Un documento en borrador (sin publicar) no aparece para un visitante normal, solo en modo borrador
- [ ] `SANITY_API_WRITE_TOKEN` no está configurado como variable de entorno en Vercel (solo se usa en local/CI para migrar)
- [ ] Ninguna clave de Sanity visible en el código fuente servido al navegador (inspecciona el HTML/JS de una página pública)
