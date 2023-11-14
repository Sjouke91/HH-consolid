// import { validateRecaptcha } from '@direct-impact/difj-core';
// import getConfig from 'next/config';
// const sendGridMail = require('@sendgrid/mail');

export async function POST(request) {
  const data = await request.json();

  // const { serverRuntimeConfig } = getConfig();

  // const key = serverRuntimeConfig.RECAPTCHA_SECRET_KEY;
  // const token = data.recaptcha;

  // const sendgridApiKey = process.env.SENDGRID_API_KEY;
  // const captchaValidation = await validateRecaptcha(key, token);

  // try {
  // if (captchaValidation.score > 0.5) {
  //   if (request.method === 'POST') {
  //     // //TO RECEIVER
  //     const sendGridSendTo = async (payload) => {
  //       sendGridMail.setApiKey(sendgridApiKey);
  //       const response = await sendGridMail.send(payload);
  //       return response;
  //     };
  //     await sendGridSendTo(contactConfirmationInternal);

  //     if (contactConfirmationExternal) {
  //       //TO SENDER
  //       const sendGridSendFrom = async (payload) => {
  //         sendGridMail.setApiKey(sendgridApiKey);
  //         const response = await sendGridMail.send(payload);
  //         return response;
  //       };
  //       await sendGridSendFrom(contactConfirmationExternal);
  //     }

  // return res.status(200).send({ status: 'success' });
  const delay = new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve('success');
    }, 3000),
  );
  await Promise.resolve(delay);

  return new Response(
    JSON.stringify({
      status: 'success',
    }),
    {
      status: 200,
    },
  );
  // } else {
  //   return new Response(JSON.stringify({ status: 'error' }), {
  //     status: 500,
  //     // headers: { referer: referer },
  //   });
  // }
  // }
  // } catch (error) {
  //   console.error('ERROR: ', error.response.body);

  //   return new Response(JSON.stringify({ message: 'Something went wrong' }), {
  //     status: 422,
  //   });
  // }
}
