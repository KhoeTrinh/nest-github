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
    // Step 1: Get the latest commit on the main branch
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
  
    // Step 2: Get the tree associated with the latest commit
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
  
    // Step 3: Create a new blob with the image file (in binary format, not base64)
    const blobRes = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/blobs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          content: file.buffer.toString('base64'),  // Convert the buffer to base64
          encoding: 'base64',  // GitHub expects binary files to be uploaded in base64 encoding
        }),
      },
    );
    const blobResponse = await blobRes.json();
  
    // Step 4: Create a new tree with the blob you just created
    const treeRes = await fetch(
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
              path: file.originalname,  // Use the original file name
              mode: '100644',           // Regular file mode
              type: 'blob',
              sha: blobResponse.sha,    // Reference the blob you just created
            },
          ],
        }),
      },
    );
    const treeResponse = await treeRes.json();
  
    // Step 5: Create a new commit pointing to the new tree
    const commitRes = await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/commits',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          message: 'Upload image file', // Commit message
          parents: [response.object.sha], // Reference to the parent commit
          tree: treeResponse.sha,         // The new tree SHA
        }),
      },
    );
    const commitResponse = await commitRes.json();
  
    // Step 6: Update the reference of the 'main' branch to point to the new commit
    await fetch(
      'https://api.github.com/repos/Khoa-Storage/Image-Storage/git/refs/heads/main',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        body: JSON.stringify({
          sha: commitResponse.sha,
        }),
      },
    );
  
    return 'File uploaded successfully to your repository';
  }
  async convertFile(data: any) {
    const fileBuffer = Buffer.from(data.base64, 'base64');
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
// 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