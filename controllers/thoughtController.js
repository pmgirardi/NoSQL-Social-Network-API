const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // `GET` to get a single thought by its `_id`
  getSingleThought({params}, res) {
    Thought.findOne({ _id: params.thoughtId })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought({params, body}, res) {
    Thought.create(body)
      .then(({_id}) => {
        return User.findOneAndUpdate(
          {_id: params.userId},
          {$push: {thoughts:_id}},
          { new: true}
        )
      .then(dbThoughtData => {
        if(!dbThoughtData) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
    })
      .catch(err => res.status(500).json(err));
  },
  // Delete a course
  deleteThought({params}, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) { 
          res.status(404).json({ message: 'No thought with that ID' })
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update a course
  updateThought({params, body}, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      body, { runValidators: true, new: true })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought with this ID' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
// `POST` to create a reaction stored in a single thought's `reactions` array field
addReaction({params, body}, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: { reactions: body } },
    { runValidators: true, new: true })
    .then((dbThoughtData) =>
      !dbThoughtData
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID' })
        : res.json(dbThoughtData)
    )
    .catch((err) => res.status(500).json(err));
},
// `DELETE` to pull and remove a reaction by the reaction's `reactionId` value
removeReaction({params}, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reaction: { reactionId: params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((dbThoughtData) =>
      !dbThoughtData
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID' })
        : res.json(dbThoughtData)
    )
    .catch((err) => res.status(500).json(err));
}, 
};

