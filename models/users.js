const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Provide valid email",
        ],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: "Thought",
    }, ],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});

// friend count
userSchema.virtual("friendCount").get(function() {
    return this.friends.length;
});

// user model
const User = model("User", userSchema);

module.exports = User;