const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
});

userSchema.methods.matchPassword = (enteredPassword) => {
    bcrypt.compare(enteredPassword, this.password).then(res => {
        console.log(res);
        return res;
    }).catch(err => {
        console.log('what');
        console.log(err);
    });
}

module.exports = User = mongoose.model('User', userSchema);