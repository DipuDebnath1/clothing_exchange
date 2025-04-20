const { TermsAndCondition } = require("../models")

const updateTerm = async (id, content) => {
  return await TermsAndCondition.findByIdAndUpdate(id, {content:content});
};
const allTerms = async () => {
  return await TermsAndCondition.find();
};


module.exports = {
  updateTerm,
    allTerms
}