import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'webcodeacademy0@gmail.com',
    pass: process.env.SMTP_PASS, // Contraseña de aplicación de Google
  },
});

// Verificar la conexión
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error al verificar el transportador de correo:', error);
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