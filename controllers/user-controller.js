const { User, Thought } = require('../models');

const userController = {
    // get all users
    getUsers(req, res) {
        User.find()
            .then((UserData) => {
                res.json(UserData);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json(error);
            });
    },
    // get single user by id and populate thought and friend data
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId })
            .populate('friends')
            .populate('thoughts')
            .then((UserData) => {
                if(!UserData) {
                    return res.status(404).json({ message: "No user with this id in the database!"});
                }
                res.json(UserData);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json(error);
            });
    },
    // create a user
    createUser(req, res) {
        User.create(req.body)
            .then((UserData) => {
                res.json(UserData);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json(error);
            });
    },
    // update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            {
                _id: req.params.userId
            },
            {
                $set: req.body
            },
            {
                runValidators: true,
                new: true,
            }
        )
        .then((UserData) => {
            if(!UserData) {
                return res.status(404).json({message: "No user with this id in the database!"});
            }
            res.json(UserData);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error);
        });
    },
    // add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            {
                _id: req.params.userId  
            },
            {
                $addtoSet: {friends: req.params.friendId}
            },
            {
                new: true
            }
        )
        .then((UserData) => {
            if(!UserData) {
                return res.status(404).json({message: "No user with this id in the database!"});
            }
            res.json(UserData);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error);
        });
    },
    // remove friend 
    removeFriend(req, res) {
        User.findOneAndUpdate(
            {
                _id: req.params.userId
            },
            {
                $pull: {friends: req.params.friendId}
            },
            {
                new: true
            }
        )
        .then((UserData) => {
            if(!UserData) {
                return res.status(404).json({message: "No user with this id in the database!"});
            }
            res.json(UserData);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error);
        });
    },
    // delete user
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
            .then((UserData) => {
                if(!UserData) {
                    return res.status(404).json({message: "No user with this id in the database!"});
                }
                // delete all thoughts with the user as author
                return Thought.deleteMany({ _id: {$in: UserData.thoughts}});
            })
            .then(() => {
                res.json({message: "User and thoughts deleted!"})
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json(error);
            });
    },
};

module.exports = userController;