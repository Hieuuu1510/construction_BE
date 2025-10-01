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

  exportsContact(req: Request, res: Response) {
    try {
      const contact = contactService.exports(req.body);
      // cho client biết kiểu file
      res.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // attachment: file download, filename: ten file
      res.header("Content-Disposition", 'attachment; filename="Contact.xlsx"');

      res.status(200).send(contact);
    } catch (error) {
      res.status(500).json({ err_message: (error as Error).message });
    }
  }

  async importContacts(req: Request, res: Response) {
    try {
      const contacts = await contactService.imports(req.file);
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ err_message: (error as Error).message });
    }
  }
}
