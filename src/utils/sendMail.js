import nodemailer from 'nodemailer'
import 'dotenv/config'

const { UKR_NET_EMAIL, UKR_NET_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

const nodemailerConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT, // 25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
}

const transport = nodemailer.createTransport(nodemailerConfig)

export const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL }
  return transport.sendMail(email)
}
