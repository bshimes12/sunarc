# ☀️ Sunarc

> **Visualize the sun's journey and compare solar noon across the seasons.**

Sunarc is a beautiful, interactive React application that helps you understand solar geometry. It calculates the sun's position for any given date and location, visualizing the "Sun Arc" and comparing today's peak sun altitude with the Summer Solstice.

---

## ✨ Features

-   **Solar Noon Calculation**: Instantly find the exact time of solar noon for your specific location.
-   **Solstice Comparison**: Discover the "Solstice Match" — the exact time on the Summer Solstice when the sun was at the same height as it is today at noon.
-   **Interactive Visualization**: A dynamic SVG visualization showing the sun's path across the sky (azimuth vs. altitude).
    -   🔵 **Blue Path**: Today's sun path.
    -   🟡 **Gold Path**: The Summer Solstice sun path.
-   **Geolocation Support**: Automatically detect your latitude and longitude or enter them manually.

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Solar Math**: [SunCalc](https://github.com/mourner/suncalc)
-   **Date Handling**: [date-fns](https://date-fns.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Styling**: CSS Modules / Native CSS

## 🚀 Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/bshimes12/sunarc.git
    cd sunarc
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📸 How it Works

1.  **Enter a Date & Location**: The app defaults to today and New York, but you can change this easily.
2.  **See the Math**: The app calculates the sun's maximum altitude (Solar Noon) for your selected date.
3.  **Visualize the Difference**: It then overlays this path against the Summer Solstice (the longest day of the year) to show you exactly how much lower the sun is today compared to its peak potential.

---

Made with ☀️ by [bshimes12](https://github.com/bshimes12)
