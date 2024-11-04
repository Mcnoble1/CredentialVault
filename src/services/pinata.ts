import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export class PinataService {
  private static instance: PinataService;
  private jwt: string | null = PINATA_JWT || 'demo_jwt';

  private constructor() {}

  static getInstance(): PinataService {
    if (!PinataService.instance) {
      PinataService.instance = new PinataService();
    }
    return PinataService.instance;
  }

  setJWT(jwt: string) {
    this.jwt = jwt;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.jwt}`,
    };
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.jwt || this.jwt === 'demo_jwt') {
      // Demo implementation for testing
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockHash = 'Qm' + Math.random().toString(36).substr(2, 32);
          resolve(mockHash);
        }, 1500);
      });
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'academic_credential',
        timestamp: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async verifyFile(hash: string): Promise<boolean> {
    if (!this.jwt || this.jwt === 'demo_jwt') {
      // Demo implementation for testing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.1); // 90% success rate for demo
        }, 1000);
      });
    }

    try {
      const response = await axios.get(
        `${PINATA_API_URL}/data/pinList?status=pinned&hashContains=${hash}`,
        { headers: this.getHeaders() }
      );

      return response.data.rows.length > 0;
    } catch (error) {
      console.error('Pinata verification error:', error);
      throw new Error('Failed to verify file on IPFS');
    }
  }
}