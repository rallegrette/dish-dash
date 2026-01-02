# Dish Dash

**Dish Dash** is a web application that connects restaurants and cafes with surplus food to customers seeking discounted meals. The platform reduces food waste while providing affordable dining options.

<img width="375" height="348" alt="Screenshot 2026-01-02 at 10 26 33 AM" src="https://github.com/user-attachments/assets/7edab65b-0ffd-4979-9f52-cd2bcf1d6e71" />


---

## Features

- **Browse Available Meals** – Users can view discounted meals from nearby restaurants and bakeries.  
- **Search & Filter** – Find meals by cuisine, price, or restaurant.  
- **Favorites** – Users can save preferred meals for easy access later.  
- **Real-time Updates** – New discounted meals appear as they become available.  
- **User-friendly Interface** – Simple navigation for a smooth experience.

---

## Tech Stack

- **Backend:** Python, Pandas  
- **Frontend:** Vue.js (if applicable)  
- **Database:** (e.g., SQLite or PostgreSQL, if applicable)  
- **Other Tools:** Excel ingestion pipeline, AI-assisted variance notes, outlier flagging  

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/dish-dash.git
   cd dish-dash
   ```
2. Create a virtual environment (optional but recommended):
 ```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```
3. Install dependencies:
 ```bash
pip install -r requirements.txt
```
4. Run the application:
 ```bash
python app.py
```
---

## Usage 
- Open the app in your browser at http://localhost:5000 (or your configured port).
- Browse meals, search and filter by your preferences, and add favorites for quick access.
---
## Known Issues & Improvements
- Meal Images may not always load – This can happen if the image URLs are broken or temporarily unavailable. Possible improvements:

  - Validate image URLs before displaying.

  - Cache images locally for faster and more reliable loading.

  - Add a placeholder image when the original fails to load.
- Future Improvements:
  - Add user authentication and profiles.

  - Implement notifications for newly added discounted meals.

  - Improve search algorithm for better filtering and sorting.

  - Mobile-friendly responsive design.
---
## Contributing
Contributions are welcome! Please open an issue or submit a pull request for improvements, bug fixes, or new features.
