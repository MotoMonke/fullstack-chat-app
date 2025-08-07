import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js';
import { uploadImage } from '../lib/cloudinary.js';
export const signup = async(req,res) => {
    try {
        const {fullName,email,password} = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }else if (password.length < 6) {
            return res.status(400).json({messgae: "Password must be at least 6 characters"})
        }
        const user = await User.findOne({email});
        if(user) res.status(400).json({message: "Email is taken"});
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullname:fullName,
            email:email,
            password:hashedPassword,
        })
        if(newUser) {
            await newUser.save();
            return res.status(200).json({message:"The account was created successfuly"});
        } else {
            return res.status(400).json({message:"Invalid user data"});
        }
    } catch (error) {
        console.log('error in signup controller ',error);
        return res.status(500).json({message:"Interna server error"});
    }  
}

export const login = async(req,res) => {
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            generateToken(user._id,res);
            return res.status(200).json({
                _id:user._id,
                fullName:user.fullname,
                email:user.email,
                profilePic:user.profilePic,
            });
        }else{
            return res.status(400).json({message:"Invalid credentials"});
        }
    } catch (error) {
        console.log('login controller error ',error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logout = (req,res) => {
    try {
        res.cookie('jwt','',{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log('error in logout controller ',error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const updateProfile = async(req,res) => {
    try {
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }
        const userId = req.user._id;
        const result = await uploadImage(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:result.secure_url},{new:true});
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log('error in updateProfile controller: ',error)
        return res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('error in checkAuth controller: ',error)
        return res.status(500).json({message:"Internal server error"});
    }
}