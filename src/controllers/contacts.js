import * as fs from "node:fs/promises";
import path from "node:path";
import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsPaginationParams.js";
import { parseSortParams } from "../utils/parsSortParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  console.log({ sortBy, sortOrder });
  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    ownerId: req.user.id,
  });

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
  }
  if (data.ownerId.toString() !== req.user.id.toString()) {
    throw new createHttpError.Forbidden(
      "You are not allowed to access this contact"
    );
  }
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
}
export async function createContactController(req, res) {
  let avatar = null;
  if (typeof req.file !== "undefined") {
    if (process.env.ENABLE_CLOUDINARY === "true") {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      avatar = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve("src", "public", "avatars", req.file.filename)
      );
      avatar = `http://localhost:3000/avatars/${req.file.filename}`;
    }
  }
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavorite: req.body.isFavorite,
    contactType: req.body.contactType,
    ownerId: req.user.id,
    avatar,
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
  res.status(204).json({
    status: 204,
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
