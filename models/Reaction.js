const { Schema, Types } = require('mongoose');


// Schema to create Reaction model (subdocument field in Thought model)
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true, 
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    //   get: function (timeStamp) {
    //     return dayjs(timeStamp).format('DD/MM/YYYY');
    // },
  },
},
  {
    toJSON: {
      getters: true,
    },
    id: false,
  },
);

module.exports = reactionSchema;
