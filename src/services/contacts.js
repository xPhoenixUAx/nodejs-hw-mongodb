import ContactCollection from "../db/models/Contact.js";

// export const getContacts = () => ContactCollection.find();
// export const getContactByID = (id) => ContactCollection.findById(id);
export async function getContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) {
  console.log(userId);
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactCollection.find({ userId });
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
export function getContactByID(_id, userId) {
  return ContactCollection.findOne({ _id, userId });
}
export function createContact(contact) {
  return ContactCollection.create(contact);
}
export function deleteContact(_id, userId) {
  return ContactCollection.findOneAndDelete({ _id, userId });
}
export async function replaceContact(_id, userId, contact) {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },
    contact,
    {
      new: true,
      upsert: true,
      includeResultMetadata: true,
    }
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
export function patchContact(_id, userId, contact) {
  return ContactCollection.findOneAndUpdate({ _id, userId }, contact, {
    new: true,
  });
}
