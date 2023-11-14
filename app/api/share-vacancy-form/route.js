import validateRecaptcha from 'utils/validateRecaptcha';

//import validateRecaptcha from 'utils/validateRecaptcha';
const sendGridMail = require('@sendgrid/mail');

export async function POST(request) {
  const data = await request.json();

  const shareVacancy = {
    to: data.form.email ?? 'info@fixedtoday.nl',
    from: 'info@fixedtoday.nl',
    subject: 'Share vacancy request',
    template_id: 'd-40ae5b8b9b42477d80538f14ef8d26fd',
    dynamic_template_data: {
      jobLink:
        process.env.NEXT_PUBLIC_HOST_NAME + '/' + data.jobData.vacancyUrl,
    },
  };

  const key = process.env.RECAPTCHA_SECRET_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  // const token = data.recaptcha;
  // const captchaValidation = await validateRecaptcha(key, token);

  try {
    // if (captchaValidation.score > 0.5) {
    if (request.method === 'POST') {
      const sendGridSendFrom = async (payload) => {
        sendGridMail.setApiKey(sendgridApiKey);
        const response = await sendGridMail.send(payload);
        return response;
      };
      await sendGridSendFrom(shareVacancy);

      return new Response(
        JSON.stringify({
          status: 'success',
          shareVacancy,
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
    return new Response(JSON.stringify({ status: 'error', message: error }), {
      status: 422,
    });
  }
}
