import { Resend } from 'resend';

async function sendEmail() {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Announcement <announcement@soukyo-email.wengxiaoxiong.com>',
      to: ['shanghaiwxx@gmail.com'],
      subject: 'hello world',
      html: '<p>it works!</p><p>This is a test email.</p>',
    });
}

sendEmail();