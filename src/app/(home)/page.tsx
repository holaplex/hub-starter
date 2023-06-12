'use client';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import { shorten } from '../../modules/wallet';
import { GetDrop } from '@/queries/drop.graphql';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import useMe from '../../hooks/useMe';
import { useMemo } from 'react';
import { Holder } from '../../graphql.types';
import { isNil, not, pipe } from 'ramda';
import { toast } from 'react-toastify';
import { MintDrop } from '@/mutations/mint.graphql';

interface MintData {
  mint: string;
}

export default async function DropPage() {
  const dropQuery = useQuery(GetDrop);
  const session = await getServerSession(authOptions);
  const me = useMe();

  const collection = dropQuery.data?.drop.collection;
  const metadataJson = collection?.metadataJson;

  const holder = useMemo(() => {
    return collection?.holders?.find(
      (holder: Holder) => holder.address === me?.wallet?.address
    );
  }, [collection?.holders, me?.wallet]);
  const owns = pipe(isNil, not)(holder);
  const [mint, { loading }] = useMutation<MintData>(MintDrop, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetDrop
      }
    ]
  });

  const onMint = () => {
    mint()
      .then((data: any) => {
        toast.success('Mint successful');
      })
      .catch((e: any) => {
        toast.error(
          'Unable to mint. Please try again or reach out to support.'
        );
      });
  };

  return (
    <div className='col-span-12 md:col-span-6'>
      <div className='flex flex-col items-center md:items-start md:justify-center'>
        <span className='text-2xl font-extrabold md:text-xl lg:text-3xl md:font-semibold'>
          {dropQuery.loading ? (
            <div className='rounded-full bg-contrast w-60 h-6 animate-pulse' />
          ) : (
            metadataJson?.name
          )}
        </span>
        {dropQuery.loading ? (
          <div className='flex flex-col gap-2 w-full mt-6 md:mt-3'>
            <div className='rounded-full bg-contrast w-full h-4 animate-pulse' />
            <div className='rounded-full bg-contrast w-full h-4 animate-pulse' />
            <div className='rounded-full bg-contrast w-28 h-4 animate-pulse' />
          </div>
        ) : (
          <span className='text-base font-medium text-gray-300 mt-6 md:mt-3 text-center md:text-left'>
            {metadataJson?.description}
          </span>
        )}
      </div>
      <div className='bg-contrast rounded-lg p-6 flex justify-between mt-8 items-center mb-6'>
        {dropQuery.loading ? (
          <>
            <div className='flex flex-row gap-2 items-center'>
              <div className='bg-backdrop w-14 aspect-square rounded-full animate-pulse' />
              <div className='flex flex-col gap-1 justify-between'>
                <div className='h-4 w-24 rounded-full bg-backdrop animate-pulse' />
                <div className='h-6 w-16 rounded-full bg-backdrop animate-pulse' />
              </div>
            </div>
            <div className='font-bold rounded-full bg-cta text-contrast w-32 h-12 transition animate-pulse' />
          </>
        ) : session ? (
          <>
            <div className='flex flex-row items-center gap-2'>
              <img
                className='w-14 h-14 rounded-full'
                src={session?.user?.image as string}
              />

              <div className='flex flex-col gap-1 justify-between'>
                <span className='text-gray-300 text-xs'>Wallet connected</span>
                <span>{shorten(me?.wallet?.address as string)}</span>
              </div>
            </div>
            {owns ? (
              <CheckIcon width={40} />
            ) : (
              <button
                className='font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80'
                onClick={onMint}
                disabled={loading}
              >
                Claim now
              </button>
            )}
          </>
        ) : (
          <>
            <span className='text-xs md:text-base text-gray-300'>
              Sign up to claim your NFT
            </span>
            <Link
              href='/login'
              className='font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80'
            >
              Claim now
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
