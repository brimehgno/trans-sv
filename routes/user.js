const router =require('express').Router();
const user = require('../model/user');
const video = require('../model/video');
const detailvideo = require('../model/detailvideo')

router.post("/register", async(req, res)=>{
    try {
        const existUser = await user.findOne({
            username: req.body.username
        });
        if(existUser){
            return res.status(400).json({
                success: false,
                msg: "user has exist"
            })
        }
        else{
            // this block for create new one
            const newData = new user({
                ...req.body,
                type:"test"
            });
            
            const savedUser = await newData.save();
            if(savedUser){

                //create a test video for this user
                const testVideo = await video.findById(req.body.testVideoId);
                if(testVideo){
                    const newDetailVideo = new detailvideo({
                        mainData: testVideo.name,
                    })
                    const savedDetailVideo = await newDetailVideo.save();
                    const newVideo = new video({
                        url: testVideo.url,
                        active: true,
                        status: "doing",
                        progress: 0,
                        factorSpeed: testVideo.factorSpeed,
                        userOwner: savedUser._id,
                        money:0,
                        type:"test",
                        time:"2023/12/15",
                        detailVideo: savedDetailVideo._id,
                    })
                    await newVideo.save();
                }
                
                
                return res.status(200).json({
                    data: savedUser,
                    success: true, 
                    msg: "create successfully",
                })
            }
            else {
                return res.status(400).json({
                   
                    success: false, 
                    msg: "err"
                })
            }
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
router.post("/login", async (req, res)=>{
    try {
        
        const data= await user.findOne({
            username: req.body.username,
            password: req.body.password
        });
        //console.log(req.body);
        if(data){
            //console.log(data);
            return res.status(200).json({
                success: true,
                data,
                msg: "login success"
            })
        }
        else {
            return res.status(400).json({
                success: false, 
                msg: "login fail"
            })
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});
router.get("/getAll", async(req, res)=>{
    try {
        const alluser = await user.find();
        return res.status(200).json({
            alluser
        })
    } catch (error) {
        return res.status(500);   
    }
})
router.delete("/deleteAll", async(req,res)=>{
    try {
        //await user.deleteMany({});
        res.status(200).json({
            msg: "delete all",
        })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting users', error });
    }
})
router.delete("/deleteOneUser/:id",async(req, res)=>{
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        if(deletedUser){
            return res.status(200).json({
                deletedUser,
                success: true,
                msg: "user has been deleted"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            msg: "server has problem"
        });
    }
} )
router.put("/activeuser/:id", async(req,res)=>{
    try {
        const updatedUser = await user.findOneAndUpdate({
            username: req.params.id
        }, {
            active: true,
        }, {new: true})
        return res.status(200).json({
            msg: "success"
            , updatedUser
        })
    } catch (error) {
        return res.status(500).json(error);
    }
})
router.put("/updateuser/:id", async(req,res)=>{
    try {
        const updatedUser = await user.findByIdAndUpdate(
             req.params.id
        , {
            ...req.body
        }, {new: true})
        return res.status(200).json({
            msg: "success"
            , updatedUser
        })
    } catch (error) {
        return res.status(500).json(error);
    }
})

router.get('/updateAll', async (req, res)=>{
    try {
        const data = await video.updateMany({
            
        }, {account: 10000})
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
})
module.exports= router;