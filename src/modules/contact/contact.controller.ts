import type { Request, Response } from "express";
import contactService from "./contact.service.js";
import {
  ExportType,
  UploadMimeTypeFile,
} from "../../common/enums/export.enum.js";

class ContactController {
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

  async exportsContact(req: Request, res: Response) {
    const { type, data } = req.body;

    console.log(req.body);

    let contactsExport;
    try {
      switch (type) {
        case ExportType.CSV:
          contactsExport = contactService.exportsCSV(data);

          res.header("Content-Type", UploadMimeTypeFile.CSV);
          res.header(
            "Content-Disposition",
            'attachment; filename="Contact.csv"'
          );
          break;
        case ExportType.XLSX:
          contactsExport = contactService.exportsExcel(data);
          // cho client biết kiểu file
          res.header("Content-Type", UploadMimeTypeFile.XLSX);

          // attachment: file download, filename: ten file
          res.header(
            "Content-Disposition",
            'attachment; filename="Contact.xlsx"'
          );
          break;
        case ExportType.PDF:
          contactsExport = await contactService.exportsPDF(data);
          res.header("Content-Type", UploadMimeTypeFile.PDF);
          res.header(
            "Content-Disposition",
            'attachment; filename="Contact.pdf"'
          );
          break;
        default:
          break;
      }

      res.status(200).send(contactsExport);
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

export default new ContactController();
