# BankingApp

## Setup

- Install Prettier for vscode

```sh
$ make setup
```

## Get started

```sh
# Start server side
$ npm start

# Open new terminal window

# Start client side
$ cd frontend
$ npm run dev
```

## Coding Guideline

- Styling
  - Styling must be done with TailwindCSS.
    - https://tailwindcss.com/
  - Prefix for id attribute must be put to avoid id conflicts.
    - e.g. sec-new-account => id="na-XXX-XXX"
  - If you want add or change styles outside of section, Let us know.
- Git
  - You must create branch from main and make PR to merge it into main.
  - Branch name would be having "feat/" or "feat-" etc... prefix.
