# SnapCut AI Backend

AI-powered background removal API built with Node.js and Express.

## Tech Stack
- **Server:** Node.js, Express
- **File Handling:** Multer
- **API Requests:** Axios, Form-Data
- **Security:** Helmet, CORS, Express-rate-limit

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   PORT=5000
   REMOVE_BG_API_KEY=your_actual_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Endpoints

### Health Check
`GET /health`
Returns server status.

### Remove Background
`POST /remove-bg`
Expects `multipart/form-data` with `image` field.
Returns processed `image/png`.

## Frontend Integration Example

```javascript
const removeBackground = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://localhost:5000/remove-bg", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("API Error");

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
  }
};
```
