'use client';
import { GetCollections } from '@/queries/collections.graphql';
import { useQuery } from '@apollo/client';
import { CollectionMint } from '../../../graphql.types';

interface GetCollectionsData {
  collections: [CollectionMint];
}

export default function CollectionsPage() {
  const collectionsQuery = useQuery<GetCollectionsData>(GetCollections);
  return (
    <div>
      <div className='flex flex-wrap gap-6 justify-center mt-4 mb-10'>
        {collectionsQuery.loading ? (
          <>
            {Array.from(Array(8)).map((_, index) => (
              <div key={index}>
                <div className='w-52 h-52 rounded-lg bg-gray-600 animate-pulse' />
              </div>
            ))}
          </>
        ) : (
          <>
            {collectionsQuery.data?.collections?.map((mint: CollectionMint) => (
              <div
                key={mint.id}
                className='flex flex-col bg-gray-100 rounded-lg p-4'
              >
                <img
                  className='w-40 h-40 rounded-lg object-contain'
                  src={mint.metadataJson?.image as string}
                />
                <span className='font-bold mt-2'>
                  {mint.metadataJson?.name}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
