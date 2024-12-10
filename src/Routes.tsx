import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import News from "./pages/News";
import Studies from "./pages/Studies";
import Login from "./pages/Login";
import Cart from "./pages/Cart";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/news" element={<News />} />
      <Route path="/studies" element={<Studies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
    </RouterRoutes>
  );
};

export default Routes;