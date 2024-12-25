import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
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
    throw new createHttpError.NotFound("Contact not found");
    // return res.status(404).json({
    //   status: 404,
    //   message: "Contact not found",
    // });
  }
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
}
