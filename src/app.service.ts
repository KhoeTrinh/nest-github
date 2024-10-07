import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  async getHello(req: Request) {
    const res = await fetch('http://localhost:3001/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization, 
      },
    });
    return res.json()
  }

  async createHello(data: any) {
    const res = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json()
  }
}
