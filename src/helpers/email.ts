import sendgrid, { MailDataRequired } from '@sendgrid/mail'

export const sendEmail = async (message: MailDataRequired) => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

    return await sendgrid.send(message)
}