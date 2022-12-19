const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../model/userSchema");
const aunthenticate = require("../middleware/aunthenticate")
const cookies = require("cookie-parser");
const multer = require('multer');
const path = require('path')
const reactpath= __dirname+'/views/index.js'
router.use(cookies());


//


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profilepic')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })



//

router.get("/", (req, res) => {
    res.sendFile(__dirname+'/react/index.html' )
    console.log(__dirname)

})



router.post('/register', async (req, res) => {
    // Object distructuring ki Ja rhi hai taki req.body.name ko name se access kr ske
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz Filed the Data" })
    }

    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email Already Exist" });
        }
        const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword });
        // hasingg

        const userRegister = await user.save();
        res.status(201).json({ message: "user register succesfully" });
        console.log(userRegister)
    }
    catch (err) {
        console.log(err)
    }
})


//login route
router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "plz filed the data" })
        }
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 22592000000),
                httpOnly: true
            });
            if (!isMatch) {
                res.status(400).json({ error: "USer error" })
            }
            else {
                res.json({ message: "user sign in succesfully" })
            }
        }
        else {
            res.status(400).json({ error: "USer error" })
        }
    }
    catch (err) {
        console.log(err)
    }
})


//about us ka page
router.get("/about", aunthenticate, (req, res) => {
    res.send(req.rootUser);
})


router.get('/getdata', aunthenticate, (req, res) => {
    res.send(req.rootUser);

})

router.put('/editprofile', aunthenticate, async (req, res) => {

    console.log("im caledi gdgdg")
    try {
        const { name, email, phone, work, about } = req.body;


        const update = await User.findByIdAndUpdate(req.rootUser.id, {
            $set: {
                name: name, email: email, phone: phone, work: work, about: about
            }
        })

        if (update) {
            console.log(update.name)
            res.json({ message: "updated successfully" })
        }

    }
    catch (err) {
        console.log("hello im error")
        console.log(err)
    }


})



//File Upload middleware


router.put('/upload', [aunthenticate,upload.single('File')], async function (req, res, next) {

    var fileinfo = req.file;
    console.log(fileinfo.filename)
    console.log(req.rootUser)
    res.send(fileinfo);

    const picupload = await User.findByIdAndUpdate(req.rootUser.id, {
        $set: {
            profilepic: path.join('profilepic'+'/'+ fileinfo.filename)
            
        }
    })
    if (picupload) {
       
        console.log(picupload.email)
        
        
        
    }
    else{
        console.log("not hua safal")
    }
})




// Admin Login System
router.get('/applicant',async(req,res)=>{
   const data = await User.find({}).select({password:0,cpassword:0,tokens:0})
   res.send(data)
   console.log(data)
})

module.exports = router;