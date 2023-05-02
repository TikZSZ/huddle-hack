import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();
const getEstimatedTime = () => randomInt( 10, 60 ) * 60;

async function main ()
{
  const user = await prisma.user.create( {
    data: { id: 2, ethAddress: "0x6823CFdc088265783b0721a9E3df40E066c3f66e", nonce: "e2604877196bd6be3bf309ccabe5450bdc7db19ecd8a64e46d8b2445b878e4eb" }
  } )
  const startTime = new Date()
  const expiryTime = new Date()
  expiryTime.setHours( expiryTime.getHours() + 4 )

  const hosts = [
    {
      where:
      {
        ethAddress: user.ethAddress
      },
      create:
      {
        ethAddress: user.ethAddress, nonce: ""
      }
    },
    {
      where: {
        ethAddress: "0xDd39002BbaA8d41Ae8E9DAEa1D87bDa3e23d6B71"
      },
      create: {
        ethAddress: "0xDd39002BbaA8d41Ae8E9DAEa1D87bDa3e23d6B71", nonce: ""
      }
    }
  ]

  const experaince = await prisma.experience.create( {
    data: {
      expTitle: "Beta Experiance",
      tokenGatedRecording: false,
      tokenGatedRoom: true,
      expDescription: "Welcome to the Future of Social Media",
      ownerId: user.id,
      participantsAllowed: 50,
      hosts: { connectOrCreate: hosts },
      recordingMetadata: { create: { tokenGatedRecording: true, chain: "FILECOIN_HYPERSPACE", tokenType: "REC20", contractAddress: "" } },
      roomConfig: {
        create: {
          roomTitle: "Beta Experiance",
          startTime,
          expiryTime,
          hostWallets: { connect: { ethAddress: user.ethAddress } },
          chain: "ETHEREUM",
          roomDescription: "Welcome to the Future of Social Media",
          contractAddress: "0x098868A79E548c07A03eE83E10fB323511feCb0F",
          tokenType: "ERC20",
        }
      },
      experianceStats: { create: { experianceStatus: "FINISHED", expiryTime, startTime, } },
      recordings: {
        createMany: {
          data: [
            {
              dateRecorded: new Date(),
              recTitle: "Init",
              recContractId: 1,
              recDescription: "First Recording"
            },
            {
              dateRecorded: new Date(),
              recTitle: "Follow UP",
              recContractId: 2,
              recDescription: "Second Recording"
            }
          ]
        }
      }
    }
  } )

  console.log( experaince );


}

// 0x098868A79E548c07A03eE83E10fB323511feCb0F

main()
  .then( async () =>
  {
    await prisma.$disconnect();
  } )
  .catch( async ( e ) =>
  {
    console.error( e );
    await prisma.$disconnect();
    process.exit( 1 );
  } );