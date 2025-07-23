This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# DevFlow

DevFlow — это современное приложение для управления задачами, заметками и совместной работы, построенное на Next.js, MongoDB и современном UI.

## Основные возможности

- **Дашборд задач (TaskBoard):**
  - Drag&Drop канбан-доска (TODO, В процессе, Выполнено)
  - Приоритеты, сроки, теги, описание, документация
  - Только участники из PROMO_FIT видят и могут редактировать общие задачи друг друга
  - Остальные пользователи видят только свои задачи
- **Заметки:**
  - CRUD заметок с тегами
- **Календарь:**
  - Просмотр задач по датам
- **Аутентификация:**
  - NextAuth (email+password, Telegram)
- **Тёмная/светлая тема**

## Быстрый старт

1. **Установите зависимости:**
   ```bash
   yarn install
   # или npm install
   ```
2. **Настройте переменные окружения:**
   Создайте файл `.env.local` и добавьте:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   NEXT_PUBLIC_PROMO_FIT=mail1@email.com,mail2@email.com
   ```
   - `NEXT_PUBLIC_PROMO_FIT` — список email через запятую, кто видит общий дашборд

3. **Запустите dev-сервер:**
   ```bash
   yarn dev
   # или npm run dev
   ```
   Откройте [http://localhost:3000](http://localhost:3000)

4. **Сборка и запуск в production:**
   ```bash
   yarn build && yarn start
   ```

## Технологии
- Next.js 14 (App Router)
- MongoDB + Mongoose
- NextAuth
- Zustand (стейт-менеджмент)
- TailwindCSS + shadcn/ui
- Framer Motion (анимации)
- TypeScript

## Архитектура
- Все API-роуты — в `app/api/`
- Модели — в `models/`
- Сторы Zustand — в `store/`
- UI-компоненты — в `components/`
- Контексты — в `contexts/`

## Особенности
- Общие задачи для PROMO_FIT: если email пользователя в списке, его задачи видят все из этого списка
- Остальные пользователи видят только свои задачи
- Современный адаптивный интерфейс

---

_Проект создан для продуктивной совместной работы и личной эффективности!_
