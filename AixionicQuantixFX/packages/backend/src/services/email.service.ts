import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

interface EmailOptions {
  to: string
  subject: string
  template: string
  variables: Record<string, unknown>
}

function compileTemplate(templateName: string, variables: Record<string, unknown>): string {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`)
  if (fs.existsSync(templatePath)) {
    let html = fs.readFileSync(templatePath, 'utf-8')
    Object.entries(variables).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
    return html
  }
  return `<p>${JSON.stringify(variables)}</p>`
}

export async function sendEmail({ to, subject, template, variables }: EmailOptions): Promise<void> {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = compileTemplate(template, variables)

  await transport.sendMail({
    from: process.env.SROM_FROM || '"QuantixFX" <noreply@quantixfx.com>',
    to,
    subject,
    html,
  })
}