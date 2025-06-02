This is a very basic API backend service implemented in [Next.js](https://nextjs.org) project, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and manually customized.

This template offers the following:

- Integration with `prisma` ORM to perform data operations with an underlying DB (default `PostgreSQL` from [Neon](https://neon.com/)).
- A very simple auth middleware to enforce API-key access (see `/src/middleware.ts` and `/src/services/auth.ts`)
- A sample implementation of simple `GET` & `POST` APIs for querying and inserting a record.
  - Update and delete operations are not implemented in this template, but customizing it yourself should be manageable.
- Integration with `zod` for request-body validations and sanitization.
- A sample `.env.local` file as been defined for you (only the keys are defined, you will need to add in the intended values yourself).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
