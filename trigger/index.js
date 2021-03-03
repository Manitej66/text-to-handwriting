const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuid } = require("uuid");
const handwritten = require("handwritten.js");

module.exports = async function (context, req) {
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient("text-to-hand");

  const blobName = "quickstart" + uuid() + ".pdf";

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload data to the blob
  await handwritten(req.body.input_text).then(async (converted) => {
    const uploadBlobResponse = await blockBlobClient.uploadStream(converted);
  });

  context.res = {
    body: blockBlobClient.url,
  };
};
