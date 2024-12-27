import ContactCollection from "../db/models/Contact.js";

// export const getContacts = () => ContactCollection.find();
// export const getContactByID = (id) => ContactCollection.findById(id);
export function getContacts() {
  return ContactCollection.find();
}
export function getContactByID(id) {
  return ContactCollection.findById(id);
}
export function createContact(contact) {
  return ContactCollection.create(contact);
}
export function deleteContact(id) {
  return ContactCollection.findByIdAndDelete(id);
}
export async function replaceContact(id, contact) {
  const rawResult = await ContactCollection.findByIdAndUpdate(id, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
export function patchContact(id, contact) {
  return ContactCollection.findByIdAndUpdate(id, contact);
}
