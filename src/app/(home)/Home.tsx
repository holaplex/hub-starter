'use client';
import { usePathname } from 'next/navigation';
import Hero from '../../components/Hero';
import Tabs from '../../layouts/Tabs';
import { cloneElement } from 'react';

export default function Home({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Hero />
      <Tabs.Page className='mt-8'>
        <Tabs.Panel>
          <Tabs.Tab name='Drop' href='/' active={pathname === '/'} />
          <Tabs.Tab
            name='Your collections'
            href='/collections'
            active={pathname === '/collections'}
          />
        </Tabs.Panel>
        <Tabs.Content>{cloneElement(children as JSX.Element)}</Tabs.Content>
      </Tabs.Page>
    </>
  );
}
