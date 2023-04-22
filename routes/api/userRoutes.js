const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser).post(updateUser);

router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);


module.exports = router;