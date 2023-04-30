import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  async generateNonce(): Promise<string> {
    // Generate a random 32-byte value to use as the nonce
    const nonceBytes = await new Promise<Buffer>((resolve, reject) => {
      randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf);
        }
      });
    });
  
    // Encode the nonce as a hexadecimal string
    const nonce = nonceBytes.toString("hex");
  
    return nonce;
  }
}
