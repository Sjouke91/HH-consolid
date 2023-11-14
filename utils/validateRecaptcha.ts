/**
 *NOTE - Validates recaptcha via POST request
 * @param key secret string
 * @param token string
 * @returns Promise
 */

export default async function validateRecaptcha(key: string, token: string) {
  try {
    const captchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${token}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
      },
    );
    const captchaValidation = await captchaResponse.json();
    if (captchaValidation.success && captchaValidation.score > 0.5) {
      return captchaValidation;
    } else {
      console.error('invalid captcha');
    }
  } catch (error) {
    console.error('ERROR: ', error);
  }
}
