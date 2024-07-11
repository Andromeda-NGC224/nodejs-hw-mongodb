import nodemailer from 'nodemailer'
import 'dotenv/config'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env

const nodemailerConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
}
console.log()

const transport = nodemailer.createTransport(nodemailerConfig)

export const sendEmail = async (data) => {
  try {
    const email = { ...data, from: SMTP_FROM }
    return await transport.sendMail(email)
  } catch (error) {
    throw new Error(error)
  }
}
