const { Users } = require("../models");
const { populate } = require("../models/Users");

const usersController = {
    //get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // get user by ID
    getUserById({ params }, res) {
        Users.findOne({ _id: params.id })
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUserData) => {
                // error
                if (!dbUserData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // create user
    createUser({ body }, res) {
        Users.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    // update user by ID
    updateUser({ params, body }, res) {
        Users.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
    // delete user
    deleteUser({ params }, res) {
        Users.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    // add friend
    addFriend({ params }, res) {
        Users.findOneAndUpdate({ _id: params.id }, { $addToSet: { friends: params.friendsId } }, { new: true })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },

    removeFriend({ params }, res) {
        Users.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendsId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No ID found" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
};

module.exports = usersController;