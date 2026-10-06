import {
  UsersRepository
} from '../repositories/users.repository.js';

import {
  UsersService
} from '../services/users.service.js';

import {
  pageLinks
} from '../utils/query.js';

export class UsersController {
  // No DI container in Topic 2.1: the controller
  // creates its own service (and the service's
  // repository). Methods are ARROW FUNCTIONS so
  // `this` survives Express calling them as
  // plain callbacks.
  constructor() {
    this.usersService =
      new UsersService(new UsersRepository());
  }

  list = async (req, res, next) => {
    try {
      const { data, meta } =
        await this.usersService.listUsers(
          req.query
        );

      res.json({
        data,
        meta,
        links: pageLinks(req, meta)
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user =
        await this.usersService.getUserById(
          req.params.id
        );

      res.json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const user =
        await this.usersService.createUser(
          req.body
        );

      res
        .status(201)
        .location(
          `${req.baseUrl}/${user.id}`
        )
        .json({
          data: user
        });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const user =
        await this.usersService.updateUser(
          req.params.id,
          req.body
        );

      res.json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.usersService.deleteUser(
        req.params.id
      );

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}