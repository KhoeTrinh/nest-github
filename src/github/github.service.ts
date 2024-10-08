import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubApiUrl = 'https://api.github.com';
  private readonly personalAccessToken =
    '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';
  private readonly owner = 'Khoa-Storage';
  private readonly repo = 'Image-Storage';
  private readonly message = 'Image Upload';

  async getFileFromGithubAndSave(
    filename: string,
  ): Promise<any> {
    const url = `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/contents/${filename}`;

    try {
      // Fetch the file from GitHub
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      return response.data.content
    } catch (error) {}
  }

  async uploadFileToGithub(fileContent: Buffer, path: string): Promise<any> {
    if (!fileContent) throw new HttpException('Please provide a file', 400);
    const url = `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
    const encodedContent = fileContent.toString('base64');
    let sha = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      if (response.status !== 200)
        throw new HttpException('Invalid access token', 400);
      sha = response.data.sha;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error fetching commit', 500);
    }

    const data = {
      message: this.message,
      content: encodedContent,
      sha,
    };
    try {
      const res = await axios.put(url, data, {
        headers: {
          Authorization: `token ${this.personalAccessToken}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error fetching commit', 500);
    }
  }
}
