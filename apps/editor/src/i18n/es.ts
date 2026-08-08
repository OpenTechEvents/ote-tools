/**
 * Spanish translations. Flat, dotted keys mirror the StateKey/SectionId
 * identifiers already used for state binding elsewhere in the editor, so
 * there's no second id system to keep in sync. Any key missing here falls
 * back to the English string already hardcoded in form.ts/main.ts/index.html
 * — a partial translation is never broken, just partially English.
 *
 * Namespaces: app.* / nav.* / dialog.* / action.* / badge.* /
 * importBanner.* / warning.* / fallback.* / footer.* — static shell and
 * main.ts-driven text. section.* — section nav/headers. field.<id>.* —
 * a FIELD_SPECS or REPEATER_SPECS group's own label/note/info/addLabel.
 * control.<StateKey>.* — one sub-control's own label/info/placeholder
 * inside a multi-control field (kept in its own namespace so it can never
 * collide with a field.<id>.* key, since a control's key can equal its
 * own field's id — see startDate/endDate). field.<repeaterKey>.<itemKey>.*
 * — one repeater sub-field's label/info/placeholder. ui.* — everything
 * else (chip/repeater chrome, translations UI, instant picker preview).
 */
export const es: Record<string, string> = {
  // --- app shell -----------------------------------------------------------
  "app.title": "Editor de eventos OTE",
  "app.language": "Idioma",
  "app.targetRepository": "Repositorio de destino: {repo}",
  "app.standaloneGenerator": "Generador de JSON independiente",

  // --- top nav ---------------------------------------------------------------
  "nav.newEvent": "+ Nuevo evento",
  "nav.blankEvent": "Evento en blanco",
  "nav.importFromEventPage": "Importar desde página del evento",
  "nav.importIcs": "Importar .ics",
  "nav.connectFeed": "Conectar un feed",
  "nav.feedSettings": "⚙ Configuración del feed",
  "nav.profile": "Perfil",
  "nav.comboLoading": "Cargando eventos…",
  "nav.comboFilter": "Escribe para filtrar, o elige un evento…",
  "nav.comboEmpty": "No se encontraron eventos en este repositorio",
  "nav.sectionsMenu": "☰ Secciones",
  "nav.eventsSearchLabel": "Buscar eventos",
  "nav.backToEvents": "← Volver a eventos",

  // --- dialogs -----------------------------------------------------------
  "dialog.repoConnect.title": "Conectar un feed",
  "dialog.repoConnect.inputLabel": "Tu repositorio de GitHub (owner/repo)",
  "dialog.repoConnect.error":
    "Escribe tu repositorio como owner/repo — por ejemplo my-org/ote-events.",
  "dialog.repoConnect.recentLabel": "Conectados recientemente",
  "dialog.repoConnect.adoptersLabel": "Comunidades que ya usan OTE",
  "dialog.feedSettings.title": "Configuración del feed",
  "dialog.feedSettings.hint":
    "Edita ote.config.json — los metadatos propios del feed, y (abajo) qué campos muestra el editor por defecto en este repositorio.",
  "dialog.feedSettings.aboutGroup": "Sobre este feed",
  "dialog.feedSettings.defaultsGroup": "Valores por defecto para tus eventos",
  "dialog.feedSettings.defaultsGroupNote":
    "Todo evento hereda estos valores salvo que declare el suyo propio — y si lo declara, lo sustituye por completo, nunca se combina con lo que hay aquí.",
  "dialog.feedSettings.titleLabel": "Título",
  "dialog.feedSettings.descriptionLabel": "Descripción",
  "dialog.feedSettings.urlLabel": "URL",
  "dialog.feedSettings.licenseLabel": "Licencia",
  "dialog.feedSettings.licenseUrlLabel": "URL de la licencia",
  "dialog.feedSettings.textLanguageLabel": "Idioma del texto",
  "dialog.feedSettings.titleInfo":
    "Se muestra como el nombre de tu feed allá donde aparezca listado o incrustado.",
  "dialog.feedSettings.descriptionInfo": "Un resumen breve de qué cubre este feed.",
  "dialog.feedSettings.urlInfo":
    "La web de tu comunidad o la página principal del feed — no los propios ficheros de events/.",
  "dialog.feedSettings.licenseInfo":
    "Licencia de los DATOS de tus eventos (no de los eventos en sí). CC0-1.0 (dominio público) o CC-BY-4.0 (requiere atribución) son opciones habituales; vale cualquier identificador SPDX o URL.",
  "dialog.feedSettings.licenseUrlInfo":
    "Enlace al texto completo de la licencia, si la licencia en sí necesita explicación.",
  "dialog.feedSettings.textLanguageInfo":
    "El idioma en el que están escritos el título/descripción de tu feed (y el nombre/descripción de tus eventos). Solo hace falta si usas traducciones.",
  "dialog.feedSettings.organizersInfo":
    "Quién organiza tu comunidad, por defecto. Cada evento hereda esta lista salvo que declare sus propios organizadores, que entonces la REEMPLAZAN, no se combinan con ella.",
  "dialog.feedSettings.organizersNote":
    "El título/URL de arriba dicen quién publica este feed; organizers, quién organiza los eventos que contiene. Si este feed solo publica tus propios eventos, probablemente coincidan. Solo son distintos si agregas eventos de otras comunidades — en ese caso, deja este campo vacío (ver aviso abajo).",
  "dialog.feedSettings.organizersQuickFill": "Usar los mismos datos que arriba",
  "dialog.feedSettings.organizersAggregatorWarning":
    "Aviso: los eventos de este feed declaran organizadores bastante distintos entre sí. Si este feed agrega eventos de otras comunidades, deja este campo vacío — la spec lo exige: rellenarlo atribuiría cada evento agregado a quien lleva este feed, no a quien realmente lo organiza.",
  "dialog.feedSettings.editorGroup": "Configuración del editor",
  "dialog.feedSettings.editorGroupNote":
    "Qué campos muestra el editor por defecto cuando alguien abre este feed para añadir o editar un evento. Añade perfiles personalizados con nombre para elegir tus propios conjuntos de campos — reutiliza el nombre de uno predefinido (meetup, conference, all) para sobrescribirlo.",
  "dialog.feedSettings.customProfilesNote":
    "Nombre, fechas, y el slug/id propios del fichero se incluyen siempre en cada perfil personalizado, por eso no aparecen abajo.",
  "dialog.feedSettings.customProfileNamePlaceholder": "Nombre del perfil",
  "dialog.feedSettings.customProfileGroupLabel": "Perfil personalizado",
  "dialog.review.title": "Revisar y enviar",
  "dialog.review.hintRepo":
    "Esto abre un issue de GitHub prerrellenado en el repositorio de destino; una persona mantenedora (o la automatización del repositorio) lo convierte en un pull request.",
  "dialog.review.hintStandalone":
    "No se envía nada a ningún sitio — copia el JSON o descárgalo como archivo.",
  "dialog.delete.title": "Eliminar evento",
  "dialog.delete.hint":
    "Esta app nunca elimina nada por sí misma — ambas opciones abren la propia página de GitHub para ello.",
  "dialog.ics.title": "Importar desde iCalendar (.ics)",
  "dialog.ics.hint1":
    "Sube el archivo, o descárgalo desde una URL. Podrás elegir qué eventos importar; no se importa nada sin confirmación.",
  "dialog.ics.fileLabel": "Archivo iCalendar",
  "dialog.ics.urlLabel": "URL de iCalendar",
  "dialog.ics.recurringHint":
    '{n} de los eventos detectados son series recurrentes — solo se lista su ocurrencia actual, las fechas futuras no aparecen. Importa una y luego usa "Repetir como serie" para generar las próximas ocurrencias.',
  "dialog.jsonld.title": "Importar desde la página de un evento",
  "dialog.jsonld.hint1":
    "Pega la URL de la página del evento (Meetup, Eventbrite, Luma…). Los eventos se leen de los datos estructurados (schema.org JSON-LD) que la página ya expone — normalmente más completos que una exportación .ics. Podrás elegir qué eventos importar; no se importa nada sin confirmación.",
  "dialog.jsonld.urlLabel": "URL de la página del evento",
  "dialog.jsonld.htmlPlaceholder": "Pega aquí el código HTML de la página…",
  "dialog.jsonld.htmlLabel": "HTML de la página del evento",
  "dialog.jsonld.readPasted": "Leer el HTML pegado",
  "dialog.recurrence.title": "Repetir como serie",
  "dialog.recurrence.hint1":
    "Usa todo lo ya rellenado en el formulario como plantilla compartida para cada ocurrencia — solo cambian la fecha/hora/nombre de cada fila de recurrencia.",
  "dialog.recurrence.empty": "No se ha generado ninguna ocurrencia — revisa las filas de recurrencia de arriba.",
  "dialog.recurrence.cappedWarning":
    "Recurrencia #{n}: limitada a {max} ocurrencias — vuelve a generar más adelante para continuar la serie.",

  // --- recurrence: inline row list in "Cuándo" ----------------------------
  "dialog.recurrenceRow.label": "Se repite",
  "dialog.recurrenceRow.addLabel": "+ Añadir recurrencia",
  "dialog.recurrenceRow.name": "Nombre (opcional)",
  "dialog.recurrenceRow.date": "Fecha de inicio",
  "dialog.recurrenceRow.startTime": "Hora",
  "dialog.recurrenceRow.endTime": "Hora de fin",
  "dialog.recurrenceRow.endDate": "Fecha de fin",
  "dialog.recurrenceRow.frequency": "Se repite",
  "dialog.recurrenceRow.daily": "Diariamente",
  "dialog.recurrenceRow.weeklyOn": "Semanalmente el {weekday}",
  "dialog.recurrenceRow.monthlyOn": "Mensualmente el {ordinal} {weekday}",
  "dialog.recurrenceRow.yearlyOn": "Anualmente el {date}",
  "dialog.recurrenceRow.everyWeekday": "Cada día laborable (de lunes a viernes)",
  "dialog.recurrenceRow.custom": "Personalizado…",
  "dialog.recurrenceRow.last": "último",
  "dialog.recurrenceRow.ordinalWord.1": "primer",
  "dialog.recurrenceRow.ordinalWord.2": "segundo",
  "dialog.recurrenceRow.ordinalWord.3": "tercer",
  "dialog.recurrenceRow.ordinalWord.4": "cuarto",
  "dialog.recurrenceRow.generateHint":
    "Revisar y enviar / Revisar y descargar, más abajo, generará todas las ocurrencias para revisarlas en cuanto añadas al menos una recurrencia.",

  // --- recurrence: computed "Custom…" summary (e.g. "Cada 2 meses el
  // primer viernes, 5 veces") — shown as the row's selected option once
  // customized, matching Google Calendar's own dropdown behavior. ------
  "dialog.recurrenceRow.custom.daily": "Cada día",
  "dialog.recurrenceRow.custom.dailyN": "Cada {n} días",
  "dialog.recurrenceRow.custom.weekly": "Cada semana el {days}",
  "dialog.recurrenceRow.custom.weeklyN": "Cada {n} semanas el {days}",
  "dialog.recurrenceRow.custom.monthly": "Cada mes el {ordinal} {weekday}",
  "dialog.recurrenceRow.custom.monthlyN": "Cada {n} meses el {ordinal} {weekday}",
  "dialog.recurrenceRow.custom.yearly": "Cada año el {date}",
  "dialog.recurrenceRow.custom.yearlyN": "Cada {n} años el {date}",
  "dialog.recurrenceRow.custom.untilDate": ", hasta el {date}",
  "dialog.recurrenceRow.custom.untilCount": ", {count} veces",

  // --- recurrence: "Custom recurrence" dialog -----------------------------
  "dialog.recurrenceCustom.title": "Recurrencia personalizada",
  "dialog.recurrenceCustom.repeatEvery": "Repetir cada",
  "dialog.recurrenceCustom.unit.day": "día",
  "dialog.recurrenceCustom.unit.week": "semana",
  "dialog.recurrenceCustom.unit.month": "mes",
  "dialog.recurrenceCustom.unit.year": "año",
  "dialog.recurrenceCustom.repeatOn": "Repetir en",
  "dialog.recurrenceCustom.weekdayShort.mon": "L",
  "dialog.recurrenceCustom.weekdayShort.tue": "M",
  "dialog.recurrenceCustom.weekdayShort.wed": "X",
  "dialog.recurrenceCustom.weekdayShort.thu": "J",
  "dialog.recurrenceCustom.weekdayShort.fri": "V",
  "dialog.recurrenceCustom.weekdayShort.sat": "S",
  "dialog.recurrenceCustom.weekdayShort.sun": "D",
  "dialog.recurrenceCustom.weekdayFull.mon": "Lunes",
  "dialog.recurrenceCustom.weekdayFull.tue": "Martes",
  "dialog.recurrenceCustom.weekdayFull.wed": "Miércoles",
  "dialog.recurrenceCustom.weekdayFull.thu": "Jueves",
  "dialog.recurrenceCustom.weekdayFull.fri": "Viernes",
  "dialog.recurrenceCustom.weekdayFull.sat": "Sábado",
  "dialog.recurrenceCustom.weekdayFull.sun": "Domingo",
  "dialog.recurrenceCustom.ordinal": "Cuál",
  "dialog.recurrenceCustom.ordinal.1": "1º",
  "dialog.recurrenceCustom.ordinal.2": "2º",
  "dialog.recurrenceCustom.ordinal.3": "3º",
  "dialog.recurrenceCustom.ordinal.4": "4º",
  "dialog.recurrenceCustom.ordinal.last": "Último",
  "dialog.recurrenceCustom.weekdaySelect": "Día de la semana",
  "dialog.recurrenceCustom.ends": "Termina",
  "dialog.recurrenceCustom.on": "El",
  "dialog.recurrenceCustom.after": "Después de",
  "dialog.recurrenceCustom.occurrences": "ocurrencia(s)",
  "dialog.recurrenceCustom.capHint":
    "Cada recurrencia genera como máximo 24 ocurrencias, elijas la fecha o el número que elijas — vuelve a generar más adelante para continuar una serie más larga.",

  // --- actions -----------------------------------------------------------
  "action.connect": "Conectar",
  "action.visit": "Visitar",
  "action.cancel": "Cancelar",
  "action.back": "Atrás",
  "action.copyJson": "Copiar JSON",
  "action.downloadJson": "Descargar .json",
  "action.openIssue": "Abrir issue de GitHub",
  "action.openOnGithub": "Abrir en GitHub",
  "action.addCustomProfile": "+ Añadir perfil personalizado",
  "action.editDirectly": "Editar directamente",
  "action.reviewAndSubmit": "Revisar y enviar",
  "action.reviewAndDownload": "Revisar y descargar",
  "action.fetch": "Obtener",
  "action.importSelected": "Importar seleccionados",
  "action.addSelected": "Añadir seleccionados",
  "action.submitBatch": "Enviar todo en un issue",
  "action.done": "Listo",
  "action.copy": "Copiar",
  "action.reset": "Reiniciar",
  "action.revertChanges": "Descartar cambios",
  "action.editDirectlyUnavailable":
    "No se pudo determinar el nombre de archivo de este evento a partir del feed.",
  "action.edit": "Editar",
  "action.delete": "Eliminar",
  "action.deleteDirect": "Eliminar en GitHub",
  "action.deleteViaIssue": "Proponer eliminación",
  "action.refreshEvents": "↻ Actualizar",

  // --- valid badge -----------------------------------------------------------
  "badge.ready": "✓ Listo",
  "badge.incomplete": "Incompleto — ir al primer error",

  // --- import banner -----------------------------------------------------------
  "importBanner.issueOpened":
    "Issue abierto. El evento aparecerá en el feed publicado en cuanto las personas mantenedoras del repositorio acepten el PR (y Pages se reconstruya).",
  "importBanner.checkFeed": "Comprobar el feed",
  "importBanner.previous": "← Anterior",
  "importBanner.next": "Siguiente →",
  "importBanner.discard": "Descartar este evento",
  "importBanner.dismissAll": "Descartar todos",
  "importBanner.checking": "Comprobando…",
  "importBanner.checkFailed":
    "No se pudo obtener el feed publicado (puede que el sitio de Pages aún no esté activo).",
  "importBanner.checkFound": "✓ El evento está en el feed publicado.",
  "importBanner.checkNotFound":
    "Todavía no está — aparecerá en cuanto se acepte el PR y Pages se reconstruya.",
  "importBanner.position": "Importado {n} de {total}: {label}",
  "importBanner.suffixSubmitted": " — issue abierto ✓",
  "importBanner.suffixPending": " — revisa los campos marcados antes de enviar.",

  // --- warnings -----------------------------------------------------------
  "warning.configNotFetched":
    "No se pudo obtener ote.config.json del repositorio; mostrando todos los campos.",
  "warning.feedFallback":
    "Lista de eventos cargada desde el feed publicado (API de GitHub no disponible); los nombres de archivo se infieren de los ids de evento.",

  // --- fallback (URL too long) ---------------------------------------------
  "fallback.title": "URL demasiado larga — copiar manualmente",
  "fallback.hint":
    "La URL prerrellenada supera lo que aceptan los navegadores. Copia el contenido de abajo y pégalo en la página que se abre:",
  "fallback.openBlank": "Abrir página en blanco",

  // --- footer -----------------------------------------------------------
  "footer.foundBug": "🐛 ¿Encontraste un error?",

  // --- section titles -----------------------------------------------------------
  "section.what": "Qué",
  "section.when": "Cuándo",
  "section.where": "Dónde",
  "section.who": "Quién",
  "section.tickets": "Entradas",
  "section.cfp": "C4P",
  "section.translations": "Traducciones",
  "section.metadata": "Metadatos",

  // --- field: name -----------------------------------------------------------
  "field.name.label": "Nombre",
  "field.name.info":
    "Nombre corto para mostrar. Es el único campo que todos los formatos de exportación (ICS, RSS, schema.org) imprimen en algún sitio, así que debe leerse bien por sí solo — sin depender de la fecha o el lugar para dar contexto.",

  // --- field: description -----------------------------------------------------------
  "field.description.label": "Descripción",
  "field.description.note": "Texto plano o Markdown.",
  "field.description.info":
    "Un resumen más largo que el nombre — qué es realmente el evento, para alguien que nunca ha oído hablar de él. La mayoría de consumidores renderizan Markdown; el resto simplemente muestra el texto sin formato.",

  // --- field: url -----------------------------------------------------------
  "field.url.label": "URL de la página del evento",
  "field.url.info":
    "La página que describe este evento hoy. A diferencia del Event id, esta puede cambiar si el evento se traslada de plataforma — déjala vacía si aún no hay una página dedicada.",

  // --- field: tags -----------------------------------------------------------
  "field.tags.label": "Etiquetas",
  "field.tags.note":
    "Empieza a escribir para buscar temas y audiencias; Intro añade cualquier etiqueta que escribas.",
  "field.tags.info":
    "Etiquetas libres de tema y audiencia. Las sugerencias vienen del directorio de comunidades de ComBuildersES, pero se acepta cualquier etiqueta — elegir una sugerencia solo mantiene la redacción consistente.",
  "control.tags.placeholder": "Escribe para añadir… (python, junior…)",

  // --- field: languages -----------------------------------------------------------
  "field.languages.label": "Idiomas",
  "field.languages.info":
    "Idiomas en los que se celebra el evento, como etiquetas BCP 47. Déjalo vacío si no se sabe.",
  "control.languages.placeholder": "Escribe para añadir… (es, en…)",

  // --- field: allDay -----------------------------------------------------------
  "field.allDay.label": "Evento de todo el día",
  "field.allDay.info":
    "No es un campo OTE en sí — decide si Inicio/Fin de abajo se serializan como una fecha (\"2026-10-15\") o una fecha-hora (\"2026-10-15T09:00\"). Actívalo antes de rellenar las horas; cambia lo que significan los campos de Hora.",

  // --- field: startDate/endDate -----------------------------------------------------------
  "field.startDate.label": "Inicio",
  "field.startDate.info":
    "Hora de reloj de pared, no un instante fijo — aquí no hay desfase UTC, para eso está Zona horaria (abajo). Los eventos de todo el día solo usan la fecha; los eventos con hora también necesitan una hora.",
  "field.endDate.label": "Fin",
  "field.endDate.info":
    "Debe tener el mismo formato que Inicio (ambas solo fecha, o ambas fecha y hora) y no puede ser anterior. Déjalo vacío cuando el evento no tenga un final definido.",
  "control.startDate.label": "Fecha",
  "control.startTime.label": "Hora",
  "control.endDate.label": "Fecha",
  "control.endTime.label": "Hora",

  // --- field: startDate+endDate merged into one line ---------------------
  "field.startEnd.label": "Inicio y fin",
  "field.startEnd.info":
    "Horas de reloj de pared, no instantes fijos — Zona horaria (abajo) aporta el desfase. Los eventos de todo el día solo usan la fecha; los eventos con hora también necesitan una hora. El fin debe tener el mismo formato que el inicio (ambas solo fecha, o ambas fecha y hora) y no puede ser anterior — déjalo vacío cuando el evento no tenga un final definido.",
  "ui.to": "a",

  // --- field: timezone -----------------------------------------------------------
  "field.timezone.label": "Zona horaria",
  "field.timezone.info":
    "Zona horaria IANA a la que pertenecen las horas de reloj de pared del evento. Por defecto, la de tu navegador.",
  "control.timezone.placeholder": "Escribe para buscar… (Europe/Madrid)",

  // --- field: status -----------------------------------------------------------
  "field.status.label": "Estado",
  "field.status.note": "Los eventos cancelados o pospuestos deben permanecer publicados.",
  "field.status.info":
    "Qué le pasó al EVENTO, no a los datos — cancelarlo aquí no borra el archivo, lo marca para que quienes lo siguen vean la cancelación en lugar de que la entrada simplemente desaparezca. \"tentative\" es para algo anunciado pero aún no confirmado. Por defecto es \"scheduled\" si se deja sin establecer.",

  // --- field: attendanceMode -----------------------------------------------------------
  "field.attendanceMode.label": "Modalidad de asistencia",
  "field.attendanceMode.note":
    "Déjalo vacío si no se sabe — nunca se asume presencial por defecto.",
  "field.attendanceMode.info":
    "Lo que el organizador dice que es el evento — presencial, online, o ambos. Ausente es una respuesta real (desconocido), nunca se asume presencial en silencio.",

  // --- field: venue -----------------------------------------------------------
  "field.venue.label": "Lugar",
  "field.venue.note":
    "Lugar legible por personas: nombre y dirección. El mapa de abajo lo usa para encontrar la posición exacta.",
  "field.venue.info":
    "Una línea de texto libre — el nombre del lugar más la dirección que haga falta para llegar. No es redundante con las coordenadas de abajo: esto es lo que lee una persona, el pin es lo que dibuja un mapa.",

  // --- field: onlineUrl -----------------------------------------------------------
  "field.onlineUrl.label": "URL online",
  "field.onlineUrl.info":
    "Dónde unirse realmente en línea. Su presencia es lo que indica a un consumidor que este evento tiene acceso online — independientemente de la Modalidad de asistencia de arriba.",

  // --- field: geo -----------------------------------------------------------
  "field.geo.label": "Posición en el mapa",
  "field.geo.note": "Busca, haz clic en el mapa o arrastra el pin — o escribe grados decimales WGS-84.",
  "field.geo.info":
    "Posición exacta opcional del lugar. Los consumidores la usan para mapas y filtros de distancia; el texto del lugar de arriba sigue siendo la dirección legible por personas.",
  "control.geoLat.label": "Latitud",
  "control.geoLon.label": "Longitud",

  // --- field: slug/id -----------------------------------------------------------
  "field.slug.label": "Slug del archivo",
  "field.slug.note": "El evento se guarda como events/<slug>.json.",
  "field.slug.info":
    "Sugerido automáticamente a partir del nombre y la fecha; edítalo libremente antes de publicar. Debe ser único en el repositorio — el editor lo comprueba contra los eventos existentes.",
  "field.id.label": "Id del evento",
  "field.id.note": "URI estable, generada una vez y nunca reescrita.",
  "field.id.info":
    "Sugerida automáticamente como <url del feed>/events/<slug>, que es única mientras lo sea el slug. Los consumidores la usan para actualizar eventos en lugar de duplicarlos, así que no la cambies nunca después de publicar. El editor la comprueba contra los eventos existentes del repositorio; la validación del fork la vuelve a comprobar en cada cambio.",

  // --- field: license -----------------------------------------------------------
  "field.license.label": "Licencia de los datos",
  "field.license.note":
    "Normalmente se deja vacío: el evento hereda la licencia del feed. Las sugerencias son licencias de datos abiertas y no víricas (ids SPDX).",
  "field.license.info":
    "Da licencia a ESTOS DATOS (el JSON), no al evento en sí. Casi siempre se deja vacío — el evento entonces hereda lo que declare el feed en su conjunto.",

  // --- field: textLanguage -----------------------------------------------------------
  "field.textLanguage.label": "Idioma del texto",
  "field.textLanguage.info":
    "Etiqueta BCP 47 del idioma en que están escritos el nombre/descripción propios de este evento. Déjalo vacío si no se sabe.",

  // --- field: eligibility -----------------------------------------------------------
  "field.eligibility.label": "Elegibilidad",
  "field.eligibility.note": "Quién puede asistir, cuando no está simplemente abierto a cualquiera.",
  "field.eligibility.info":
    "Responde a \"¿puedo ir?\" — independiente de Modalidad de asistencia y Dónde, que solo dicen si el evento es alcanzable. Ausente nunca significa abierto: déjalo sin establecer en lugar de adivinar.",
  "control.eligibilityType.label": "Tipo",
  "control.eligibilityType.info":
    "open no necesita nada más abajo; el resto de opciones deberían tener una Nota y/o URL explicando cómo cumplir los requisitos.",
  "control.eligibilityNote.label": "Nota",
  "control.eligibilityNote.info": "Explicación en texto plano de quién cumple los requisitos.",
  "control.eligibilityUrl.label": "URL",
  "control.eligibilityUrl.info": "Dónde leer los requisitos completos o solicitar acceso.",

  // --- field: cfp -----------------------------------------------------------
  "field.cfp.label": "Llamada a propuestas",
  "field.cfp.note": "Solo para eventos que aceptan propuestas de charlas o talleres.",
  "field.cfp.info":
    "El único campo de OTE sin equivalente en ICS, RSS o schema.org puro — existe porque \"qué conferencias siguen aceptando propuestas\" es una pregunta que hoy solo puede responder el organizador.",
  "control.cfpUrl.label": "URL",
  "control.cfpUrl.info": "Dónde envían las propuestas las personas ponentes.",
  "control.cfpOpensAt.label": "Se abre el",
  "control.cfpOpensAt.info": "Cuándo empiezan a aceptarse propuestas.",
  "control.cfpClosesAt.label": "Se cierra el",
  "control.cfpClosesAt.info":
    "Fecha límite de envío — después de esto, la URL del CFP debería dejar de aceptar nuevas propuestas.",
  "control.cfpCoversTravel.label": "Cubre desplazamiento",
  "control.cfpCoversTravel.info":
    "Si a las personas ponentes aceptadas se les cubren los gastos de desplazamiento.",
  "control.cfpCoversAccommodation.label": "Cubre alojamiento",
  "control.cfpCoversAccommodation.info":
    "Si a las personas ponentes aceptadas se les cubre el alojamiento.",

  // --- field: partOf -----------------------------------------------------------
  "field.partOf.label": "Parte de (serie)",
  "field.partOf.note": "Vincula esta ocurrencia a una serie recurrente o a un evento de varias partes.",
  "field.partOf.info":
    "Una referencia a la serie, no una regla de recurrencia — OTE no genera fechas. Un meetup mensual tiene un archivo de evento por mes, y cada uno apunta aquí al mismo id de serie.",
  "control.partOfId.label": "Id de la serie (URL)",
  "control.partOfId.info":
    "El id propio de la serie — el mismo valor repetido en cada ocurrencia, para que los consumidores puedan agruparlas.",
  "control.partOfName.label": "Nombre",
  "control.partOfName.info":
    "El nombre de la serie, p. ej. \"Rust Girona Meetup\" para la ocurrencia \"Rust Girona Meetup #12\" — no el nombre propio de esta ocurrencia.",
  "control.partOfUrl.label": "URL",
  "control.partOfUrl.info": "Una página que describe la serie en su conjunto, no esta ocurrencia concreta.",
  "control.partOfType.label": "Tipo",
  "control.partOfType.info":
    "series para un evento recurrente (un meetup mensual); multipart para un evento dividido en sesiones (un taller de varios días).",

  // --- field: source -----------------------------------------------------------
  "field.source.label": "Origen (procedencia)",
  "field.source.note": "Solo cuando el evento se importó de otro sitio.",
  "field.source.info":
    "De dónde vienen ESTOS DATOS — obligatorio cuando el evento se importó o agregó, se omite cuando el organizador describe su propio evento (ya es la fuente).",
  "control.sourceName.label": "Nombre",
  "control.sourceName.info":
    "De dónde se importaron estos datos — un nombre de plataforma (\"Meetup\") u organización.",
  "control.sourceUrl.label": "URL",
  "control.sourceUrl.info": "La página o feed exacto del que se leyeron los datos de este evento.",
  "control.sourceLicense.label": "Licencia",
  "control.sourceLicense.info":
    "La licencia bajo la que se publicaron los datos de ORIGEN, si se indica — no la licencia propia de este archivo (ver Licencia arriba).",

  // --- field: updatedAt -----------------------------------------------------------
  "field.updatedAt.label": "Actualizado el",
  "field.updatedAt.note":
    "Instante en que los datos del evento cambiaron por última vez (ISO-8601 con desfase).",
  "field.updatedAt.info":
    "No cuándo ocurre o se mueve el EVENTO (eso son cambios en Inicio/Fin) — cuándo cambiaron por última vez los DATOS de este archivo, para que un consumidor pueda sincronizar solo lo nuevo. Déjalo vacío en lugar de adivinar; ausente significa desconocido, no \"nunca cambió\".",

  // --- repeater: organizers -----------------------------------------------------------
  "field.organizers.label": "Organizadores",
  "field.organizers.addLabel": "+ Añadir organizador",
  "field.organizers.info":
    "Quién organiza el evento. Declarar esto SUSTITUYE la lista de organizadores propia del feed para este evento, no la amplía.",
  "field.organizers.name.label": "Nombre",
  "field.organizers.name.info":
    "Tal como lo reconocerían las personas asistentes — el nombre habitual del grupo o persona.",
  "field.organizers.url.label": "URL",
  "field.organizers.url.info": "Sitio web o perfil de este organizador. Déjalo vacío si no tiene.",
  "field.organizers.email.label": "Correo electrónico",
  "field.organizers.email.info": "Dirección de contacto de este organizador, solo si debe ser pública.",
  "field.organizers.type.label": "Tipo",
  "field.organizers.type.info":
    "Organización o persona individual — permite a los consumidores elegir el icono o etiqueta adecuados.",

  // --- repeater: image -----------------------------------------------------------
  "field.image.label": "Imágenes",
  "field.image.addLabel": "+ Añadir imagen",
  "field.image.note": "La primera imagen es la principal — cartel o portada.",
  "field.image.info":
    "El resto de la lista pueden ser otros recortes de la imagen principal, o imágenes totalmente distintas — un consumidor que solo pueda mostrar una siempre mostrará la primera. El texto alternativo describe lo que HAY en la imagen para quien no pueda verla, no el evento en sí.",
  "field.image.url.label": "URL",
  "field.image.alt.label": "Texto alternativo",

  // --- repeater: offers -----------------------------------------------------------
  "field.offers.label": "Entradas",
  "field.offers.addLabel": "+ Añadir entrada",
  "field.offers.info":
    "Una entrada por cada tipo de ticket — un evento gratuito es una única oferta con precio 0. Ausente significa desconocido, nunca gratis: el precio 0 es la única forma de decir \"gratis\".",
  "field.offers.name.label": "Nombre",
  "field.offers.name.info":
    "Cómo se llama este tipo de entrada — \"Entrada general\", \"Early bird\", \"Estudiante\"…",
  "field.offers.price.label": "Precio",
  "field.offers.price.info":
    "0 significa gratis. Déjalo vacío solo cuando el precio en sí se desconozca — eso no es lo mismo que gratis.",
  "field.offers.currency.label": "Moneda",
  "field.offers.currency.info": "Código ISO 4217 (EUR, USD…) — se espera junto a un precio distinto de cero.",
  "field.offers.url.label": "URL",
  "field.offers.url.info": "Dónde comprar o registrarse para este tipo de entrada concreto.",
  "field.offers.availability.label": "Disponibilidad",
  "field.offers.availability.info":
    "sold-out revela una URL de lista de espera abajo. Déjalo vacío si no se sabe.",
  "field.offers.waitlistUrl.label": "URL de lista de espera",
  "field.offers.waitlistUrl.info":
    "Dónde pueden apuntarse las personas interesadas a la lista de espera cuando se agote este tipo de entrada.",
  "field.offers.opensAt.label": "Se abre el",
  "field.offers.opensAt.info":
    "Cuándo empieza a estar disponible este tipo de entrada — no el inicio del propio evento.",
  "field.offers.closesAt.label": "Se cierra el",
  "field.offers.closesAt.info":
    "Cuándo deja de estar disponible este tipo de entrada (termina la venta) — no el final del propio evento.",

  // --- events list view -----------------------------------------------------------
  "ui.eventCard.noDate": "Sin fecha",
  "ui.eventStatus.cancelled": "Cancelado",
  "ui.eventStatus.tentative": "Provisional",
  "ui.eventStatus.postponed": "Pospuesto",
  "ui.eventStatus.rescheduled": "Reprogramado",
  "ui.eventStatus.moved-online": "Trasladado a online",

  // --- generic UI chrome -----------------------------------------------------------
  "ui.notSet": "(sin establecer)",
  "ui.remove": "Eliminar",
  "ui.chips.placeholder": "Escribe para añadir…",
  "ui.enterCoordinatesManually": "Introducir coordenadas manualmente",
  "ui.editSuggested": "Editar",
  "ui.close": "Cerrar",
  "ui.tags.explore": "Explorar etiquetas",
  "ui.tags.explorerTitle": "Explorar etiquetas",
  "ui.tags.suggestedForYou": "Sugeridas para ti",
  "ui.tags.recentlyUsed": "Usadas recientemente",
  "ui.tags.browseByCategory": "Explorar por categoría",
  "ui.tags.backToCategories": "Todas las categorías",
  "ui.tags.otherCategory": "Otras",
  "ui.tags.unavailable": "Las etiquetas no están disponibles ahora mismo.",
  "ui.image.viewFullSize": "Ver a tamaño completo",
  "ui.importGap": "No estaba en el ICS importado — rellénalo a mano si lo sabes.",
  "ui.instant.preview": "UTC: {iso} (introducido en {zone})",
  "ui.instant.yourDeviceTimezone": "la zona horaria de tu dispositivo",

  // --- translations UI -----------------------------------------------------------
  "ui.translations.addLanguage": "Añadir un idioma de traducción",
  "ui.translations.addLanguagePlaceholder": "Escribe un idioma para añadir… (es, en…)",
  "ui.translations.info":
    "Versiones opcionales del texto de este evento en otros idiomas. Añade un idioma y luego rellena los campos que quieras traducir — el resto puede quedarse en el idioma original.",
  "ui.translations.setLanguageFirst":
    "Primero establece un idioma del texto arriba — las traducciones describen en qué idioma está escrito el resto del evento.",
  "ui.feedTranslations.info":
    "Versiones opcionales del título y la descripción del feed en otros idiomas.",
  "ui.translations.removeLanguage": "Eliminar traducción al {lang}",
  "ui.translations.slot.name": "Nombre",
  "ui.translations.slot.description": "Descripción",
  "ui.translations.slot.imageAlt": "Alt de la imagen {n}",
  "ui.translations.slot.offerName": "Nombre de la entrada {n}",
  "ui.translations.slot.eligibilityNote": "Nota de elegibilidad",
  "ui.translations.slot.partOfName": "Nombre de la serie",
  "ui.translations.original": "Original",
  "ui.translations.empty":
    "Todavía no hay nada que traducir — primero rellena el nombre del evento (o cualquier imagen, entrada, nota de elegibilidad o nombre de serie que quieras traducir).",
};
