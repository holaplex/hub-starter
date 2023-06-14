'use client';
import { usePathname } from 'next/navigation';
import Header from '../../components/Header';
import Tabs from '../../layouts/Tabs';
import { cloneElement } from 'react';

export default function Home({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Header />
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
