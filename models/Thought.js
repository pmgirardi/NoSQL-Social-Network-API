const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dayjs = require('dayjs');


// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: function (timeStamp) {
        return dayjs(timeStamp).format('DD/MM/YYYY');
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `reactionCount` that gets the amount of reactions associated with a thought
thoughtSchema.virtual('reactionCount')
  // Getter
  .get(function () {
    return `reactions: ${this.reactions.length}`;
  });

// Initialize our Application model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
