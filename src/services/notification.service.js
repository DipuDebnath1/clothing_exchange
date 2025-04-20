const { Notification } = require("../models");
const Schema = require("mongoose");
const ApiError = require("../utils/ApiError");
const { ObjectId } = Schema.Types;


const sendNotification = async( id,payload) =>{
  try{
      if (payload?.role==="user") {
          const notificationRes = await Notification.create(payload)

          const notificationRoom = `new-notification::${id}`
          io.emit(notificationRoom, {title:notificationRes.title, content:notificationRes.content, status:notificationRes.status, priority:notificationRes.priority})
          return
      }
      if (payload?.role==="admin") {
          const notificationRes = await Notification.create(payload)

          const notificationRoom = `new-notification::admin`
          io.emit(notificationRoom, {title:notificationRes.title, content:notificationRes.content, status:notificationRes.status, priority:notificationRes.priority})
          return
      }
      return
     
  }catch(err){
      throw new ApiError(httpStatus.BAD_REQUEST,err?.message || "send notification failed")
  }
}


const getAllNotification = async (userId, role, page=1, limit=10) => {

  page = Math.max(1, parseInt(page, 10));
  limit = Math.max(1, parseInt(limit, 10));

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  const filter = {};
  if (role === "admin") {
    filter.role = "admin";
  } else {
    filter.userId = new ObjectId(userId);
  }
  const [totalCount, result] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.find(filter).skip(skip).limit(limit).select('title content status priority').sort({createdAt:-1}), // Add limit here
  ]);  

  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalPages,
    currentPage: page,
    totalResults: totalCount,
    resultsPerPage: limit, // Use limit here
    result: result,
  };
};

module.exports = {
  getAllNotification,
  sendNotification
}; 
