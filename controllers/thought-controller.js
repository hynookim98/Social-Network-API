const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((ThoughtData) => {
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
  // get single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((ThoughtData) => {
        if (!ThoughtData) {
          return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((ThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: ThoughtData._id } },
          { new: true }
        );
      })
      .then((UserData) => {
        if (!UserData) {
            return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
  // update thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
        {
             _id: req.params.thoughtId 
        }, 
        { 
            $set: req.body 
        }, 
        { 
            runValidators: true, new: true 
        })
      .then((ThoughtData) => {
        if (!ThoughtData) {
            return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
  // delete thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((ThoughtData) => {
        if (!ThoughtData) {
            return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((UserData) => {
        if (!UserData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
      })
      .then(() => {
        res.json({ message: 'Thought successfully deleted!' });
    })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  // add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
    { 
        _id: req.params.thoughtId 
    },
      
    { 
        $addToSet: { reactions: req.body } 
    },  
    { 
        runValidators: true, new: true 
    }
    )
      .then((ThoughtData) => {
        if (!ThoughtData) {
          return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
  // remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
    { 
        _id: req.params.thoughtId 
    },
      { 
        $pull: { reactions: { reactionId: req.params.reactionId } } 
    },
    { 
        runValidators: true, new: true 
    }
    )
      .then((ThoughtData) => {
        if (!ThoughtData) {
          return res.status(404).json({ message: 'No thought with this id in the database!' });
        }
        res.json(ThoughtData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
