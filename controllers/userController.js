const { Thought} = require('../models');
const User = require('../models/User');

module.exports = {
//Get all users
  getUsers(req, res) {
    User.find({})
    .then(dbUserData => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
//Get a single user by its `_id` and populated thought and friend data
  getSingleUser({params}, res) {
    User.findOne({ _id: params.userId })
      .then((dbUserData) => {
        if( !dbUserData) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
          res.json(dbUserData);
  })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Post to create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

// PUT to update a user by its `_id`
updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true },
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },


// Delete to remove user by its_id

deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) =>
        !dbUserData
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: dbUserData.thoughts } }),
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

// `POST` to add a new friend to a user's friend list


addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true },
    )
      .then(dbUserData => {
        if (!dbUserData) {
        return res.status(404).json({ message: 'No friend found with that ID:' });
        }
      res.json(dbUserData);
    })
      .catch((err) => res.status(500).json(err));
  },

// `DELETE` to remove a friend from a user's friend list
  deleteFriend (req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friend: { friendId: req.params.friendId } } },
      { new: true },
    )
      .then (dbUserData =>
        !dbUserData
          ? res.status(404).json({ message: 'No user found with that ID :(' })
          : res.json(dbUserData),
      )
      .catch((err) => res.status(500).json(err));
  },

  // **BONUS**: Remove a user's associated thoughts when deleted.
};

