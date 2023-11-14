import { useState } from 'react';
import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import rewriteSlug from 'utils/rewriteSlug';
import icons from 'public/icons';

export default function MenuItem({ blok, handleNavigate }) {
  const [subMenuActive, set_subMenuActive] = useState(false);

  const isExternal = blok?.linkedInternalPage?.linktype === 'url';
  const storyLink =
    blok?.linkedInternalPage?.story?.full_slug ??
    blok?.linkedInternalPage?.cached_url;

  const showSubMenu = () =>
    subMenuActive
      ? set_subMenuActive(false)
      : set_subMenuActive((prev) => !prev);

  // if no submenu items render link with no-submenu-items
  // hide span with no-submenu-items

  const noSubMenuItems = blok && !blok?.submenuItems?.length;

  return (
    <div
      onClick={showSubMenu}
      className={`c-header__menu-item ${subMenuActive ? 'submenu-active' : ''}`}
    >
      <li
        {...storyblokEditable(blok)}
        className="c-header__menu-link-list-item menu-link"
      >
        {isExternal ? (
          <a
            className={`c-header__menu-link menu-link ${
              subMenuActive ? 'submenu-active' : ''
            } ${noSubMenuItems ? 'no-submenu-items' : ''}`}
            href={storyLink}
            target="_blank"
          >
            {blok.linkText}
          </a>
        ) : (
          <Link
            className={`c-header__menu-link menu-link ${
              subMenuActive ? 'submenu-active' : ''
            } ${noSubMenuItems ? 'no-submenu-items' : ''}`}
            href={rewriteSlug(storyLink)}
            onClick={(e) => {
              // remove scroll lock class
              handleNavigate();
              // return value from <a>'s onClick is what determines whether the link's inherent navigation is processed or not
              return true;
            }}
          >
            {blok.linkText}
          </Link>
        )}
        <span
          className={`c-header__mobile-menu-item ${
            subMenuActive ? 'submenu-active' : ''
          } ${noSubMenuItems ? 'no-submenu-items' : ''} `}
        >
          {blok.linkText}
        </span>
        {blok && blok?.submenuItems.length > 0 && (
          <div
            dangerouslySetInnerHTML={{ __html: icons.dropDown }}
            className="c-header__dropdown-icon"
          ></div>
        )}
      </li>
      {blok && blok?.submenuItems.length ? (
        <div
          className={`c-header__sub-menu-container ${
            subMenuActive ? 'submenu-active' : ''
          }`}
        >
          {blok.submenuItems &&
            blok.submenuItems.map(function (nestedBlok) {
              return <SubMenuItem key={nestedBlok?._uid} blok={nestedBlok} />;
            })}
        </div>
      ) : null}
    </div>
  );
}

const SubMenuItem = ({ blok }) => {
  const isExternal = blok?.linkedInternalPage?.linktype === 'url';
  const storyLink =
    blok?.linkedInternalPage?.story?.full_slug ??
    blok?.linkedInternalPage?.cached_url;

  return (
    <div {...storyblokEditable(blok)} className="c-header__sub-menu-item">
      {isExternal ? (
        <a
          className="c-header__sub-menu-link menu-link"
          href={storyLink}
          target="_blank"
        >
          {blok.linkText}
        </a>
      ) : (
        <Link
          className="c-header__sub-menu-link menu-link"
          href={rewriteSlug(storyLink)}
        >
          {blok.submenuText}
        </Link>
      )}
    </div>
  );
};
