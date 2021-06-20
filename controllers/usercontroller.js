const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post('/create', async (req, res) => {
    const { username, password } = req.body.user;
    
    try {
        const NewUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 13)
        })
        
        let token = jwt.sign(
            { id : NewUser.id }, 
            process.env.JWT_SECRET, 
            { expiresIn : 60 * 60 * 24 }
        );
        
        res.status(201).json({
            NewUser,
            message: "User successfully created!",
            token
        });
    } catch (error) {
    if (error instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Username already in use",
        });
    } else {
        res.status(500).json({
        message: "Failed to create user",
        });
    }   
}
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body.user;

    try {
        const LoggedInUser = await User.findOne({
            where: {
                username: username,
            } 
        });
        
        if (LoggedInUser) {
            let passwordComparison = await bcrypt.compare(password, LoggedInUser.password);
            if (passwordComparison) {
                let token = jwt.sign(
                    {id: LoggedInUser.id}, 
                    process.env.JWT_SECRET, 
                    {expiresIn: 60 * 60 * 24}
                );
    
                res.status(200).json({
                    LoggedInUser,
                    message: "User successfully logged in!",
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "Login failed - Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: 'Login failed'
            });
        }
    } catch (error) {
        res.status(500).json({ error })
    }
});

module.exports = router;