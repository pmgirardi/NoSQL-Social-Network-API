const { Schema, model } = require('mongoose');

// Schema to create User model

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trimmed: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email address",
      ],
      
    },
    thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      ],
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    },
);

// Create a virtual property `friendCount` that gets amount of friends per post
userSchema.virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;



