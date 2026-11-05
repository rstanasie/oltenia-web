import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/contact";
import { notifyNewApplication } from "@/lib/notifyApplication";
import { getWriteClient } from "@/sanity/lib/writeClient";

const MAX_CV_BYTES = 10 * 1024 * 1024;
const ALLOWED_CV_TYPES = ["application/pdf"];

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulario no válido." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots don't learn to avoid it.
  if (String(form.get("website") ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const firstName = String(form.get("firstName") ?? "").trim();
  const lastName = String(form.get("lastName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const vacancyTitle = String(form.get("vacancyTitle") ?? "").trim() || "Candidatura general";
  const vacancySlug = String(form.get("vacancySlug") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const privacyAccepted = form.get("privacyAccepted") === "true";
  const cv = form.get("cv");

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Faltan el nombre y los apellidos." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "El correo electrónico no es válido." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Falta el teléfono." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Cuéntanos algo sobre ti antes de enviar la candidatura." }, { status: 400 });
  }
  if (!privacyAccepted) {
    return NextResponse.json({ error: "Debes aceptar la política de privacidad." }, { status: 400 });
  }
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Falta adjuntar el currículum." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "El archivo del currículum pesa demasiado (máximo 10 MB)." }, { status: 400 });
  }
  if (!ALLOWED_CV_TYPES.includes(cv.type)) {
    return NextResponse.json({ error: "El currículum debe ser un archivo PDF." }, { status: 400 });
  }

  try {
    const client = getWriteClient();
    const buffer = Buffer.from(await cv.arrayBuffer());
    const asset = await client.assets.upload("file", buffer, { filename: cv.name, contentType: cv.type });

    await client.create({
      _type: "jobApplication",
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      vacancyTitle,
      vacancySlug: vacancySlug || undefined,
      message: message || undefined,
      cv: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
      privacyAccepted: true,
      submittedAt: new Date().toISOString(),
      reviewed: false,
    });

    // Best-effort: the candidature is already safely stored above, so a failed
    // notification email must never turn this into an error response.
    await notifyNewApplication({ firstName, lastName, email, phone, vacancyTitle, message, cvUrl: asset.url });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar la candidatura:", error);
    return NextResponse.json({ error: "No se pudo enviar la candidatura. Inténtalo de nuevo en unos minutos." }, { status: 500 });
  }
}
