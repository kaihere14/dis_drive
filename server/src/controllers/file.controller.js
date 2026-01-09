import { AttachmentBuilder } from "discord.js";
import metaDataModel from "../Models/metaData.model.js";
import client from "../utils/discord.js";

client.login(process.env.DISCORD_BOT_TOKEN);

export const initaliseFileUpload = async (req, res) => {
  try {
    const { fileName, fileSize, fileType, totalChunks } = req.body;
    const userId = req.userId;

    if (!fileName || !fileSize || !fileType || !totalChunks) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save metadata to database
    const metaData = new metaDataModel({
      fileName,
      fileSize,
      fileType,
      ownerId: userId,
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

    let channel;
    try {
      channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      if (!channel) {
        throw new Error("Discord channel not found");
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      return res.status(503).json({ message: "Discord service unavailable" });
    }

    let message;
    try {
      message = await channel.send({
        content: `Chunk ${chunkIndex} of ${metaData.fileName}`,
        files: [attachment],
      });
    } catch (sendError) {
      console.error("Failed to send message to Discord:", sendError);
      return res
        .status(503)
        .json({ message: "Failed to upload chunk to Discord" });
    }

    console.log(`Chunk ${chunkIndex} uploaded with message ID:`, message.id);

    // Update metadata with message ID
    try {
      const chunkIdx = parseInt(chunkIndex) - 1;
      if (chunkIdx < 0 || chunkIdx >= metaData.chunksMetadata.length) {
        throw new Error(`Invalid chunk index: ${chunkIndex}`);
      }
      metaData.chunksMetadata[chunkIdx].messageId = message.id;
      await metaData.save();
    } catch (saveError) {
      console.error("Failed to update metadata:", saveError);
      // Attempt to delete the Discord message since metadata wasn't saved
      try {
        await message.delete();
      } catch (deleteError) {
        console.error("Failed to cleanup Discord message:", deleteError);
      }
      return res.status(500).json({ message: "Failed to save chunk metadata" });
    }

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
    // Validate fileId
    if (!fileId || typeof fileId !== "string") {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    let metaData;
    try {
      metaData = await metaDataModel.findById(fileId);
    } catch (dbError) {
      console.error("Database error fetching file:", dbError);
      return res.status(500).json({ message: "Database error" });
    }

    if (!metaData) {
      return res.status(404).json({ message: "File not found" });
    }

    // Validate metadata has required fields
    if (!metaData.fileName || !metaData.fileType || !metaData.fileSize) {
      console.error("Invalid file metadata:", metaData);
      return res.status(500).json({ message: "Invalid file metadata" });
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
  let channel;
  try {
    console.log(`Streaming file: ${metaData.fileName}`);

    // Fetch Discord channel with error handling
    try {
      channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      if (!channel) {
        throw new Error("Discord channel not found");
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      throw new Error("Discord service unavailable");
    }

    // Validate chunks metadata
    if (!metaData.chunksMetadata || metaData.chunksMetadata.length === 0) {
      throw new Error("No chunks metadata found");
    }

    // Download and stream all chunks from Discord
    for (const chunkMetadata of metaData.chunksMetadata) {
      try {
        console.log(`Streaming chunk ${chunkMetadata.chunkIndex}...`);

        if (!chunkMetadata.messageId) {
          throw new Error(
            `Missing messageId for chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Fetch Discord message
        let message;
        try {
          message = await channel.messages.fetch(chunkMetadata.messageId);
        } catch (fetchError) {
          console.error(
            `Failed to fetch message ${chunkMetadata.messageId}:`,
            fetchError
          );
          throw new Error(
            `Chunk ${chunkMetadata.chunkIndex} not found in Discord`
          );
        }

        const attachment = message.attachments.first();
        if (!attachment) {
          throw new Error(
            `No attachment found for chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Fetch the attachment data with timeout
        let response;
        try {
          response = await fetch(attachment.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error(
            `Failed to fetch attachment for chunk ${chunkMetadata.chunkIndex}:`,
            fetchError
          );
          throw new Error(
            `Failed to download chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Convert to buffer
        let chunkBuffer;
        try {
          const arrayBuffer = await response.arrayBuffer();
          chunkBuffer = Buffer.from(arrayBuffer);
        } catch (bufferError) {
          console.error(
            `Failed to convert chunk ${chunkMetadata.chunkIndex} to buffer:`,
            bufferError
          );
          throw new Error(
            `Failed to process chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Stream chunk directly to response
        if (!res.writableEnded) {
          res.write(chunkBuffer);
        } else {
          throw new Error("Response stream already ended");
        }
      } catch (chunkError) {
        console.error(
          `Error processing chunk ${chunkMetadata.chunkIndex}:`,
          chunkError
        );
        throw chunkError;
      }
    }

    // End the response stream
    if (!res.writableEnded) {
      res.end();
    }
    console.log(`File streamed successfully: ${metaData.fileName}`);
  } catch (error) {
    console.error("Error streaming file from Discord:", error);
    // Try to end the response if not already ended
    if (res && !res.writableEnded) {
      res.status(500).end();
    }
    throw error;
  }
};

export const listALlFiles = async (req, res) => {
  try {
    const userId = req.userId;
    const files = await metaDataModel
      .find({ ownerId: userId })
      .select("fileName fileSize fileType totalChunks uploadDate _id")
      .sort({ uploadDate: -1 });
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fileDelete = async (req, res) => {
  const { fileIds } = req.body;
  const userId = req.userId;
  try {
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "File IDs are required" });
    }

    // Fetch Discord channel with error handling
    let channel;
    try {
      channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      if (!channel) {
        console.warn("Discord channel not found, will skip Discord cleanup");
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      // Continue without Discord cleanup
      channel = null;
    }

    const deletedFiles = [];
    const failedFiles = [];

    for (const fileId of fileIds) {
      try {
        // Validate fileId
        if (!fileId || typeof fileId !== "string") {
          console.warn(`Invalid file ID: ${fileId}`);
          failedFiles.push({ fileId, reason: "Invalid file ID" });
          continue;
        }

        // Fetch metadata
        let metaData;
        try {
          metaData = await metaDataModel.findById(fileId);
        } catch (dbError) {
          console.error(`Database error for file ${fileId}:`, dbError);
          failedFiles.push({ fileId, reason: "Database error" });
          continue;
        }

        if (!metaData) {
          console.warn(`File with ID ${fileId} not found.`);
          failedFiles.push({ fileId, reason: "File not found" });
          continue;
        }

        // Check ownership
        if (metaData.ownerId?.toString() !== userId) {
          console.warn(
            `User ${userId} not authorized to delete file ${fileId}`
          );
          return res
            .status(403)
            .json({ message: "Not authorized to delete this file" });
        }

        // Attempt to delete chunks from Discord (best effort)
        if (
          channel &&
          metaData.chunksMetadata &&
          metaData.chunksMetadata.length > 0
        ) {
          for (const chunkMetadata of metaData.chunksMetadata) {
            if (!chunkMetadata.messageId) continue;
            try {
              const message = await channel.messages.fetch(
                chunkMetadata.messageId
              );
              await message.delete();
            } catch (err) {
              console.error(
                `Failed to delete chunk message ${chunkMetadata.messageId}:`,
                err.message
              );
              // Continue with other chunks
            }
          }
        }

        // Delete metadata from database
        try {
          await metaData.deleteOne();
          deletedFiles.push(fileId);
        } catch (deleteError) {
          console.error(
            `Failed to delete metadata for file ${fileId}:`,
            deleteError
          );
          failedFiles.push({
            fileId,
            reason: "Failed to delete from database",
          });
        }
      } catch (fileError) {
        console.error(`Error processing file ${fileId}:`, fileError);
        failedFiles.push({ fileId, reason: fileError.message });
      }
    }

    // Return detailed response
    if (failedFiles.length > 0) {
      return res.status(207).json({
        message: "Some files failed to delete",
        deleted: deletedFiles,
        failed: failedFiles,
      });
    }

    return res.status(200).json({
      message: "Files deleted successfully",
      deleted: deletedFiles,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
