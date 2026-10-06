import {
  badRequest,
  conflict,
  notFound
} from '../utils/http-error.js';

import {
  hashPassword
} from '../utils/password.js';

import {
  paginate,
  parsePagination,
  sortItems
} from '../utils/query.js';

const SORTABLE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'createdAt',
  'updatedAt'
];

export const ROLES = [
  'customer',
  'admin'
];

// Optional fields are stored as null so every
// user has exactly the same shape.
const withDefaults = (profile) => ({
  ...profile,
  phone: profile.phone ?? null,
  dateOfBirth: profile.dateOfBirth ?? null,
  address: profile.address ?? null
});

export class UsersService {
  // `hash` is injectable so unit tests can use a
  // fast fake instead of real scrypt.
  constructor(
    usersRepository,
    { hash = hashPassword } = {}
  ) {
    this.usersRepository = usersRepository;
    this.hash = hash;
  }

  // query = { search, role, sort, page, limit }
  // Note: this layer never sees `req` or `res`.
  async listUsers(query = {}) {
    const {
      page,
      limit
    } = parsePagination(query);

    let users =
      await this.usersRepository.findAll();

    if (query.search !== undefined) {
      if (typeof query.search !== 'string') {
        throw badRequest(
          'search must be a single string'
        );
      }

      const needle =
        query.search.trim().toLowerCase();

      if (needle) {
        users = users.filter((user) =>
          [
            user.firstName,
            user.lastName,
            user.email
          ].some((value) =>
            value.toLowerCase().includes(needle)
          )
        );
      }
    }

    if (query.role !== undefined) {
      if (
        typeof query.role !== 'string' ||
        !ROLES.includes(query.role)
      ) {
        throw badRequest(
          `role must be one of: ${ROLES.join(', ')}`
        );
      }

      users = users.filter(
        (user) => user.role === query.role
      );
    }

    users = sortItems(
      users,
      query.sort ?? 'lastName',
      SORTABLE_FIELDS
    );

    const result = paginate(users, {
      page,
      limit
    });

    return {
      ...result,
      data: result.data.map((user) =>
        this.#publicUser(user)
      )
    };
  }

  async getUserById(id) {
    const user =
      await this.usersRepository.findById(id);

    if (!user) {
      throw notFound(
        `User ${id} does not exist`
      );
    }

    return this.#publicUser(user);
  }

  // `role` is a second argument, NOT part of the
  // request body — only trusted code (seed, admin
  // tools) sets it. Clients can never choose.
  async createUser(
    data,
    { role = 'customer' } = {}
  ) {
    if (!ROLES.includes(role)) {
      throw badRequest(
        `role must be one of: ${ROLES.join(', ')}`
      );
    }

    await this.#assertEmailAvailable(data.email);

    const passwordHash =
      await this.hash(data.password);

    const {
      password: _password,
      ...profile
    } = data;

    const user =
      await this.usersRepository.create({
        ...withDefaults(profile),
        role,
        passwordHash
      });

    return this.#publicUser(user);
  }

  async updateUser(id, changes) {
    await this.getUserById(id);

    if (changes.email) {
      await this.#assertEmailAvailable(
        changes.email,
        id
      );
    }

    const updated =
      await this.usersRepository.update(
        id,
        changes
      );

    return this.#publicUser(updated);
  }

  async deleteUser(id) {
    await this.getUserById(id);

    await this.usersRepository.delete(id);

    return;
  }

  async #assertEmailAvailable(
    email,
    exceptId
  ) {
    const existing =
      await this.usersRepository.findByEmail(
        email
      );

    if (
      existing &&
      existing.id !== exceptId
    ) {
      throw conflict(
        `Email ${email} is already registered`
      );
    }
  }

  // The ONLY way a user leaves this service:
  // without the password hash.
  #publicUser(user) {
    const {
      password: _password,
      passwordHash: _passwordHash,
      ...publicUser
    } = user;

    return publicUser;
  }
}