const router = require("express").Router();
const video = require('../model/video')
const user = require('../model/user')
const detailVideo = require('../model/detailvideo')
const mongoose = require('mongoose')

router.delete("/deleteOneVideo/:id",async(req, res)=>{
    try {
        const deletedVideo = await video.findByIdAndDelete(req.params.id);
        if(deletedVideo){
            return res.status(200).json({
                deletedVideo,
                success: true,
                msg: "video has been deleted"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            msg: "server has problem"
        });
    }
} )
router.get('/findByDetailVideo/:detailVideoId', async(req, res)=>{
    try {
        const data = await video.find({
            detailVideo: req.params.detailVideoId
        })
        return res.status(200).json({
            success: true, 
            data
        })
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: "server"
        })
    }
})
router.get('/find/:id', async(req, res)=>{
    try {
        const data = await video.findById(
            req.params.id
        )
        return res.status(200).json({
            success: true, 
            data
        })
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: "server"
        })
    }
})

router.post('/', async(req,res)=>{
    try{
        console.log(req.body);
        const data = await video.find({
            userOwner: "",
            active:true,
        });
        if(data){
            var fixData = [];
            var refUserData = [] ; // this user have to do ref vd before see normal vd
            for(const element of data){
                if(element.refVideo!=""){
                    
                    if(req.body.userId){
                       
                        const refVideo = await video.findOne({
                            userOwner: req.body.userId,
                            _id: element.refVideo
                        })
                        if(refVideo){                            
                            refUserData.push(element);
                        }
                        else if(req.body.isAdmin){
                            refUserData.push(element);
                        }
                        
                    }
                    
                }
                else{
                    fixData.push(element);
                }
            }
            
            // await data.forEach( async (element) => {
            //     if(element.refVideo!=""){
                    
            //         if(req.body.userId){
                       
            //             const refVideo = await video.find({
            //                 userOwner: req.body.userId,
            //                 _id: element.refVideo
            //             })
                        
            //             if(refVideo){
            //                 console.log("Có" , element._id);
            //                 fixData.push(element);
            //             }
            //             else{
            //                 //fixData.push(element);                            
            //             }
            //         }
            //         else if(req.body.isAdmin){
            //             fixData.push(element);
            //         }
            //     }
            //     else{
            //         fixData.push(element);
            //     }
                
            // });

            if(req.body.userId){
                const fetchUser = await user.findById(req.body.userId);
                if(fetchUser?.isRestrict){
                    fixData= [];
                }
            }
            
            return res.status(200).json({
                data: req.body.isAdmin? [...refUserData, ...fixData] : refUserData.length>0 ? refUserData : fixData,
                msg: "get data successfully"
            });
        }
        else{
            return res.status(200).json({
                msg: "data not found"
            })
        }
    }
    catch(err){
        return res.status(500).json({});
    }
})
router.get('/getall', async(req,res)=>{
    try {
        // const data = await video.find({
        //     status: {$ne: "done"}
        // });
        const data = await video.find({});
        const remakeData = [];
        for(let i =0; i< data?.length; i++){
            console.log(data[i].userOwner)
            //console.log(new mongoose.Types.ObjectId(data[i].userOwner))
            var id = data[i].userOwner;
            var currUser;

            if(id){
                currUser = await user.findById(id)
            }  
            else {
                currUser= null;
            }         
            //console.log(currUser)
            const item = {
                ...data[i]._doc, 
                ownerName : currUser?.name || "" ,
                name: data[i].name,
                //name: data[i].name?.substring(0, 10),
                dataLength : data[i].name?.length,
                adminData: data[i].adminData?.substring(0,10),
            }
            remakeData.push(item);
        }
        return res.status(200).json(remakeData);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get('/active/:id' , async(req, res)=>{
    try {
        const data = await video.findByIdAndUpdate(
            req.params.id,{
                active: true, 
            }
        );
        if(data)
            {
                return res.status(200).json({
                    success: true, 
                    data
                })
        }else{
            return res.status(400).json({
                success: false,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
})
router.put('/updatevideo/:id' , async(req, res)=>{
    try {
        const data = await video.findByIdAndUpdate(
            req.params.id,{
                ...req.body 
            }
        );
        if(data)
            {
                return res.status(200).json({
                    success: true, 
                    data
                })
        }else{
            return res.status(400).json({
                success: false,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
})
router.get('/updatevideo', async (req, res)=>{
    try {
        const data = await video.updateMany({
            
        }, {status: "doing"})
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
})

router.get('/data/:id', async (req,res)=>{
    try {
        const data = await video.findById(req.params.id);
        
        if(data){
            if(data?.detailVideo.length>0){
                const fetchDetailVideo = await detailVideo.findById(data?.detailVideo);
                console.log(fetchDetailVideo);
                if(fetchDetailVideo){
                    return res.status(200).json({
                        data:{...data._doc, mainData: fetchDetailVideo.mainData, 
                        mainAdminData: fetchDetailVideo.mainAdminData },
                        msg:"get data successfully",
                    });
                }
            }           
            return res.status(200).json({
                data,
                msg:"get data successfully",
            });
        }
        else {
            console.log("no data");
            return res.status(200).json({
                msg: "data not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
})

router.post("/receivemoney", async(req, res)=>{
    try {
        const data = await video.findById(req.body.videoId);
        const userData = await user.findById(req.body.userId);
        if(data && userData){
            if(data.status =="accept"){
                await video.findByIdAndUpdate(req.body.videoId, {
                    status: "done"
                });
                await user.findByIdAndUpdate(req.body.userId,{
                    account: userData.account + req.body.totalMoney,
                    totalAccount: userData.totalAccount + req.body.totalMoney,
                    score : parseInt(userData.score) + parseInt(req.body.score)
                })
                return res.status(200).json({
                    success: true,
                    msg: 'change accept to done',
                })
            }
            return res.status(200).json({
                success: false, 
                msg: "video has not been  accepted",
            })
        }
        else{
            return res.status(200).json({
                success: false, 
                msg: "data not found or not user",
            })
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})
router.post("/acceptVideo", async(req, res)=>{
    try {
        const data = await video.findById(req.body.videoId);
        if(data){
            if(data.status =="pending"){
                await video.findByIdAndUpdate(req.body.videoId, {
                    status: "accept",
                    performance: req.body.performance
                });
                return res.status(200).json({
                    success: true,
                    msg: 'change pending to accept',
                })
            }
            return res.status(200).json({
                success: false, 
                msg: "video has not been complete",
            })
        }
        else{
            return res.status(200).json({
                success: false, 
                msg: "data not found",
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.post("/submitvideo", async(req, res)=>{
    try {
        const data = await video.findById(req.body.videoId);
        if(data){
            if(data.status =="doing" || data.status =="reject" || data.status == "none" ||data.status ==null){
                await video.findByIdAndUpdate(req.body.videoId, {
                    status: "pending"
                });
                return res.status(200).json({
                    success: true,
                    msg: 'change doing to pending',
                })
            }
            return res.status(200).json({
                success: false, 
                msg: "video has not been complete",
            })
        }
        else{
            return res.status(200).json({
                success: false, 
                msg: "data not found",
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})

router.post("/active", async(req, res)=>{
    try {
        const data = await video.findById(req.body.url);
        if(data){
            if(data.userOwner.length>0){
                return res.status(400).json({
                    success: false, 
                    msg: "video has been active"
                })
            }
        }
        const updatedData = await video.findByIdAndUpdate( req.body.url,{userOwner:req.body.userId, status: "doing"})
        
        if(updatedData){
            return res.status(200).json({
                success: true, 
                updatedData
            })
        }
        else{
            return res.status(200).json({
                success: false,
                data: req.body
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);


    }
})

router.post("/deactive", async(req, res)=>{
    try {
        const updatedData = await video.findByIdAndUpdate( req.body.url,{userOwner:""})
        return res.status(200).json({
            updatedData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);


    }
})


router.post("/getuservideo", async(req, res)=>{
    try{
        const data = await video.find({
            userOwner: req.body.userId
        });
        if(data?.length>0){
            
            return res.status(200).json({
                success: true,
                count: data.length,
                msg: "get data successfully",
                data,
            });
        }
        else{
            return res.status(200).json({
                success: false,
                count: 0,
                msg: "data not found"
            })
        }
    }
    catch(err){
        return res.status(200).json({
            success: false, 
            msg: "server has problem", 
            error: err,
        });
    }
})
router.post('/createOne', async(req, res)=>{
    try {
        const newDetailVideo = new detailVideo({
            mainData: req.body.mainData, 
            adminData: ""
        });
        const savedDetailVideo = await newDetailVideo.save();


        const newData = new video({
            ...req.body,
            detailVideo: savedDetailVideo._id
        });
        await newData.save();
        console.log('User created successfully');
       
        return res.status(200).json({
            success:true,
            msg:"create successffully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false, 
            msg: "server has error"
        })
    }
})

router.post('/data',async (req, res) => {
    const newData = new video(req.body);
    //console.log("start pushing data server...",  new Date(Date.now()), req.body.currentTranslate)
    try{
    const data = await video.findById(req.body.videoId);
    if(data){

        var userUpdateData;
        if(newData.name?.length>0){
            //console.log(data.name.length, newData.name.length);
            if(newData.name.length + 300 < data.name.length 
                || newData.name.length-300> data.name.length){
                console.log("data change so much !!!");
                return res.status(300).json({
                    success:false,
                    msg:"data change so much!!!"
                });
            }
        }
        else{
            const refDetailVideo= await detailVideo.findById(data.detailVideo);
            if(refDetailVideo){
                if(req.body.mainData.length + 300 < refDetailVideo.mainData.length
                    || req.body.mainData.length -300 > refDetailVideo.mainData.length){
                        console.log("data change so much");
                        return res.status(300).json({
                            success: false, 
                            msg: "data change so much !!!"
                        });
                }
            }
            else return res.status(300).json({
                success: false, 
                msg: "fail to save data"
            })

            await detailVideo.findByIdAndUpdate(data.detailVideo, {
                mainData: req.body.mainData
            });
        }

        // update progress user doing
        if(req.body.currentTranslate> data.currentTranslate+5 
            || req.body.currentTranslate < data.currentTranslate-2){
            userUpdateData={...req.body,currentTranslate: data.currentTranslate }
        }
        else{
            userUpdateData = {...req.body}
        }

        if(req.body.progress> data.progress+5
            || req.body.progress < data.progress-2){
            userUpdateData={...userUpdateData,progress: data.progress }
        }


        const updatedData = await video.findByIdAndUpdate(
            req.body.videoId
        , userUpdateData);
        if(updatedData){
            //console.log("Video update Successfully");
            return res.status(200).json({
                success: true, 
                message: "updatedd!!"
            });
        }
        else{
            console.log("udpate fail");
            res.status(200).json({
                success:false, 
                err: "err"
            })
        }
    }
    else{
        return res.status(300).json({
            success: false, 
            msg: "cant find video"
        });
        // await newData.save();
        // console.log('User created successfully');
        // return res.status(200).json({
        //     success:true,
        //     msg:"create successffully"
        // })
    }   
   }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            err
        })
    }
   
  
//     newData.save()
//   .then(() => {
//     console.log('User created successfully');
//   })
//   .catch((err) => {
//     console.error(err);
//   });
  });

  router.post('/updatefactor',async (req, res) => {      
    try{
    const data = await video.findOne({
        url: req.body.url
    });
    if(data){
        
        const updatedData = await video.findOneAndUpdate({
            url:req.body.url
        }, {factorSpeed: req.body.factorSpeed});
        if(updatedData){
            console.log("Video update Successfully");
            return res.status(200).json({
                success: true, 
                message: "updatedd!!"
            });
        }
        else{
            console.log("udpate fail");
            res.status(200).json({
                success:false, 
                err: "err"
            })
        }
    }
    else{
        
        return res.status(200).json({
            success:false,
            msg:"no data"
        })
    }   
   }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            err
        })
    }
  });

  router.post('/updateErr',async (req, res) => {      
    try{
    const data = await video.findOne({
        url: req.body.url
    });
    if(data){
        
        const updatedData = await video.findOneAndUpdate({
            url:req.body.url
        }, {error: req.body.error});
        if(updatedData){
            console.log("Video update Successfully");
            return res.status(200).json({
                success: true, 
                message: "updatedd!!"
            });
        }
        else{
            console.log("udpate fail");
            res.status(200).json({
                success:false, 
                err: "err"
            })
        }
    }
    else{
        
        return res.status(200).json({
            success:false,
            msg:"no data"
        })
    }   
   }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            err
        })
    }
  });
  router.post('/updateAdminData',async (req, res) => {      
    try{
    const data = await video.findById(req.body.videoId);
    if(data){
        var updatedData ;

        var refDetailVideo;
        if(data?.detailVideo){
            refDetailVideo = detailVideo.findById(data?.detailVideo);
        }
        
        if(!refDetailVideo){
            updatedData = await video.findByIdAndUpdate(
                req.body.videoId
            , {adminData: req.body.mainAdminData});
        }
        else{
            updatedData = await detailVideo.findByIdAndUpdate(data?.detailVideo, 
                {mainAdminData: req.body.mainAdminData});
        }
        if(updatedData){
            console.log("Video update Successfully");
            return res.status(200).json({
                success: true, 
                message: "updatedd!!"
            });
        }
        else{
            console.log("udpate fail");
            res.status(200).json({
                success:false, 
                err: "err"
            })
        }
    }
    else{
        
        return res.status(200).json({
            success:false,
            msg:"no data"
        })
    }   
   }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            err
        })
    }
  });
  module.exports= router;