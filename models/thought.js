

const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");


const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // Using  a getter method to format the timestamp on query
      get: (timestamp) => dateFormat(timestamp),
    },

    username: {
      type: String,
      required: true,
    },

    // array of nested documents created with the reactionSchema
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});


const ReactionSchema = new Schema(
    {
      reactionId: {
        // Mongoose's ObjectId data type
        type: Schema.Types.ObjectId,
        // Default value is set to a new ObjectId
        default: () => new Types.ObjectId(),
      },
  
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
  
      username: {
        type: String,
        required: true,
      },
  
      createdAt: {
        type: Date,
        // Set default value to the current timestamp
        default: Date.now,
        // Use a getter method to format the timestamp on query
        get: (timestamp) => dateFormat(timestamp),
      },
    },
    {
      toJSON: {
        getters: true,
      },
      id: false,
    }
  );




const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
