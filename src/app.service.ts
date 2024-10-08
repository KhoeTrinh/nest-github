import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService {
  async getFiles(req: Request) {
    const res = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/refs/heads/main',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response = await res.json();
    console.log(response);
    const res2 = await fetch(
      `https://api.github.com/repos/Khoa-Storage/Image-Storage/git/commits/${response.object.sha}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response2 = await res2.json();
    const res3 = await fetch(
      `https://api.github.com/repos/Khoa-Storage/Image-Storage/git/trees/${response2.tree.sha}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    return res3.json();
  }

  async getFile(req: Request, id: string) {
    const res = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/refs/heads/main',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response = await res.json();
    const res2 = await fetch(
      `https://api.github.com/repos/Khoa-Storage/Image-Storage/git/commits/${response.object.sha}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response2 = await res2.json();
    const res3 = await fetch(
      `https://api.github.com/repos/Khoa-Storage/Image-Storage/git/trees/${response2.tree.sha}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response3 = await res3.json();
    const matchedFile = response3.tree.find((i: any) => i.sha === id);
    const file = await fetch(matchedFile.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization,
      },
    });
    return file.json();
  }

  async uploadFile(req: Request, file: Express.Multer.File) {
    const res = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/refs/heads/main',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response = await res.json();
    const res2 = await fetch(
      `https://api.github.com/repos/Khoa-Storage/Image-Storage/git/commits/${response.object.sha}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
      },
    );
    const response2 = await res2.json();
    const res3 = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/trees',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          base_tree: response2.tree.sha,
          tree: [
            {
              path: file.originalname,
              mode: '100755',
              type: 'blob',
              content: file.buffer.toString('base64'),
            },
          ],
        }),
      },
    );
    const response3 = await res3.json();
    const res4 = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/commits',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          parents: [response.object.sha],
          tree: response3.sha,
          message: 'Updated',
        }),
      },
    );
    const response4 = await res4.json();
    await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/refs/heads/main',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          sha: response4.sha,
        }),
      },
    );
    return 'Checked your repositories';
  }
  async convertFile(data: any) {
    const fileBuffer = Buffer.from(data.base64, 'base64');
    console.log(fileBuffer);
    const outputFilePath = path.join(__dirname, '../upload', '1234.png');
    await fs.promises.writeFile(outputFilePath, fileBuffer);
    return 'Ok';
  }
}

// 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
// 6574d78503af4cfd8bc55211908d20211ef1c572
// 0d9a6385fb66d768efe7fa2ac5db45ca845b0295
// fa3d9b62ddb3febc3ccbcec8db60776ec2c28c1b
// 09651fa0bafcaddcf1d01391706af31d83a3a5f1
