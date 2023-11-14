import Link from 'next/link';
import rewriteSlug from './rewriteSlug';

export const WithLink = ({ linkedUrl, children, passHref = true }) => {
  return linkedUrl ? (
    <Link href={`${rewriteSlug(linkedUrl)}`} passHref={passHref} legacyBehavior>
      {children}
    </Link>
  ) : (
    children
  );
};
