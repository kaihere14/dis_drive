import { AttachmentBuilder } from "discord.js";
import metaDataModel from "../Models/metaData.model.js";
import client from "../utils/discord.js";

client.login(process.env.DISCORD_BOT_TOKEN);

export const initaliseFileUpload = async (req, res) => {
  try {
    const { fileName, fileSize, fileType, totalChunks } = req.body;

    if (!fileName || !fileSize || !fileType || !totalChunks) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save metadata to database
    const metaData = new metaDataModel({
      fileName,
      fileSize,
      fileType,
      totalChunks,
      chunksMetadata: Array.from({ length: totalChunks }, (_, i) => ({
        chunkIndex: i + 1,
        messageId: "",
      })),
    });
    await metaData.save();

    res
      .status(200)
      .json({ message: "File upload initialized", fileId: metaData._id });
  } catch (error) {
    console.error("Error initializing file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadChunk = async (req, res) => {
  // Set CORS headers explicitly for Vercel
  const origin = req.headers.origin;
  const allowedOrigins = ["https://drive.pawpick.store", "http://localhost:5173"];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { fileId, chunkIndex, totalChunks } = req.body;
    const chunk = req.file;

    if (!fileId || !chunkIndex || !chunk) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) {
      return res.status(404).json({ message: "File metadata not found" });
    }

    console.log(`Uploading chunk ${chunkIndex}/${totalChunks} to Discord`);

    if (!chunk.buffer) {
      return res.status(400).json({ message: "Chunk file buffer is missing" });
    }

    const attachment = new AttachmentBuilder(chunk.buffer, {
      name: `${metaData.fileName}.part${chunkIndex}`,
    });

    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    const message = await channel.send({
      content: `Chunk ${chunkIndex} of ${metaData.fileName}`,
      files: [attachment],
    });

    console.log(`Chunk ${chunkIndex} uploaded with message ID:`, message.id);

    // Update metadata with message ID
    metaData.chunksMetadata[parseInt(chunkIndex) - 1].messageId = message.id;
    await metaData.save();

    res.status(200).json({
      message: "Chunk uploaded successfully",
      messageId: message.id,
      chunkIndex: parseInt(chunkIndex),
    });
  } catch (error) {
    console.error(`Error uploading chunk:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadFile = async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) {
      return res.status(404).json({ message: "File not found" });
    }

    // Encode filename properly for Content-Disposition header
    const encodedFilename = encodeURIComponent(metaData.fileName);

    // Set headers for file download
    res.setHeader("Content-Type", metaData.fileType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedFilename}`
    );
    res.setHeader("Content-Length", metaData.fileSize);

    // Stream the file to the frontend
    await streamFileFromDiscord(metaData, res);
  } catch (error) {
    console.error("Error downloading file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const streamFileFromDiscord = async (metaData, res) => {
  try {
    console.log(`Streaming file: ${metaData.fileName}`);
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

    // Download and stream all chunks from Discord
    for (const chunkMetadata of metaData.chunksMetadata) {
      console.log(`Streaming chunk ${chunkMetadata.chunkIndex}...`);

      const message = await channel.messages.fetch(chunkMetadata.messageId);
      const attachment = message.attachments.first();

      if (!attachment) {
        throw new Error(
          `No attachment found for chunk ${chunkMetadata.chunkIndex}`
        );
      }

      // Fetch the attachment data
      const response = await fetch(attachment.url);
      const arrayBuffer = await response.arrayBuffer();
      const chunkBuffer = Buffer.from(arrayBuffer);

      // Stream chunk directly to response
      res.write(chunkBuffer);
    }

    // End the response stream
    res.end();
    console.log(`File streamed successfully: ${metaData.fileName}`);
  } catch (error) {
    console.error("Error streaming file from Discord:", error);
    throw error;
  }
};

export const listALlFiles = async (req, res) => {
  try {
    const files = await metaDataModel
      .find({})
      .select("fileName fileSize fileType totalChunks uploadDate")
      .sort({ uploadDate: -1 });
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
