import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import Link from 'next/link';
import rewriteSlug from 'utils/rewriteSlug';
import { localization } from 'config';

export default function Breadcrumbs({ params, pageType }) {
  //config locale objects
  const engLocale = localization.find((l) => l.locale === 'en');
  const dutchLocale = localization.find((l) => l.locale === 'nl');

  //breadcrumbs config
  const breadcrumbsConfig = {
    vacancy: {
      nl: [
        { href: '/nl/opdrachten', label: 'Vacatures' },
        { label: 'Weergave' },
      ],
      en: [
        { href: '/en/vacancies', label: 'Vacancies' },
        { label: 'Job Description' },
      ],
    },
    application: {
      nl: [
        { href: '/nl/opdrachten', label: 'Vacature' },
        {
          href: `/de/${dutchLocale.vacancy}/${params.jobSlug}`,
          label: 'Toepassing',
        },
        { label: 'Toepassing' },
      ],
      en: [
        { href: '/en/vacancies', label: 'Vacancies' },
        //todo: check whether vacInEng is the correct parameter
        {
          href: `/en/${engLocale.vacancy}/${params.jobSlug}`,
          label: 'Functieomschrijving',
        },
        { label: 'Application' },
      ],
    },
  };

  const renderBreadcrumbItem = (href, label, isLastItem) => {
    if (href) {
      return (
        <div className="c-breadcrumbs__breadcrumb-item">
          {isLastItem ? (
            <span>{label}</span>
          ) : (
            <Link href={`${rewriteSlug(href)}`}>{label}</Link>
          )}
        </div>
      );
    }
    return (
      <div className="c-breadcrumbs__breadcrumb-item">
        <span>{label}</span>
      </div>
    );
  };

  const pageBreadcrumbs =
    breadcrumbsConfig[pageType] && breadcrumbsConfig[pageType][params.lang];

  return (
    <div className="c-breadcrumbs__outer-wrapper">
      <div className="c-breadcrumbs__inner-wrapper">
        {renderBreadcrumbItem('/', 'Home')}

        {pageType === 'page' &&
          params.urlPath.map((breadcrumb, index) =>
            renderBreadcrumbItem(
              `/${breadcrumb}`,
              breadcrumb,
              index === params.urlPath.length - 1,
            ),
          )}

        {pageBreadcrumbs &&
          pageBreadcrumbs.map((item, index) =>
            renderBreadcrumbItem(
              item.href,
              item.label,
              index === pageBreadcrumbs.length - 1,
            ),
          )}
      </div>
    </div>
  );
}
