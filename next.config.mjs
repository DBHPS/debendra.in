import fs from 'fs';
import path from 'path';

function getResumeLink() {
  try {
    const readmePath = path.resolve('./README.md');
    const content = fs.readFileSync(readmePath, 'utf8');
    const match = content.match(/\[Resume Link\]\((.*?)\)/);
    return match ? match[1] : '';
  } catch (e) {
    return '';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_RESUME_LINK: getResumeLink(),
  }
};

export default nextConfig;
