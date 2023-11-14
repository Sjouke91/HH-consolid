import Image from 'next/image';
import Link from 'next/link';

export default async function NotFound() {
  /*
    NOTE(Fran): Currently because vercel is incapable of writing react code
    it is not possible to pass params to the not found page.
    check:
      https://nextjs.org/docs/app/api-reference/file-conventions/not-found
      https://github.com/vercel/next.js/issues/55717
      https://github.com/vercel/next.js/issues/53243

      The current easiest "solution" is to have the page in german as default
      since this is the default not found page. If anyone can solve this,
      would be great.
  */

  return (
    <html className="c-not-found__html">
      <body className="c-not-found__body">
        <div className="c-not-found__wrapper">
          <div className="c-not-found__text-container">
            <div className="c-not-found__icon" />
            <h1 className="c-not-found__title">
              De pagina die u zoekt bestaat niet
            </h1>
            <p className="c-not-found__notice">
              We hebben ons best gedaan, maar het lijkt erop dat deze pagina
              niet meer bestaat of misschien is verplaatst
            </p>
            <Link
              className="c-not-found__button show-as-button primary"
              href="/"
            >
              Ga terug naar Home
            </Link>
          </div>
          <div className="c-not-found__image-container">
            {/* <Image
              className="c-not-found__image"
              width={0}
              height={0}
              // src="/circle8-background-shape-2.svg"
              src="/circle8-404-mobile-background.svg"
              alt={'404'}
              sizes="100vw"
              style={{ maxWidth: '100%' }}
            /> */}
          </div>
        </div>
      </body>
    </html>
  );
}
