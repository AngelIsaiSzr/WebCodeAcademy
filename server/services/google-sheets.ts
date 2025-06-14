import { google } from 'googleapis';
import { LiveCourseRegistration } from '@shared/schema';

// Configuración de las credenciales usando variables de entorno
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
      range: 'A:M', // Ajustado a 13 columnas
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