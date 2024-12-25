import ContactCollection from "../db/models/Contact.js";

// export const getContacts = () => ContactCollection.find();
// export const getContactByID = (id) => ContactCollection.findById(id);
export function getContacts() {
  return ContactCollection.find();
}
export function getContactByID(id) {
  return ContactCollection.findById(id);
}
