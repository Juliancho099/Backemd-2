import {User} from '../models/userModels.js';

const register = (req, res) => {
   return res.json(req.user) 
};


const login = (req,res)=>{
    const token = req.token;
    
    res.cookie('token', token,{
        httpOnly: true,
        maxAge: 1000*60*60 *24*7,
    })

    res.json({token});
};

const logout =(req,res)=>{
    res.clearCookie('token');
    res.json({message: 'Logged out'});
};


export {register,login, logout};
