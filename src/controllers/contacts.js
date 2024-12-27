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
export async function createContactController(req, res) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavorite: req.body.isFavorite,
    contactType: req.body.contactType,
  };
  console.log(req.body);
  const result = await contactServices.createContact(contact);
  console.log(result);
  res.status(201).json({
    status: 201,
    message: "Successfully created contact!",
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const { id } = req.params;

  const result = await contactServices.deleteContact(id);
  if (!result) {
    throw new createHttpError.NotFound("Contact not found");
  }
  res.send({
    status: 200,
    message: "Successfully deleted contact!",
  });
}

export async function replaceContactController(req, res) {
  const { id } = req.params;
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavorite: req.body.isFavorite,
  };
  const result = await contactServices.replaceContact(id, contact);
  if (!result) {
    throw new createHttpError.NotFound("Contact not found");
  }
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: result.contact,
  });
  console.log(result);
  res.send({
    status: 200,
    message: "Successfully replaced a contact!",
    data: result,
  });
}
export async function patchContactController(req, res) {
  const { id } = req.params;
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavorite: req.body.isFavorite,
  };
  const result = await contactServices.patchContact(id, contact);
  if (!result) {
    throw new createHttpError.NotFound("Contact not found");
  }
  console.log(result);
  res.send({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
  });
}
