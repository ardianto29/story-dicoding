import HomePage from "../pages/home-page.js";
import AboutPage from "../pages/about-page.js";
import LoginPage from "../pages/login-page.js";
import RegisterPage from "../pages/register-page.js";
import AddStoryPage from "../pages/add-story-page.js";
import DetailPage from "../pages/detail-page.js";
import NotFoundPage from "../pages/not-found-page.js";
import FavoritesPage from "../pages/favorites-page.js";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/favorites": new FavoritesPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add-story": new AddStoryPage(),
  "/stories/:id": new DetailPage(),
  "/detail/:id": new DetailPage(),
  "/404": new NotFoundPage()
};

export default routes;
