const RESEND_API_URL = "https://api.resend.com/emails";

type ApplicationNotification = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vacancyTitle: string;
  message: string;
  cvUrl: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);
}

/**
 * Sends a notification email via Resend's HTTP API when a new candidature arrives.
 * Uses plain fetch (no SDK dependency). Silently does nothing if RESEND_API_KEY,
 * CANDIDATURE_NOTIFICATION_EMAIL or CANDIDATURE_NOTIFICATION_FROM aren't configured,
 * and never throws — a failed notification must not block the candidate's submission,
 * since the candidature is already safely stored in Sanity regardless.
 */
export async function notifyNewApplication(data: ApplicationNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CANDIDATURE_NOTIFICATION_EMAIL;
  const from = process.env.CANDIDATURE_NOTIFICATION_FROM;

  if (!apiKey || !to || !from) {
    console.warn(
      "notifyNewApplication: falta RESEND_API_KEY, CANDIDATURE_NOTIFICATION_EMAIL o CANDIDATURE_NOTIFICATION_FROM — no se envió el aviso por correo (la candidatura sí se guardó en Sanity).",
    );
    return;
  }

  const subject = `Nueva candidatura: ${data.firstName} ${data.lastName} — ${data.vacancyTitle}`;
  const html = `
    <p>Nueva candidatura recibida en la web.</p>
    <ul>
      <li><strong>Nombre:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</li>
      <li><strong>Correo:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Puesto:</strong> ${escapeHtml(data.vacancyTitle)}</li>
    </ul>
    <p><strong>Mensaje:</strong><br>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    <p><a href="${data.cvUrl}">Descargar el currículum (PDF)</a></p>
  `;

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: data.email, subject, html }),
    });
    if (!res.ok) {
      console.error("notifyNewApplication: Resend respondió con error", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("notifyNewApplication: fallo al llamar a Resend", error);
  }
}
