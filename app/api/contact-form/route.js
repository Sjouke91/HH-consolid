// import { validateRecaptcha } from '@direct-impact/difj-core';
import getConfig from 'next/config';
import validateRecaptcha from 'utils/validateRecaptcha';
const sendGridMail = require('@sendgrid/mail');

/*
Contact form confirmation email: d-772518de238446b79435c1cd27704bf6
Contact form internal email: d-96ae785bc851426cbe0befcb4b5e2f10

JSON data object:
{
      "OptInPrivacy": "true",
    "firstName": "Sjouke",
      "lastName": "Bosma",
    "organization": "Direct Impact",
    "email": "s.bosma1991@gmail.com",
    "phone": "0654993725",
   "message": "Hallo"
    }

      "OptInPrivacy": "true",
    "firstName": "Sjouke",
        "lastName": "Bosma",
    "organization": "Direct Impact",
    "email": "s.bosma1991@gmail.com",
    "phone": "0654993725",
   "message": "Hallo"
*/

export async function POST(request) {
  const data = await request.json();

  const contactConfirmationInternal = {
    to: data.formDestinationEmail
      ? data.formDestinationEmail
      : 'info@fixedtoday.nl',
    from: 'info@fixedtoday.nl',
    subject: 'Contact request',
    template_id: 'd-96ae785bc851426cbe0befcb4b5e2f10',
    dynamic_template_data: {
      firstName: data.form.firstName,
      lastName: data.form.lastName,
      email: data.form.email,
      organization: data.form.company,
      phone: data.form.phone,
      message: data.form.message,
      OptInPrivacy: data.form.privacy,
      emailSubject: data.contactEmailSubject,
    },
  };

  const contactConfirmationExternal = {
    from: {
      name: 'Fixed-Today',
      email: 'info@fixedtoday.nl',
    },
    to: {
      name: `${data.form.firstName} ${data.form.lastName}`,
      email: data.form.email,
    },
    subject: data.contactEmailSubject,
    template_id: 'd-772518de238446b79435c1cd27704bf6',
    dynamic_template_data: {
      firstName: data.form.firstName,
      lastName: data.form.lastName,
      email: data.form.email,
      organization: data.form.company,
      phone: data.form.phone,
      message: data.form.message,
      OptInPrivacy: data.form.privacy,
      emailSubject: data.contactEmailSubject,
    },
  };

  const key = process.env.RECAPTCHA_SECRET_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  // const token = data.recaptcha;
  // const captchaValidation = await validateRecaptcha(key, token);

  try {
    // if (captchaValidation.score > 0.5) {
    if (request.method === 'POST') {
      //TO RECEIVER
      const sendGridSendTo = async (payload) => {
        sendGridMail.setApiKey(sendgridApiKey);
        const response = await sendGridMail.send(payload);
        return response;
      };
      await sendGridSendTo(contactConfirmationInternal);

      //TO SENDER
      const sendGridSendFrom = async (payload) => {
        sendGridMail.setApiKey(sendgridApiKey);
        const response = await sendGridMail.send(payload);
        return response;
      };
      await sendGridSendFrom(contactConfirmationExternal);

      return new Response(
        JSON.stringify({
          status: 'success',
          contactConfirmationInternal,
          contactConfirmationExternal,
        }),
        {
          status: 200,
          // headers: { referer: referer },
        },
      );
    } else {
      throw new Error('Server not responding');
    }
    // } else {
    //   throw new Error('Recaptcha failed');
    // }
  } catch (error) {
    console.error('ERROR: ', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Something went wrong' }),
      {
        status: 422,
      },
    );
  }
}
