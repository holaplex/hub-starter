import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { PrismaClient } from '@prisma/client';
import { AssetType, Me, Project, User, Wallet } from '@/graphql.types';
import { GetCustomerWallets } from '@/queries/customer.graphql';

interface GetCustomerWalletsData {
  project: Pick<Project, 'customer'>;
}

interface GetCustomerWalletsVars {
  project: string;
  customer: string;
}

export default class UserSource {
  private holaplex: ApolloClient<NormalizedCacheObject>;
  private db: PrismaClient;

  constructor(holaplex: ApolloClient<NormalizedCacheObject>, db: PrismaClient) {
    this.holaplex = holaplex;
    this.db = db;
  }

  async get(email: string | null | undefined): Promise<Me | undefined> {
    if (!email) {
      return;
    }

    const user = await this.db.user.findFirst({
      where: { email }
    });

    const { data } = await this.holaplex.query<
      GetCustomerWalletsData,
      GetCustomerWalletsVars
    >({
      fetchPolicy: 'network-only',
      query: GetCustomerWallets,
      variables: {
        project: process.env.HOLAPLEX_PROJECT_ID as string,
        customer: user?.holaplexCustomerId as string
      }
    });

    const assetTypes = process.env.HOLAPLEX_WALLET_ASSET_TYPE?.split(
      ','
    ) as AssetType[];

    const wallets = data.project.customer?.treasury?.wallets?.filter((wallet) =>
      assetTypes.includes(wallet.assetId as AssetType)
    );

    return {
      name: user?.name,
      email: user?.email,
      image: user?.image,
      wallets: wallets
    } as Me;
  }
}
