const {Schema, model} = require('mongose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // add getter method to format the timestamp
        },
        username: {
            type: String, 
            required: true
        },
        reaction: [reactionSchema]
    },
    {
        toJSON:{getters: true},
        id: false
    }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;