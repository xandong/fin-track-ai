# Next.js Project Template

This is a customizable [Next.js](https://nextjs.org) project template, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with additional tools for streamlined development, testing, and deployment.

## Features

This template includes the following features:

- **[Husky](https://typicode.github.io/husky/)**: Enables pre-commit and pre-push Git hooks for consistent code quality.
- **Linting**: Ensures consistent coding style across the project with ESLint.
- **Testing**:
  - **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** and **[Jest](https://jestjs.io/)**: Setup for unit and integration testing.
- **[Storybook](https://storybook.js.org/)**: A UI component explorer for creating and documenting isolated components.
- **CI Workflows with GitHub Actions**: Automated testing and linting workflows configured to run on each push and pull request.
- **[Plop](https://plopjs.com/)**: Tool for quickly generating component boilerplate with customizable templates.

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
npx husky install
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
