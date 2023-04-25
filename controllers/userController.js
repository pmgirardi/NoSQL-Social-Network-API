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
updateUser({params, body}, res) {
  User.findOneAndUpdate({ _id: params.userId }, body, { runValidators: true, new: true })
  .then((dbUserData) => {
    if(!dbUserData) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }
    res.json (dbUserData);
  })
  .catch(err => res.status(500).json(err));  
},

// Delete to remove user by its_id

deleteUser({params}, res) {
  User.findOneAndDelete({ _id: params.userId })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No such user exists' });
        return;
      }
    }
    )
  },

// `POST` to add a new friend to a user's friend list

addFriend({params}, res) {

  User.findOneAndUpdate(
    { _id: params.userId },
    { $push: { friends: params.friendId }},
    { new: true, runValidators: true })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({ message: "No user found with this ID" })
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => res.status(500).json(err));
},

// `DELETE` to remove a friend from a user's friend list
  deleteFriend ({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true  })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "No user found with this Id" });
        return;
      }
      res.json(dbUserData);
    })
      .catch(err => res.status(500).json(err))
    },
};

  // **BONUS**: Remove a user's associated thoughts when deleted.

