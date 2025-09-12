import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorMessage from "../common/ErrorMessage";
import Home from "../pages/home/Home";
import Cart from "../../pages/product/Cart";
import Checkout from "../../pages/product/Checkout";
import Login from "../auth/admin/admin-auth/Login";
import Dashboard from "../auth/admin/dashboard/Dashboard";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Product from "../../pages/product/Product";
import Categories from "../auth/admin/category/Categories";
import CreateCategory from "../auth/admin/category/CreateCategory";
import EditCategory from "../auth/admin/category/EditCategory";
import Brand from "../auth/admin/brand/Brands";
import EditBrand from "../auth/admin/brand/EditBrand";
import CreateBrand from "../auth/admin/brand/CreateBrand";
import CreateProduct from "../auth/admin/product/CreateProduct";
import EditProduct from "../auth/admin/product/EditProduct";
import Products from "../auth/admin/product/products";
import Shop from "../../pages/product/Shop";
import UserLogin from "../auth/user/user-auth/UserLogin";
import UserRegister from "../auth/user/user-auth/UserRegister";
import UserDashboard from "../auth/user/user-dashboard/UserDashboard";
import UserPrivateRoute from "./UserPrivateRoute";
import OrderConfirmation from "../../pages/product/OrderConfirmation";
import OrderSummery from "../../pages/product/OrderSummery";
import Order from "../auth/admin/order/Orders";
import OrderDetails from "../auth/admin/order/OrderDetails";
import UserOrder from "../auth/user/user-order/UserOrder";
import UserOrderDetails from "../auth/user/user-order/userOrderDetails";
import UserProfile from "../auth/user/user-profile/UserProfile";
import CreateShipping from "../auth/admin/shipping/CreateShipping";
import UserPasswordChange from "../auth/user/user-profile/UserPasswordChange";
import Courses from "../pages/course/Courses";
import CourseDetails from "../pages/course/CourseDetails";


export const router = createBrowserRouter([
    {
      path: "/",
      element:<Main/>,
      errorElement:<ErrorMessage/>,
      children: [
        {
            path:"/",
            element:<Home/>
        },
        {
          path:"/courses",
          element:<Courses/>
        },
        {
          path:"/course-details",
          element:<CourseDetails/>
        },
        {
          path:"/shop",
          element:<Shop/>
        },
        {
          path:"/product/:id",
          element:<Product/>
        },
        {
          path:"/cart",
          element:(
            <UserPrivateRoute>
             <Cart/>
            </UserPrivateRoute>
          )
        },
        {
          path:"/checkout",
          element:(
            <UserPrivateRoute>
             <Checkout/>
            </UserPrivateRoute>
           )
        },
        {
          path:"/order-confirmation/:id",
          element:(
            <UserPrivateRoute>
             <OrderConfirmation/>
            </UserPrivateRoute>
           )
        },
        {
          path:"/order-details/:id",
          element:(
            <UserPrivateRoute>
             <OrderSummery/>
            </UserPrivateRoute>
           )
        },

        //user routes here
        {
          path:"/account/user/login",
          element: <UserLogin />
        },
        {
          path:"/account/user/register",
          element:<UserRegister />
        },
        {
          path:"/account/user/dashboard",
          element: (
            <UserPrivateRoute>
              <UserDashboard />
            </UserPrivateRoute>
            ),
        },
        {
          path:"/account/user/orders",
          element: (
            <UserPrivateRoute>
              <UserOrder/>
            </UserPrivateRoute>
            ),
        },
        {
          path:"/account/user/order-details/:id",
          element: (
            <UserPrivateRoute>
              <UserOrderDetails/>
            </UserPrivateRoute>
            ),
        },
        {
          path:"/account/user/profile",
          element: (
            <UserPrivateRoute>
              <UserProfile/>
            </UserPrivateRoute>
            ),
        },
        {
          path:"/account/user/change-password",
          element: (
            <UserPrivateRoute>
              <UserPasswordChange/>
            </UserPrivateRoute>
            ),
        },

        //admin routes here
        {
          path:"/admin/login",
          element:<Login/>,
        },
        {
          path:"/admin/dashboard",
          element: (
          <AdminPrivateRoute>
            <Dashboard />
          </AdminPrivateRoute>
          ),
        },
        // categories routes is here
        {
          path:"/admin/categories",
          element: (
          <AdminPrivateRoute>
            <Categories/>,
          </AdminPrivateRoute>
          ),
        },
        {
          path:"/admin/categories/create",
          element: (
          <AdminPrivateRoute>
            <CreateCategory/>
          </AdminPrivateRoute>
          ),
        },
        {
          path:"/admin/categories/edit/:id",
          element: (
          <AdminPrivateRoute>
            <EditCategory/>
          </AdminPrivateRoute>
          ),
        },
        // brands routes is here
        {
          path:"/admin/brands",
          element: (
          <AdminPrivateRoute>
            <Brand/>
          </AdminPrivateRoute>
          ),
        },
        {
          path:"/admin/brands/create",
          element: (
          <AdminPrivateRoute>
            <CreateBrand/>
          </AdminPrivateRoute>
          ),
        },
        {
          path:"/admin/brands/edit/:id",
          element: (
          <AdminPrivateRoute>
            <EditBrand/>
          </AdminPrivateRoute>
          ),
        },
           // products routes is here
           {
            path:"/admin/products",
            element: (
            <AdminPrivateRoute>
              <Products/>,
            </AdminPrivateRoute>
            ),
          },
          {
            path:"/admin/products/create",
            element: (
            <AdminPrivateRoute>
              <CreateProduct/>
            </AdminPrivateRoute>
            ),
          },
          {
            path:"/admin/products/edit/:id",
            element: (
            <AdminPrivateRoute>
              <EditProduct/>
            </AdminPrivateRoute>
            ),
          },
          //  orders routes
          {
            path:"/admin/orders",
            element: (
            <AdminPrivateRoute>
              <Order/>
            </AdminPrivateRoute>
            ),
          },
          {
            path:"/admin/order-details/:id",
            element: (
            <AdminPrivateRoute>
              <OrderDetails/>
            </AdminPrivateRoute>
            ),
          },
          {
            path:"/admin/create-shipping",
            element: (
            <AdminPrivateRoute>
              <CreateShipping/>
            </AdminPrivateRoute>
            ),
          },
      ],
    },
  ]);
  