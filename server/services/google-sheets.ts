import { google } from 'googleapis';
import { LiveCourseRegistration } from '@shared/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

// Leer las credenciales del archivo JSON
const credentials = JSON.parse(
  readFileSync(join(process.cwd(), 'credentials', 'webcodeacademy-8417c76450e7.json'), 'utf-8')
);

// Configuración de las credenciales
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Mapeo de cursos a IDs de hojas de cálculo
const COURSE_SHEET_IDS: Record<string, string> = {
  'primeros-pasos-en-python': '1CAbWH_GNSn82oWKnFKFy7PbiOpCPBeOKQpvs_amA_vc',
  // Agrega aquí más cursos y sus IDs de hojas
};

// Función para guardar un registro en la hoja de cálculo
export async function saveRegistrationToSheet(registration: LiveCourseRegistration, courseSlug: string) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = COURSE_SHEET_IDS[courseSlug];

    if (!sheetId) {
      throw new Error(`No se encontró una hoja de cálculo configurada para el curso: ${courseSlug}`);
    }

    // Preparar los datos para la hoja
    const values = [
      [
        registration.firstName,                    // [Nombre completo] Nombre
        registration.lastName,                     // [Nombre completo] Apellidos
        registration.email,                        // Correo electrónico
        registration.phoneNumber,                  // Número de teléfono
        registration.age.toString(),               // Edad
        registration.guardianFirstName || '',      // [Escribe el nombre de tu Madre, Padre o Tutor] Nombres
        registration.guardianLastName || '',       // [Escribe el nombre de tu Madre, Padre o Tutor] Apellidos
        registration.guardianPhoneNumber || '',    // Escribe el número de teléfono de tu Madre, Padre o Tutor
        registration.preferredModality,            // ¿Qué modalidad prefieres?
        registration.hasLaptop ? 'Sí' : 'No',     // ¿Cuentas con una computadora portátil? (Laptop)
        'Web Code Academy',                        // Submitter
        new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }), // Submission Date
        `WCA-${Date.now()}`                       // Submission ID (formato: WCA-timestamp)
      ]
    ];

    // Agregar los datos a la hoja
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:M', // Ajustado a 12 columnas
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error('Error al guardar en Google Sheets:', error);
    throw error;
  }
} 