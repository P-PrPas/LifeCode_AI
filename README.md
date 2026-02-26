# Life Code Matrix & AI Analysis Platform

![Life Code Matrix UI Placeholder](https://via.placeholder.com/800x400?text=Life+Code+Matrix+UI)

Life Code Matrix is a modern web application designed to calculate, visualize, and analyze your personal "Life Code" based on the Thai Calendar (Inner World) and Chinese Calendar (Outer World) birth dates. The app calculates your core digits, detects active combo lines, and uses **Google Gemini AI** to provide an in-depth reading of your personality, traits, and internal conflicts.

## 🌟 Key Features

- **Dual-Calendar Calculation:** Calculate your Gift Number and Life Code independently for your Inner World (Thai Calendar) and Outer World (Chinese Calendar).
- **Matrix Visualization:** A beautiful 3x3 grid UI that visually represents your core numbers.
- **Accurate Shape Scoring:**
  - 🟢 **Circles** = Matches Base DOB digits (1 point)
  - 🔺 **Triangles** = Matches Gift Number digits (3 points)
  - 🟥 **Squares** = Matches Life Code digits (5 points)
- **Combo Detection:** Automatically spots powerful number combinations (e.g., 1-2-3 for communication, 4-8 for business prowess).
- **Gemini AI Analysis:** Reads the output data of both your Inner and Outer worlds to explain who you are, what your talents are, and highlight any "Conflicts" between how you think vs. how you act.
- **Fully Dockerized:** Spin up the entire stack with a single command.

## 🚀 Tech Stack

### Frontend

- **React 18 & Next.js 14** (App Router)
- **Tailwind CSS v3** (with custom Glassmorphism & custom utility classes)
- **Framer Motion** (for smooth micro-animations)
- **Lucide React** (beautiful default icons)

### Backend

- **Python 3.11 & FastAPI**
- **Pydantic** (Data validation & API Schema)
- **google-genai** (Google Gemini API SDK)
- **Uvicorn** (High-performance ASGI server)

---

## 🛠️ Getting Started (Docker)

The absolute easiest way to get this project running is by using Docker Compose.

### Prerequisites

1. [Docker & Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/[YOUR-USERNAME]/LifeCode_AI.git
   cd LifeCode_AI
   ```

2. **Setup your Environment Variables:**
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and paste your actual `GEMINI_API_KEY`:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

3. **Start the Application:**

   ```bash
   docker-compose up --build -d
   ```

4. **Access the App:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 Local Development (Without Docker)

If you prefer to run the components locally without Docker for development purposes:

### 1. Backend Setup

```bash
cd backend

# Create and sync virtual environment with uv
uv sync

# Run FastAPI server
uv run uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies using bun
bun install

# Run Next.js Dev Server
bun run dev
```

---

## 🧮 How the Calculation Works

1. **Base Digits:** Extracts every single digit from your `YYYY-MM-DD` date.
2. **Gift Number:** Adds all the Base Digits together. (e.g., `2005-10-26` -> 2+0+0+5+1+0+2+6 = 16)
3. **Life Code:** Recursively adds the Gift Number digits until a single digit remains. (e.g., 16 -> 1 + 6 = 7)
4. **Combo Verification:** Checks if your active numbers align to form combinations like:
   - `1-2-3` (Communication)
   - `4-5-6` (Gathering/Networking)
   - `7-8-9` (Great Fortuna)
   - `1-5-9` (Diligence)
   - _etc._

## 📜 License

This project is licensed under the MIT License.
