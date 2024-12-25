import * as contactServices from "../services/contacts.js";
export async function getContactsController(req, res) {
  const data = await contactServices.getContacts();

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
}
export async function getContactByIdController(req, res) {
  const { id } = req.params;
  const data = await contactServices.getContactByID(id);
  if (!data) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
    });
  }
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
}
