import ContactCollection from "../db/models/Contact.js";

// export const getContacts = () => ContactCollection.find();
// export const getContactByID = (id) => ContactCollection.findById(id);
export async function getContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  ownerId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactCollection.find({ ownerId });
  const [total, data] = await Promise.all([
    ContactCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPage = Math.ceil(total / perPage);

  return {
    data,
    page,
    perPage,
    totalItems: total,
    totalPages: totalPage,
    hasNextPage: totalPage - page > 0,
    hasPrevPage: page > 1,
  };
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
  return ContactCollection.findByIdAndUpdate(id, contact, { new: true });
}
