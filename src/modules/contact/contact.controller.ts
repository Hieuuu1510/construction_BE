import type { Request, Response } from "express";
import { ContactService } from "./contact.service.js";

const contactService = new ContactService();

export class ContactController {
  async getContacts(req: Request, res: Response) {
    try {
      const contacts = await contactService.findMany(req.query);
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ err_message: (error as Error).message });
    }
  }

  async getContact(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const contact = await contactService.findOne(id as string);
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ err_message: (error as Error).message });
    }
  }

  async createContact(req: Request, res: Response) {
    try {
      const contact = await contactService.create(req.body);
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ err_message: (error as Error).message });
    }
  }
}
