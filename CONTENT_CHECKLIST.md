# Información pendiente

Todo se edita en **Sanity Studio** (`/studio`), no en el código. Marca cada punto cuando esté
confirmado por la empresa (y, donde se indica, revisado por un profesional). Ejecuta
`npm run content:check:launch` para ver el estado real contra el contenido publicado.

Conocido hoy: nombre comercial **Oltenia**, ubicación **Zaragoza, España**, áreas de trabajo
**ventilación, climatización y aire acondicionado**. Nada más se ha publicado.

## ⚠️ Acción pendiente antes de desplegar: candidaturas con currículum
El formulario de candidatura ahora está embebido directamente en cada página de puesto
(`/puestos/[slug]`, justo después de la descripción — ya no hay una página `/solicitar` aparte).
El envío crea una «Candidatura» en Studio → **Candidaturas recibidas**, con el CV descargable,
nombre/apellidos, contacto, el puesto asociado automáticamente y si aceptó la política de
privacidad. Para que esto funcione en producción:
- [ ] **Configurar `SANITY_API_WRITE_TOKEN` en Vercel → Settings → Environment Variables
      (Production)**. Antes se mantenía fuera de Vercel a propósito (solo se usaba para migrar
      contenido desde tu máquina); ahora la ruta `/api/candidaturas` lo necesita en tiempo real
      para guardar cada candidatura. Sin esto, el formulario no funcionará en el sitio publicado
      aunque sí funcione en local.
- [ ] Considera crear un token de Sanity dedicado a esta ruta (no el mismo que usas para migrar
      contenido localmente), para poder revocarlo sin afectar tus scripts.
- [ ] Revisar periódicamente Studio → «Candidaturas recibidas» para no perder solicitudes.
- [ ] **Política de privacidad (`/privacidad`) todavía es un borrador sin revisar** (datos legales
      pendientes — ver sección más abajo). El formulario de candidatura ahora pide aceptarla antes
      de enviar un CV, pero el texto real no describe todavía que se recoge y almacena el CV, el
      nombre y el contacto del candidato en Sanity. Hay que completar y revisar esta página antes
      de que el formulario esté realmente conforme (no solo con la casilla, sino con el texto que
      el candidato está aceptando).

## Datos legales de la empresa — Studio → «Datos legales»
- [ ] Razón social
- [ ] NIF/CIF
- [ ] Domicilio social completo
- [ ] Datos del Registro Mercantil, si corresponde (si no aplica, el asesor indica el texto)
- [ ] Correo de contacto para el aviso legal

## Logo — Studio → «Marca y publicación»
- [ ] Archivo del logo (SVG o PNG, fondo transparente) y permiso de uso
- [ ] Colores corporativos, si existen (la paleta actual es provisional)

## Contacto para candidaturas — Studio → «Contacto» (pestaña «Candidaturas»)
- [x] Canal: correo electrónico (`olteniaconducciones@yahoo.es`) — formulario de candidaturas ya activo
- [ ] ¿Añadir también WhatsApp o teléfono específicos para candidaturas (aparte del general)?
- [ ] Persona que atenderá los mensajes
- [ ] Revisar el asunto/cuerpo prellenado del correo (`recruitmentEmailSubject`/`recruitmentEmailBody`)

## Contacto para clientes — Studio → «Contacto» (pestaña «Clientes»)
- [x] Teléfono: +34 625 352 933 (también usado como WhatsApp) — publicado en la tarjeta «Contacta
      directamente con nosotros» de «Trabaja con nosotros» y en «Contacto»
- [x] WhatsApp: mismo número
- [ ] Correo electrónico (el único correo configurado hoy es el de candidaturas,
      olteniaconducciones@yahoo.es; si se quiere uno distinto para consultas comerciales, indicarlo)
- [x] Dirección pública: C/ Antonio Sangenis, 62, 50010 Zaragoza
- [ ] Horario de atención

## Puestos — Studio → «Puestos»
Ya existen 4 puestos (Peón/Ayudante, Oficial de tercera, Oficial de segunda, Oficial de primera)
con funciones, requisitos imprescindibles/valorables y qué se puede aprender. Cada página de
puesto (`/puestos/[slug]`) ahora muestra las secciones A–J: descripción, responsabilidades,
requisitos, salario, horario, vacaciones/festivos, desplazamientos, contrato, aprendizaje y botón
de candidatura — las secciones E–H reutilizan el contenido de «Condiciones de trabajo» (mismo
origen para todos los puestos, nada duplicado a mano).
- [x] **Salario** (revisado 2026-11-04, banda más estrecha a petición de la empresa): Peón/Ayudante
      20.000–22.000 €; Oficial de tercera 22.000–24.000 €; Oficial de segunda 24.000–27.000 €;
      Oficial de primera 27.000–30.000 € (brutos/año), mostrado como «Salario bruto anual
      orientativo: X–Y €» en cada página de puesto. **Son bandas editoriales provisionales, no
      ofertas contractuales confirmadas.**
      ⚠️ **Discrepancia a revisar**: dos fuentes secundarias (no el texto oficial del BOPZ)
      situaban el salario mínimo de convenio para Peón en ~20.198–21.274 €/año — el suelo de
      20.000 € de esta banda podría quedar ligeramente por debajo de ese mínimo. Antes de tratar
      esta banda como oferta real, pedir a la gestoría/asesoría laboral que confirme la tabla
      salarial vigente del Convenio Colectivo de Industria, Tecnología y Servicios del Metal de
      Zaragoza y suba el suelo de Peón si hace falta.
- [ ] Carné de conducir (si aplica a algún puesto)
- [ ] Tipo de contrato por puesto (de momento cada página muestra solo el convenio aplicable, sin
      comprometerse a un tipo de contrato concreto, hasta que se confirme)
- [ ] Horario específico de cada puesto, si difiere del horario general (`vacancy.schedule`)
- [ ] Desplazamientos específicos de cada puesto, si difieren del general (`vacancy.travelExpectations`)
- [ ] Fecha de publicación y fecha de cierre, si se quiere dar fecha límite

## Presentación de la empresa — Studio → «Presentación de la empresa»
- [ ] Revisar el texto breve actual
- [ ] Historia (opcional)
- [ ] Equipo (opcional)
- [ ] Forma de trabajar (opcional)

## Equipo — Studio → «Equipo»
- [ ] Biografías revisadas y aprobadas por cada persona
- [ ] Fotos de perfil con permiso de uso

## Servicios — Studio → «Servicios»
- [ ] Revisar las descripciones de ventilación, climatización y aire acondicionado
- [ ] Actividades confirmadas por servicio: instalación, mantenimiento, reparación
- [ ] Tipos de trabajo: residencial, comercial, industrial (en «Presentación de la empresa»)
- [ ] Zona de trabajo
- [ ] Marcas con las que se trabaja (y permiso para nombrarlas)
- [ ] Certificaciones y habilitaciones (con documentación)

## Fotos — Studio → «Fotos»
- [ ] Fotos reales de trabajos, equipo y lugar de trabajo
- [ ] Permiso por escrito para publicar cada foto (personas, clientes, obras) — activa
      «Permiso de publicación» solo entonces
- [ ] Texto alternativo descriptivo para cada una

## Condiciones de trabajo — Studio → «Condiciones de trabajo»
Esta sección solo aparece en «Trabaja con nosotros» (ancla `#condiciones-de-trabajo`, enlazada
también desde cada página de puesto) si al menos un campo tiene contenido; cada campo vacío se
oculta, nunca se publica un «pendiente de confirmar» — lo que falta se lista aquí en su lugar.

**Categoría 1 — hechos legales ya verificados (Estatuto de los Trabajadores / Ley 31/1995),
válidos para cualquier empresa en España salvo mejora del convenio**: 30 días naturales de
vacaciones anuales (art. 38 ET), descanso semanal mínimo de día y medio (art. 37 ET), prevención
de riesgos laborales obligatoria (Ley 31/1995). Publicados como suelo legal, no como política
específica de Oltenia.

**Categoría 2 — confirmado por la empresa y publicado**: contratación formalizada y retribución
transparente, convenio aplicable (Convenio Colectivo de Industria, Tecnología y Servicios del
Metal de Zaragoza), jornada de 1.752 horas efectivas/año según ese convenio, vehículo de empresa
compartido entre el equipo (no asignado individualmente), desplazamientos contados como tiempo de
trabajo, horas extra voluntarias y compensadas, y la nota sobre la base como punto de encuentro.
No se publicó «40 horas/semana»: el convenio fija un cómputo ANUAL (1.752 h/año ≈ 33,7 h/semana de
media), no una cifra semanal fija; si la empresa reparte efectivamente 40h/semana en temporada
alta, se puede añadir como matiz.

**Categoría 3 — pendiente de confirmar con la empresa** (no inventado, por eso sigue oculto):
- [ ] **Días festivos exactos de este año** — el campo publicado remite al calendario laboral
      vigente en Zaragoza sin dar un número fijo, porque varía cada año (`holidaysStatement`)
- [ ] **Desplazamientos**: ¿qué trayectos concretos cuentan como tiempo de trabajo? (`travelJourneysNote`)
- [ ] **Destinos y frecuencia**: destinos habituales, frecuencia de desplazamiento y si hay pernoctas (`travelDestinationsNote`, `overnightStaysNote`)
- [ ] **Gastos cubiertos** en los desplazamientos: dietas, alojamiento, etc. (`expensesCoveredNote`)
- [ ] **Formación**: ¿qué cursos o aprendizaje práctico se ofrece realmente? (`trainingStatement`)
- [ ] **Tipo de contrato** ofrecido realmente (indefinido, temporal, fijo-discontinuo…) por puesto

## Puestos abiertos: ideas de desarrollo futuro (no construir todavía)
- [ ] Valorar con el equipo (antes de programar nada) una checklist privada de habilidades,
      formación completada y feedback periódico — sin rankings ni puntuaciones entre compañeros

## Historias de proyecto — Studio → «Fotos»
Posibles historias para «En detalle» o futuras páginas de proyecto, pendientes de confirmar con
la empresa antes de publicar (no inventar datos de los proyectos):
- [ ] Conductos exteriores alrededor de un edificio existente (adaptación del recorrido): tipo de
      edificio, necesidad, alcance de Oltenia, principal dificultad, tareas del equipo
- [ ] Conductos textiles en una nave (distribución de aire): mismos datos
- [ ] Equipo de climatización y conductos en altura (conexión del equipo a la instalación): mismos datos
- [ ] No combinar fotos en un mismo «proyecto» sin que la empresa confirme que pertenecen al mismo trabajo
- [x] Alt de `equipos-climatizacion-02.jpg` en «Qué hacemos»: se quitó la afirmación técnica sin
      confirmar («con varios módulos de filtrado» — no se puede verificar desde la foto si el
      equipo tiene varios módulos de filtración diferenciados o es un único equipo compacto; lo
      correcto sería que alguien con conocimiento técnico del equipo lo confirme antes de volver a
      afirmarlo). El alt ahora describe solo lo verificable: tipo de equipo y ubicación.
- [ ] **Pendiente, no tocado a propósito**: la explicación en «En detalle» sobre la junta flexible
      («pensado para absorber pequeños desajustes de montaje») sigue sin confirmar — mismo tipo de
      afirmación técnica no verificable solo con la foto.

## Revisión legal y de privacidad — Studio → «Datos legales»
- [ ] Condiciones de uso
- [ ] Propiedad intelectual
- [ ] Legislación aplicable y jurisdicción
- [ ] Responsable del tratamiento
- [ ] Finalidades
- [ ] Bases legales
- [ ] Plazos de conservación
- [ ] Destinatarios y encargados: alojamiento, correo, etc.
- [ ] Dirección para ejercer derechos
- [ ] Revisión profesional de ambos textos (marca «Revisado por un asesor cualificado»)

## Dominio de producción
- [ ] Dominio comprado y conectado en Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` configurada en Production

## Aprobación final — Studio → «Marca y publicación»
- [ ] Los propietarios han revisado todo el contenido («Contenido aprobado para publicar»,
      «Aprobado por», «Fecha de aprobación»)
