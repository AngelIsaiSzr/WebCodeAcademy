import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

// Configuración del transportador de correo
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('Error: Las credenciales de correo no están configuradas correctamente');
  console.error('SMTP_USER:', process.env.SMTP_USER ? 'Configurado' : 'No configurado');
  console.error('SMTP_PASS:', process.env.SMTP_PASS ? 'Configurado' : 'No configurado');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verificar la conexión
transporter.verify(function (err: Error | null, success: true) {
  if (err) {
    console.error('Error al verificar el transportador de correo:', err);
    const error = err as Error & { code?: string };
    if (error.code === 'EAUTH') {
      console.error('Error de autenticación. Verifica que las credenciales SMTP_USER y SMTP_PASS estén configuradas correctamente en las variables de entorno.');
    }
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const mailOptions = {
      from: `"Web Code Academy" <${process.env.SMTP_USER || 'webcodeacademy0@gmail.com'}>`,
      to: data.to,
      replyTo: data.from,
      subject: data.subject,
      text: `
Nuevo mensaje de contacto:

Nombre: ${data.from}
Email: ${data.from}

Mensaje:
${data.text}
      `,
      html: data.html || `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${data.from}</p>
        <p><strong>Email:</strong> ${data.from}</p>
        <br>
        <p><strong>Mensaje:</strong></p>
        <p>${data.text.replace(/\n/g, '<br>')}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo electrónico');
  }
} 