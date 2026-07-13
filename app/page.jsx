"use client";

import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('../views/Landing.jsx'), {
  ssr: false,
});

export default function Page() {
  return <Landing />;
}
