import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();
const getEstimatedTime = () => randomInt(10, 60) * 60;

async function main() {
  const user = await prisma.user.create({
    data:{id:1,ethAddress:"0x098868A79E548c07A03eE83E10fB323511feCb0F",nonce:"e2604877196bd6be3bf309ccabe5450bdc7db19ecd8a64e46d8b2445b878e4eb"}
  })
  const startTime = new Date()
  const expiryTime = new Date()
  expiryTime.setHours(expiryTime.getHours() + 4)

  const experaince = await prisma.experience.create({
    data:{expTitle:"Beta Experiance",
    tokenGatedRecording:false,
    tokenGatedRoom:true,
    expDescription:"Welcome to the Future of Social Media",
    ownerId:user.id,
    participantsAllowed:50,
    hosts:{connect:{ethAddress:user.ethAddress}},
    recordingMetadata:{create:{}},
    roomConfig:{create:{
      roomTitle:"Beta Experiance",
      startTime,
      expiryTime,
      hostWallets:{connect:{ethAddress:user.ethAddress}},
      chain:"ETHEREUM",
      roomDescription:"Welcome to the Future of Social Media",
      contractAddress:"0x098868A79E548c07A03eE83E10fB323511feCb0F",
      tokenType:"ERC20",
    }},
    experianceStats:{create:{experianceStatus:"FINISHED",expiryTime,startTime,}}
  }
  })

  console.log(experaince);
  

}

// 0x098868A79E548c07A03eE83E10fB323511feCb0F

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });