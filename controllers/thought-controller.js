const { Thought, User } = require("../models");

const thoughtController = {
    // get all
    getAllThoughts(req, res) {
        Thought.find({})
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    // get thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then((dbThoughtData) => {
                // if no thought is found
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // create thought
    createThought({ body }, res) {
        console.log(body);
        Thought.create(body)
            .then((thoughtData) => {
                return User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: thoughtData._id } }, { new: true });
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    //update thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },
    // delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },
    // add reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body } }, { new: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));
    },

    //delete reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId } } }, { new: true })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;