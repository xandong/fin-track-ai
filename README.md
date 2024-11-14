# Fintrack AI Project

Fintrack is a personal finance management application built with [Next.js](https://nextjs.org), designed to help users track their spending, manage budgets, and gain insights into financial habits. Acting as a comprehensive financial companion, Fintrack offers seamless budget tracking, expense categorization, and insightful financial reports. Leveraging modern web development practices, this project ensures a smooth, efficient user experience and enables reliable performance and rapid feature development, making financial management easier and more accessible.

## Technologies used:

- **React** to build an interactive and responsive interface
- **Next.js** for SSR, dynamic routing, and backend actions
- **TypeScript** to provide strong typing and code safety
- **TailwindCSS** for styling
- **Prisma** as an ORM to simplify database management
- **Clerk** for streamlined and secure authentication
- **OpenAI** to generate reports using **ChatGPT**
- **Stripe** to handle payment integrations and subscription plans
- **Docker** integration for development and PostgreSQL as a local database

## Features

This template includes the following features:

Fintrack includes the following features to ensure code quality, streamline development, and enhance user experience:

- **Expense Tracking**: Easily categorize and track all your expenses.
- **Budget Management**: Set budgets for specific categories and monitor spending.
- **Analytics Dashboard**: Visualize your financial data with charts and summaries.
- **Code Quality Tools**:
  - **[Husky](https://typicode.github.io/husky/)**: Git hooks for pre-commit and pre-push to maintain code quality.
  - **Linting**: Consistent coding style with ESLint.
  - **Testing**:
    - **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** and **[Jest](https://jestjs.io/)** for unit and integration testing.
- **UI Component Library**:
  - **[Storybook](https://storybook.js.org/)**: A tool for developing and testing components in isolation.
- **Automated CI Workflows with GitHub Actions**: Continuous integration with automated tests and linting on every push and pull request.
- **[Plop](https://plopjs.com/)**: Generate boilerplate code for new components quickly.


## Getting Started

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Open http://localhost:3000 in your browser to view the application.

You can edit the main page by modifying app/page.tsx. The page auto-updates as you save changes.

## Setup

### Husky

Husky is configured to run pre-commit hooks for linting and testing. Make sure to install Husky’s hooks by running:

```
npx husky init
```

### Linting

Run the following command to check code formatting and syntax:

```
npm run lint
```

### Testing

Use Jest and React Testing Library for unit and integration tests:

```
npm run test
```

### Storybook

Storybook allows you to explore and document UI components in isolation. To start Storybook, run:

```
npm run storybook
```

### Plop

Generate new components using Plop:

```
npm run plop
```
or
```
npx plop
```

Follow the prompts to quickly create files with predefined templates.

## CI/CD Workflows

This project includes GitHub Actions workflows for continuous integration, running tests and linting on each push and pull request. Check .github/workflows for configuration details.

## Deploy on Vercel

Check out the [Demo](https://fintrack.ventus.company) for more details.
