require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT_URL,
  s3ForcePathStyle: true,
  region: process.env.AWS_S3_REGION_NAME,
});

const BUILD_DIR = path.join(__dirname, "dist");
const BUCKET_NAME = process.env.AWS_STORAGE_BUCKET_NAME;

// Function to determine Content-Type based on file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);
  
  return s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "no-cache, no-store, must-revalidate",
    })
    .promise()
    .then(() => console.log(`Uploaded ${key} with Content-Type: ${contentType}`));
}

async function uploadFolder(dir, prefix = "static/studio") {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await uploadFolder(fullPath, `${prefix}/${file}`);
    } else {
      await uploadFile(fullPath, `${prefix}/${file}`);
    }
  }
}

uploadFolder(BUILD_DIR)
  .then(() => console.log("Upload complete!"))
  .catch(console.error);
