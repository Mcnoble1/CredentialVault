import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_URL = 'https://api.pinata.cloud';

export class PinataService {
  private static instance: PinataService;
  private jwt: string | null = 'demo_jwt'; // Demo JWT for testing

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

    // Demo implementation for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHash = 'Qm' + Math.random().toString(36).substr(2, 32);
        resolve(mockHash);
      }, 1500);
    });
  }

  async verifyFile(hash: string): Promise<boolean> {
    // Demo implementation for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}