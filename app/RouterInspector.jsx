'use client';
// import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function useNavigationEvent() {
  const [url, setUrl] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    setUrl(pathname + searchParams.toString());
  }, [pathname, searchParams]);
  return url;
}

function RouterInspector() {
  const router = useNavigationEvent();
  console.info(router);
  return null;
}

export default RouterInspector;
