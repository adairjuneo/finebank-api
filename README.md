# finebank.io API 🏦💰

API service for a Financial Management Dashboard
This api service its build for learn in real life S.O.L.I.D principles, how we can apply those concepts in a real life use case.
Whats the challenges and how difficult is to apply some like this for build APIs.

| Abbreviation                  | Explanation                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **S** (Single responsibility) | Each class or module have to do one unique responsibility very clear.                                                     |
| **O** (Open/Close)            | The entities of software(class, modules, functions) have to open to expansion, but closed to modifications.               |
| **L** (Liskov Substitution)   | Objects of one **derivate class** have to permit make changes on objects of the base class, but not to change the system. |
| **I** (Interface Segregation) | Interfaces more specifics and focus, its better than interfaces bigger and generics.                                      |
| **D** (Dependency Inversion)  | Make dependencies of abstractions and not concrete implementations.                                                       |

## RFs (Functional Requirements)

The functional requirements is the specifics functionalities about what the system provides. Down bellow its the requirements this system.
What the user can or not to do in the app. This requirements are easy defined when the client or team create the product inside a company/software house. **The user can/not can...** or **The entity can/not can do...**.

- [x] Should be able to new users register;
- [x] Should be able to authenticate;
- [x] Should be able to request and recover user password;
- [x] Should be able to get a user profile when authenticated;
- [x] Should be able to create new payment methods;
- [x] Should be able to update payment method;
- [x] Should be able to list payment methods;
- [x] Should be able to delete payment method;
- [x] Should be able to create new transactions;
- [ ] Should be able to update transaction;
- [x] Should be able to list transactions;
- [ ] Should be able to delete transaction;
- [ ] Should be able to create new transaction category;
- [ ] Should be able to update transaction category;
- [ ] Should be able to list transaction categories;
- [ ] Should be able to delete transaction category;
- [ ] Should be able to get metrics with the list of last six(6) transactions per type(six revenues and six expenses);
- [ ] Should be able to get metrics with the total of all transactions from the last seven(7) days, compared to the last week;
  - [ ] This route its for show the user metrics about your transactions per week in compare with the last one.
- [ ] Should be able to get metric to receive the last six(6) more used categories in current month, compared to the last one;
  - [ ] This route its for show the user metrics about your six(6) more used categories.
- [ ] 🟡 Should be able to schedule revenues or expenses to management in the future.
- [ ] 🟡 Should be able to receive notifications about scheduled registers or important things in app.

- [ ] Should be able to ...;
- [ ] Should not be able to ...;

## RNs (Business Rules)

The business rules describe how the software must be operate inside the commercial and organizational guidelines.
Paths about each rule can or not follow, this paths determined what conditions those requirements can or not been executed. **The user can/not can...** or **The entity can/not can do...**.

- [x] The user can not be able to register with duplicate email;
- [ ] The user can not be able to request two passwords recoveries at same time;
- [x] The user can not be able to create payment methods with same description;
- [ ] The user can be able to change your personal informations in app.
- [ ] 🟡 The user can be able to change your profile picture.

- [ ] The user can be able to ...;
- [ ] The entity can not be able to ...;

## RNFs (Non functional requirements)

The non functional requirements define attributes about the system, like to performance, security and maintainability.

- [x] In authentication by user, we need identify the authentication by JWT(JSON Web Token);
- [x] The user password must be encrypted samehow, should not be stored raw;
- [x] All data must be stored in a PostgreSQL database;
- [x] All routes that return a list, neeed to be paginated with twenty(20) records;

- [ ] The system have to ...;
- [ ] The software have to ...;

#### Sponsors 🤝

[fastify](https://github.com/fastify/fastify)
[prisma](https://github.com/prisma/prisma)

---

_This repository is part of my practical studies about **Software Engineering** and development._
[dev-juneo](https://github.com/adairjuneo)
