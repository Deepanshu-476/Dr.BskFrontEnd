import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Fever from "./Pages/Fever/Fever";
import ProductPage from "./Pages/ProductPage/ProductPage";
import FranchiseBanner from "./Pages/FranchiseBanner/FranchiseBanner";
import EditProfile from "./Pages/EditProfile/EditProfile";
import OrderPage from "./Pages/OrderPage/OrderPage";
import PatientsPage from "./Pages/PatientsPage/PatientsPage";
import NotificationsPage from "./Pages/NotificationsPage/NotificationsPage";
import ConsultationsPage from "./Pages/ConsultationsPage/ConsultationsPage";
import Landing from "./Pages/Landing/Landing";
import Head from "./Pages/Head/Head";
import Cart from "./Pages/Cart/Cart";
import Prescription from "./Pages/Prescription/Prescription";
import Phone from "./Pages/Phone/Phone";

import AddToCart from "./components/AddToCart";
import OrderSuccessModal from "./components/success";
import SingleProductCheckout from "./components/Singleproductbuy";

import PharmaAdmin from "./Pages/pharma-admin/page/PharmaAdmin";
import PharmaDashboard from "./Pages/pharma-admin/component/PharmaDashboard";
import PharmaCategory from "./Pages/pharma-admin/component/PharmaCategory";
import PharmaProducts from "./Pages/pharma-admin/component/PharmaProducts";
import AddNewProduct from "./Pages/pharma-admin/component/AddNewProduct";
import PharmaBanner from "./Pages/pharma-admin/component/PharmaBanner";
import PharmaUser from "./Pages/pharma-admin/component/PharmaUser";
import PharmaSetting from "./Pages/pharma-admin/component/PharmaSetting";
import PharmaSubCategory from "./Pages/pharma-admin/component/PharmaSubCategory";
import PharmaOrder from "./Pages/pharma-admin/component/PharmaOrder";
import MyChart from "./Pages/pharma-admin/component/Mychart";
import PharmaWholeSale from "./Pages/pharma-admin/component/PharmaWholeSale";
import PharmaAdminLogin from "./Pages/pharma-admin/page/PharmaAdminLogin";
import ProtectedRoute from "./Pages/pharma-admin/page/ProtectedRoute";
import CouponManagement from "./Pages/pharma-admin/component/CouponManagement";
import PaymentSettings from "./Pages/pharma-admin/component/PaymentSettings";
import PharmaPrescription from "./Pages/pharma-admin/component/PharmaPrescription";


import AboutUs from "./Pages/footerLinksPages/AboutUs";
import ContactusForm from "./Pages/footerLinksPages/ContactusForm";
import PhotoGallery from "./Pages/footerLinksPages/PhotoGallery";
import Testimonial from "./Pages/footerLinksPages/component/Testimonial";
import VideoGallery from "./Pages/footerLinksPages/VideoGallery";
import Blogs from "./Pages/footerLinksPages/Blogs";
import BlogCardDetail from "./Pages/footerLinksPages/BlogCardDetail";
import Terms from "./Pages/footerLinksPages/Terms";
import Privacy from "./Pages/footerLinksPages/Privacy";
import ShippingPolicy from "./Pages/footerLinksPages/ShippingPolicy";
import ReturnsPolicy from "./Pages/footerLinksPages/ReturnsPolicy";

import { MobileBottomNav } from "./components/MobileBottomNav";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/homepage" element={<Dashboard />} />
        <Route path="/success" element={<OrderSuccessModal />} />
        <Route path="/fever" element={<Fever />} />
        <Route path="/fever/:id" element={<Fever />} />
        <Route path="/ProductPage/:id" element={<ProductPage />} />
        <Route path="/wholesaleInquiry" element={<FranchiseBanner />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/OrderPage" element={<OrderPage />} />
        <Route path="/PatientsPage" element={<PatientsPage />} />
        <Route path="/NotificationsPage" element={<NotificationsPage />} />
        <Route path="/ConsultationsPage" element={<ConsultationsPage />} />
        <Route path="/Head" element={<Head />} />
        <Route path="/login" element={<Cart />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/checkout" element={<SingleProductCheckout />} />
        <Route path="/Prescription" element={<Prescription />} />
        <Route path="/Phone" element={<Phone />} />
        <Route path="/subcategory/:subCategoryName" element={<Fever />} />

        {/* footer pages */}
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactusForm />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/photo" element={<PhotoGallery />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/return" element={<ReturnsPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/video" element={<VideoGallery />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogCardDetail" element={<BlogCardDetail />} />

        {/* admin panel */}
        <Route path="/admin-login" element={<PharmaAdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/pharma-admin" element={<PharmaAdmin />}>
            <Route path="dashboard" element={<PharmaDashboard />} />
            <Route path="category" element={<PharmaCategory />} />
            <Route path="subCategory" element={<PharmaSubCategory />} />
            <Route path="orders" element={<PharmaOrder />} />
            <Route path="products" element={<PharmaProducts />} />
            <Route path="addNewProduct" element={<AddNewProduct />} />
            <Route path="addNewProduct/:id" element={<AddNewProduct />} />
            <Route path="banner" element={<PharmaBanner />} />
            <Route path="user" element={<PharmaUser />} />
            <Route path="settings" element={<PharmaSetting />} />
            <Route path="chart" element={<MyChart />} />
            <Route path="wholesale" element={<PharmaWholeSale />} />
            <Route path="prescriptions" element={<PharmaPrescription />} />
            <Route path="couponManagement" element={<CouponManagement />}/>
            <Route path="PaymentSettings" element={<PaymentSettings />} />


          </Route>
        </Route>
      </Routes>

      <div className="pt_h"></div>
      <MobileBottomNav />
    </>
  );
}

export default App;
