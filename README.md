# SakhiAI - Your AI PDF Chat Assistant

SakhiAI is a modern web application that transforms PDF documents into interactive conversations using advanced AI technology. Users can upload PDFs and engage in natural conversations to extract insights, analyze content, and get instant answers.

![SakhiAI Demo](public/demo.gif)

## 🌟 Features

- **AI-Powered Chat**: Natural conversations with your PDF documents
- **Smart PDF Processing**: Quick and accurate document analysis
- **Secure & Private**: Enterprise-grade security for your documents
- **24/7 Access**: Chat with your documents anytime, anywhere
- **User Authentication**: Secure login and user management
- **Pro Subscription**: Advanced features for power users

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: DrizzleORM with PostgreSQL
- **Authentication**: Clerk
- **AI Integration**: Gooogle Gemini API
- **File Storage**: AWS S3
- **Styling**: Shadcn UI Components
- **Payment**: Stripe Integration

## 🛠️ Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/sakhi-ai.git
```

2. Install dependencies:

```
pnpm install
```

3. Configure your environment variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/fallback
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/


# Database
DATABASE_URL=

# AWS S3
NEXT_PUBLIC_S3_ACCESS_KEY_ID=
NEXT_PUBLIC_S3_SECRET_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME=

# PINECONE
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=


# LLMS
GEMINI_API_KEY=

# STRIPE

STRIPE_PUBLISHABLE_KEY=
STRIPE_API_KEY=
WEBHOOK_SIGNING_SECRET=
NEXT_BASE_URL=
```

4. Run the development server:

```bash
pnpm run dev
```

## 📚 Usage

1. Sign up for an account
2. Upload your PDF document
3. Start chatting with your document
4. Get instant answers and insights

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Google Gemini](https://ai.google.dev/)
- [Clerk](https://clerk.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Youtube](https://https://www.youtube.com/watch?v=bZFedu-0emE)

## 📧 Contact

Vikas Wakde - [@yourtwitter](https://x.com/vikaswakde42)

Project Link: [https://github.com/vikaswakde/sakhi-ai](https://github.com/vikaswakde/sakhi-ai)

---

Built with ❤️ by vikas Wakde
