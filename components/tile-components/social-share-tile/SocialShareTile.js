import { storyblokEditable } from '@storyblok/react';
import { usePathname } from 'next/navigation';
export default function SocialShare({ blok, url }) {
  const { title, subtitle } = blok;
  const pathName = usePathname();
  const domain = process.env.NEXT_PUBLIC_HOST_NAME;
  return (
    <div
      {...storyblokEditable(blok)}
      className="c-social-share__tile-wrapper tile-wrapper"
    >
      <div className="c-social-share__text-container">
        <div>
          {title ? <h3 className="c-social-share__title">{title}</h3> : null}
          {subtitle ? (
            <h5 className="c-social-share__subtitle">{subtitle}</h5>
          ) : null}
        </div>

        <div>
          <div className="c-social-share__socials-container">
            <a
              className="c-social-share__socials linkedin"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${domain}${pathName}`}
              target="_blank"
            />
            <a
              className="c-social-share__socials twitter"
              href={`https://twitter.com/share?text=${domain}${pathName}&amp;url=${domain}${pathName}`}
              target="_blank"
            />
            <a
              className="c-social-share__socials facebook"
              href={`https://facebook.com/sharer.php?u=${domain}${pathName}`}
              target="_blank"
            />
            <a
              className="c-social-share__socials whatsapp"
              href={`https://api.whatsapp.com/send/?text=${domain}${pathName}&type=custom_url&app_absent=0`}
              target="_blank"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
