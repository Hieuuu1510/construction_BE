import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {}
