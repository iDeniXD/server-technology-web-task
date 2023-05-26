const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} = process.env;

const User = require("../model/user");

var ObjectId = require('mongoose').Types.ObjectId; 

function safeUserFields(user) {
    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        accepted: user.status === 'accepted',   
        rejected: user.status === 'rejected',
        pending: user.status === 'pending',
        role: user.role,
        ...(user.access_token ? {access_token: user.access_token} : {})
    }
}
exports.safeUserFields = safeUserFields;

function generateAccessRefreshTokens(user, res) {
    // Create access token
    const access_token = jwt.sign(
        { _id: user._id },
        ACCESS_TOKEN_KEY,
        {
            expiresIn: "15m",
        }
    );

    // Create refresh token
    const refresh_token = jwt.sign(
        { _id: user._id },
        REFRESH_TOKEN_KEY,
        { expiresIn: '3d' });

    // Saving Cookie
    res.cookie('jwt', refresh_token, { httpOnly: true,
        sameSite: 'None', secure: true, 
        maxAge: 3 * 24 * 60 * 60 * 1000 });

    user.access_token = access_token;
}

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
    
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: lowercase email
            password: encryptedPassword,
        });
    
        generateAccessRefreshTokens(user, res);

        return res.status(201).send(safeUserFields(user));
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: "Something went wrong"})
    }
}

exports.login = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({message: "Such user does not exist"})
        }

        generateAccessRefreshTokens(user, res);

        return res.status(200).send(safeUserFields(user));
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: "Something went wrong"})
    }
}

exports.revoke = async (req, res) => {
    try {
        res.cookie('jwt', "", { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 0 });

        res.status(200).send()
    } catch (err) {
        return res.status(400).send({message: "Something went wrong"})
    }
}

exports.refresh = async (req, res) => {
    try{
        const refresh_token = req.cookies.jwt;
        if (refresh_token == null)
            return res.status(400).send({message: 'No refresh token provided'});

        const decoded_refresh = jwt.verify(refresh_token, REFRESH_TOKEN_KEY);
        const { _id } = decoded_refresh;

        const user = await User.findById( _id );
        if (user == null) {
            // remove JWT token
            res.cookie('jwt', "", { httpOnly: true, 
                sameSite: 'None', secure: true, 
                maxAge: 0 });

            return res.status(404).send({message: 'Such user does not exist'});
        } 

        generateAccessRefreshTokens(user, res);

        return res.status(200).send(safeUserFields(user)) 
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: "Something went wrong"});
    }
}


const ROLES = {
    'employee': 0,
    'head': 1,
    'admin': 2
}

exports.accept = async (req, res) => {
    try {
        const acceptingUser = req.user;
    
        const { id } = req.params;
        if (acceptingUser._id.toString() === id) 
            return res.status(403).send({message: 'You cannot accept yourself'})
    
        const user = await User.findById(id);

        if (user == null)
            return res.status(404).send({message: 'Such user does not exist'});

        // Check if the target user is not accepted by an existing user
        if (user.status === 'accepted')
            return res.status(409).send({message: 'The user is already accepted'});

        user.accepted_by = acceptingUser._id;
        user.status = 'accepted';
        await user.save();

        return res.status(201).send({})
    } catch (e) {
        console.log(e);
        return res.status(400).send({'message': 'Something went wrong'});
    }
}

async function rejectRecursively(user) {
    user.status = 'pending';
    user.accepted_by = undefined;
    user.role = 'employee';
    
    await Promise.all([
        user.save(),
        (await User.find({accepted_by: user._id})).map(rejectRecursively)
    ]);
}

exports.reject = async (req, res) => {
    try {
        const rejectingUser = req.user;
    
        const { id } = req.params;
        if (rejectingUser._id.toString() === id) 
            return res.status(403).send({message: 'You cannot reject yourself'})
    
        const user = await User.findById(id);

        if (user == null)
            return res.status(404).send({message: 'Such user does not exist'});

        if (user.status === 'accepted' && !user.accepted_by.equals(rejectingUser._id))
            return res.status(403).send({message: 'You do not have right to reject this user'});

        // Check if the target user is not accepted by an existing user
        if (user.status === 'rejected')
            return res.status(409).send({message: 'The user is already rejected'});

        const newStatus = user.status === 'pending' ? 'rejected' : 'pending';
        await rejectRecursively(user);

        user.status = newStatus;
        await user.save();

        return res.status(201).send({})
    } catch (e) {
        console.log(e);
        return res.status(400).send({'message': 'Something went wrong'});
    }
}
async function demoteToHeadRecursively(user, role) {
    if (user.role === 'admin') {
        user.role = 'head';
        return await Promise.all([
            user.save(),
            ...(await User.find({accepted_by: user._id})).map(demoteToHeadRecursively)
        ]);
    }
    
}

exports.promote = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() === id) 
            return res.status(403).send({message: 'You cannot change your own role'})

        const promotingUser = req.user;
        const role = req.body.role;

        // Check if has right to promote to specified role
        if (ROLES[promotingUser.role] < ROLES[role]) {
            return res.status(403).send({message: `You do not have right to promote a user to the role of '${role}'`})
        }

        const user = await User.findById(id);
        
        if (user == null)
            return res.status(404).send({message: 'Such user does not exist'});

        // Check if the target user is not yet accepted
        if (user.status !== 'accepted')
            return res.status(405).send({message: 'Cannot promote this user'});

        if (!user.accepted_by.equals(promotingUser._id))
            return res.status(403).send({message: 'You do not have right to promote this user'});

        // promoted
        if (ROLES[user.role] < ROLES[role]) {
            user.role = role;
            await user.save();
        } else {
            // demoted
            if (role === 'employee') {
                user.role = 'employee';

                await Promise.all([
                    user.save(),
                    ...(await User.find({accepted_by: user._id})).map(rejectRecursively)
                ]);
            } else {
                demoteToHeadRecursively(user)
            }
        }

        return res.status(201).send({})
    } catch (e) {
        console.log(e);
        return res.status(400).send({'message': 'Something went wrong'});
    }
}

exports.listOfAccepted = async (req, res) => {
    try {
        const acceptingUser = req.user;
        const acceptedUsers = await User.find({$and: [
            {_id: {$ne: acceptingUser._id}},
            {accepted_by: acceptingUser._id},
            {status: 'accepted'}
        ]}).select('-password');
        const awaitingUsers = await User.find({$or: [
            {accepted_by: {$exists: false}},
            {accepted_by: null},
            {status: {$in: ['pending', 'rejected']}}
        ]})
            .select('-password')
        
        return res.status(200).send({acceptedUsers, awaitingUsers})
    } catch (e) {
        console.log(e);
        return res.status(400).send({'message': 'Something went wrong'});
    }
}