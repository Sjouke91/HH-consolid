import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';
import rewriteSlug from 'utils/rewriteSlug';

export default function Footer({ blok, organizationalSchema, translate }) {
  return <h2>Footer</h2>;
  const { logo, menuItems, subFooterLinks, trademark } = blok;
  const organizationalSchemaParsed = organizationalSchema
    ? JSON.parse(organizationalSchema)
    : null;

  const { name = [], address = [] } = organizationalSchemaParsed ?? {};
  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-footer__outer-wrapper outer-wrapper`}
    >
      <div className="c-footer__inner-wrapper inner-wrapper">
        <div className="c-footer__top-wrapper">
          <div className="c-footer__top-container">
            <div className="c-footer__image-container image-container">
              <Image
                className="c-footer__image image"
                src={logo.filename}
                alt={logo.alt}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="c-footer__address-wrapper">
              {address.length
                ? address.map(
                    // prettier-ignore
                    ({ telephone, email, streetAddress, postalCode, addressRegion }, index ) => (
                  <div key={name[index]} className="c-footer__contact-container">
                    {name[index] ? (
                      <div className="c-footer__contact-name">
                        {name[index]}
                      </div>
                    ) : null}
                    {streetAddress ? (
                      <a
                        className="c-footer__contact address"
                        href={`https://www.google.com/maps/place/${streetAddress} ${postalCode} ${addressRegion}`}
                        target="_self"
                        linktype="url"
                      >
                        {`${streetAddress}, ${postalCode} ${addressRegion}`}
                      </a>
                    ) : null}
                    {email ? (
                    <a
                      className="c-footer__contact email"
                      href={`mailto:${email}`}
                      target="_self"
                      linktype="email"
                    >
                      {email}
                    </a>
                    ) : null}
                    {telephone ? (
                      <a
                        className="c-footer__contact phone"
                        href={`tel:${telephone}`}
                        target="_self"
                        linktype="url">
                        {telephone}
                      </a>
                    ) : null}
                  </div>
                ),
                  )
                : null}
            </div>

            {menuItems.map((nestedBlok) => {
              return (
                <div className="c-footer__menu-item" key={nestedBlok._uid}>
                  {nestedBlok.submenuItems.map((submenuItem) => {
                    const internalLink =
                      submenuItem?.linkedInternalPage?.story?.full_slug ??
                      submenuItem?.linkedInternalPage?.cached_url;
                    return (
                      <Link
                        key={submenuItem._uid}
                        href={`${rewriteSlug(internalLink)}`}
                        className="c-footer__menu-sub-item-link nav-link"
                      >
                        {submenuItem.submenuText}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="c-footer__bottom-wrapper">
          <div className="c-footer__bottom-container">
            <div className="c-footer__privacy-container">
              <div className="c-footer__privacy-sublinks">
                {subFooterLinks?.length
                  ? subFooterLinks.map((nestedBlok) => (
                      <StoryblokComponent
                        blok={nestedBlok}
                        key={nestedBlok._uid}
                        className="c-footer__privacy-link"
                        translate={translate}
                      />
                    ))
                  : null}
              </div>

              {trademark ? (
                <div className="c-footer__copyrights">{trademark}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
