import ContactCollection from "../db/models/Contact.js";

export const getGontacts = () => ContactCollection.find();
export const getContactByID = (id) => ContactCollection.findById(id);
