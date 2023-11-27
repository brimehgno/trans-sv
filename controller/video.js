const video = require('../model/video');
const updateVideo = (id, updatedData) => {

    const condition = {
        url: id
    }
    return User.findOneAndUpdate(condition, updatedData, { new: true }).exec();
  };
  

  module.exports = {
    updateVideo,
  };