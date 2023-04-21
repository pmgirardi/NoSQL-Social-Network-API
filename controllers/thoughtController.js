const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // `GET` to get a single thought by its `_id`
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
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
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
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
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      body,
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
// `POST` to create a reaction stored in a single thought's `reactions` array field
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true },
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No reaction with this ID' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
// `DELETE` to pull and remove a reaction by the reaction's `reactionId` value
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true },
    )
      .then(dbThoughtData =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No user found with that ID :(' })
          : res.json(dbThoughtData),
      )
      .catch(err => res.status(500).json(err));
  },
};