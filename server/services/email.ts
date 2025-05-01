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
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const mailOptions = {
      from: `"Web Code Academy" <${process.env.SMTP_USER}>`,
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

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo electrónico');
  }
} 