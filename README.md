## 📚 Flashmind

Flashmind is a **minimal, smart flashcard web app** built with **Next.js**, designed to help you study faster and smarter. Create custom decks, review flashcards, and get automatic suggestions for categories and tags using intelligent keyword analysis or AI.

&#x20;

---

### 🚀 Features

* ✍️ **Create & Edit Decks** – Add flashcards quickly and organize them into decks.
* 💡 **Smart Tagging** – AI or keyword-based category/tag suggestions.
* ⏱️ **Spaced Repetition** *(coming soon)* – Boost long-term retention.
* 🌃 **Dark Mode** – Study comfortably any time of day.
* 📱 **Responsive UI** – Works beautifully on desktop and mobile.

---

### 🧠 Tech Stack

| Tech                    | Description                        |
| ----------------------- | ---------------------------------- |
| Next.js                 | React Framework for SSR & routing  |
| Tailwind CSS            | Utility-first CSS styling          |
| TypeScript              | Strong typing for safety & clarity |
| MongoDB                 | Document-based database            |
| Express.js              | Backend API for flashcard data     |
| OpenAI API *(optional)* | Smart tag/category suggestions     |

---

### 🔧 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/clipworx/flashmind.git
   cd flashmind
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file for your frontend and `.env` for your backend:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   OPENAI_API_KEY=your-key-here
   MONGODB_URI=your-mongodb-uri
   ```

4. **Run the app**

   **Frontend:**

   ```bash
   npm run dev
   ```

   **Backend (from **\`\`** folder):**

   ```bash
   npm run start
   ```

---

### 📁 Folder Structure

```
flashmind/
├── components/         # Reusable React components
├── pages/              # Next.js routes
├── server/             # Express + MongoDB backend
├── styles/             # Tailwind & global CSS
├── utils/              # Utility functions
├── public/             # Static assets
└── README.md
```

---

### 🚣 Roadmap

*

---

### 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

### 📄 License

This project is licensed under the **MIT License**.

---

### 🙌 Acknowledgements

* [Next.js](https://nextjs.org)
* [Tailwind CSS](https://tailwindcss.com)
* [OpenAI](https://openai.com)
* [MongoDB](https://mongodb.com)
