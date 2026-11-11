import mongoose from "mongoose";
const Schema = mongoose.Schema;
const taskSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Task", taskSchema);
