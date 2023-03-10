const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((ThoughtData) => res.json(ThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  
  // GET to get a single thought by its _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((ThoughtData) => {
        if (!ThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // POST to create a new thought 
  //(don't forget to push the created thought's _id to the associated user's thoughts array field)
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((UserData) => {
        if (!UserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id found!" });
        }

        res.json({ message: "Thought  is successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((ThoughtData) => {
        if (!ThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(ThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete Thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((ThoughtData) => {
        if (!ThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, //$pull removes from an existing values that match a specified condition.
          { new: true }
        );
      })
      .then((UserData) => {
        if (!UserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((ThoughtData) => {
        if (!ThoughtData) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(ThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((ThoughtData) => res.json(ThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;