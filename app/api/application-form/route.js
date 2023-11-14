import toISOStringWithTimezone from 'utils/dateToISOWithTimezone';
import validateRecaptcha from 'utils/validateRecaptcha';

export async function POST(request) {
  const formData = await request.formData();
  // const apiEndpoint = 'http://localhost:4000/form/application';
  const apiEndpoint = 'https://jobs-api.directimpact.online/form/application';

  try {
    // We need to modify the form data to match some requirements of our backend.
    const newFormData = new FormData();
    for (const key of formData.keys()) {
      switch (key) {
        case 'emailAddress':
          newFormData.set('email', formData.get(key));
          break;
        case 'privacyAccepted':
          newFormData.set('privacyAccepted', formData.get(key));
          newFormData.set('privacyPolicyAccepted', formData.get(key));
          newFormData.set(
            'privacyAcceptanceDate',
            toISOStringWithTimezone(new Date()),
          );
          break;
        case 'birthDate':
          newFormData.set(
            'birthDate',
            new Date(formData.get(key)).toLocaleDateString('es-CL'),
          );
          break;
        case 'supplierName':
          newFormData.set('supplierAccountName', formData.get(key));
          break;
        case 'supplier_firstName':
          newFormData.set('supplierFirstName', formData.get(key));
          break;
        case 'supplier_lastName':
          newFormData.set('supplierLastName', formData.get(key));
          break;
        case 'supplier_email':
          newFormData.set('supplierEmail', formData.get(key));
          newFormData.set('email', formData.get(key));
          break;
        case 'supplier_phone':
          newFormData.set('supplierPhone', formData.get(key));
          break;
        default:
          if (typeof formData.get(key) === 'object') {
            newFormData.set(`${key}-type`, `${formData.get(key).type}`);
            newFormData.set(`${key}-name`, `${formData.get(key).name}`);
            newFormData.set(key, formData.get(key));
          } else {
            newFormData.set(key, formData.get(key));
          }
      }
    }

    const firstName = newFormData.get('firstName');
    const lastName = newFormData.get('lastName');
    const email = newFormData.get('email');
    const subject = 'Thank you for your application';
    const contactConfirmationExternal = {
      from: {
        name: 'Koenigstein',
        email: 'info@EDV-Koenigstein.de',
      },
      to: {
        name: `${firstName} ${lastName}`,
        email: email,
      },
      emailSubject: subject,
      template_id: 'd-66487598f26641d58a9cdcf196049bd0',
    };
    const key = process.env.RECAPTCHA_SECRET_KEY;

    // const token = formData.get('recaptcha');
    // const captchaValidation = await validateRecaptcha(key, token);
    // if (captchaValidation.score > 0.5) {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        privateKey: process.env.MIDDLEWARE_API_KEY,
      },
      body: newFormData,
    });
    const data = await response.json();
    if (data && data.status === 'success') {
      // //SEND CONFIRMATION TO RECEIVER

      return new Response(
        JSON.stringify({
          status: 'success',
          message: response,
        }),
        {
          status: 200,
        },
      );
    } else {
      throw new Error('Server not responding');
    }
    // } else {
    //   throw new Error('Recaptcha failed');
    // }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ status: 'error', message: error }), {
      status: 422,
    });
  }
}
