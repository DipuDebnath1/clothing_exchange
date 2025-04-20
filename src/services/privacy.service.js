const { PrivacyPolicy } = require("../models")

const updatePrivacy =async (id,content)=>{
  return await PrivacyPolicy.findByIdAndUpdate(id, {content:content})
  
}
const allPrivacy = async () => {
  return await PrivacyPolicy.find();
};


module.exports = {
  updatePrivacy,
    allPrivacy
}