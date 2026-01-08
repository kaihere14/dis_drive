import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    chunkIndex: { type: Number, required: true },
    messageId: { type: String },
  },
  { _id: false }
);

const metaDataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  totalChunks: { type: Number, required: true },

  chunksMetadata: {
    type: [chunkSchema],
    default: [],
  },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model("FileMetadata", metaDataSchema);
