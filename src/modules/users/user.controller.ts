import type { Request, Response } from "express";
import userService from "./user.service.js";
import type { IFilterUser, IUser } from "./user.interface.js";

class UserController {
  async getUsers(req: Request, res: Response) {
    const filter: IFilterUser = req.params;
    const user = await userService.getMany(filter);
    return res.status(200).json(user);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await userService.getById(id);
    return res.status(200).json(user);
  }

  async create(req: Request, res: Response) {
    const user: IUser = req.body;
    const resultCreate = await userService.create(user);
    return res.status(201).json(resultCreate);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const user: IUser = req.body;
    const resultUpdate = await userService.update(id, user);
    return res.status(200).json(resultUpdate);
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    const resultRemove = await userService.remove(id);
    return res.status(200).json(resultRemove);
  }
}

export default new UserController();
