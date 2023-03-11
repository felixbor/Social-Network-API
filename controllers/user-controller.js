const { User, Thought } = require("../models");

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .sort({ _id: 1 })
      .then((UserData) => res.json(UserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET a single user by its _id and populated thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((UserData) => {
        if (!UserData) {
          return res
            .status(404)
            .json({ message: "No user found. Wrong ID id!" });
        }
        res.json(UserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  ///POST a new user
  createUser({ body }, res) {
    User.create(body)
      .then((UserData) => res.json(UserData))
      .catch((err) => res.json(err));
  },

  //  PUT to update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((UserData) => {
        if (!UserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(UserData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE to remove user by its _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((UserData) => {
        if (!UserData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
       
        return Thought.deleteMany({ _id: { $in: UserData.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and associated thoughts are  deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // POST to add a new friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((UserData) => {
        if (!UserData) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(UserData);
      })
      .catch((err) => res.json(err));
  },

  // delete friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((UserData) => {
        if (!UserData) {
          return res.status(404).json({ message: "No user found  with this id!" });
        }
        res.json(UserData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;