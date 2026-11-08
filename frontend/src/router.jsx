import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { CheckoutLayout, MainLayout, RequireAuth } from '@/components/layout/Layouts'

// Mỗi trang một chunk, tải theo nhu cầu.
const HomePage = lazy(() => import('@/pages/HomePage'))
const DepartmentPage = lazy(() => import('@/pages/DepartmentPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'))
const OrderTrackingPage = lazy(() => import('@/pages/OrderTrackingPage'))
const StoresPage = lazy(() => import('@/pages/StoresPage'))
const StoreDetailPage = lazy(() => import('@/pages/StoreDetailPage'))
const NewsletterPage = lazy(() => import('@/pages/NewsletterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const RecyclePage = lazy(() => import('@/pages/RecyclePage'))
const ClubPage = lazy(() => import('@/pages/ClubPage'))
const InfoPage = lazy(() => import('@/pages/InfoPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'))
const AccountOverviewPage = lazy(() => import('@/pages/account/OverviewPage'))
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'))
const MembershipPage = lazy(() => import('@/pages/account/MembershipPage'))
const SettingsPage = lazy(() => import('@/pages/account/SettingsPage'))
const DetailsPage = lazy(() => import('@/pages/account/DetailsPage'))
const SubscriptionsPage = lazy(() => import('@/pages/account/SubscriptionsPage'))

const DEPARTMENTS = ['nu', 'nam', 'tre-em', 'nha', 'lam-dep']

export const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        ...DEPARTMENTS.map((d) => ({ path: d, element: <DepartmentPage department={d} /> })),
        { path: 'c/:slug', element: <CategoryPage /> },
        { path: 'p/:slug', element: <ProductPage /> },
        { path: 'tim-kiem', element: <SearchPage /> },
        { path: 'yeu-thich', element: <WishlistPage /> },
        { path: 'gio-hang', element: <CartPage /> },
        { path: 'dat-hang-thanh-cong/:number', element: <OrderConfirmationPage /> },
        { path: 'theo-doi-don-hang', element: <OrderTrackingPage /> },
        { path: 'cua-hang', element: <StoresPage /> },
        { path: 'cua-hang/:slug', element: <StoreDetailPage /> },
        { path: 'dang-ky-nhan-tin', element: <NewsletterPage /> },
        { path: 'quen-mat-khau', element: <ForgotPasswordPage /> },
        { path: 'dat-lai-mat-khau', element: <ResetPasswordPage /> },
        { path: 'doi-cu-lay-moi', element: <RecyclePage /> },
        { path: 'nep-club', element: <ClubPage /> },
        { path: 'thong-tin/:slug', element: <InfoPage /> },
        {
          path: 'tai-khoan',
          element: (
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          ),
          children: [
            { index: true, element: <AccountOverviewPage /> },
            { path: 'don-hang', element: <OrdersPage /> },
            { path: 'don-hang/:number', element: <OrderDetailPage /> },
            { path: 'thanh-vien', element: <MembershipPage /> },
            { path: 'cai-dat', element: <SettingsPage /> },
            { path: 'cai-dat/thong-tin', element: <DetailsPage /> },
            { path: 'cai-dat/nhan-tin', element: <SubscriptionsPage /> },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      element: <CheckoutLayout />,
      children: [{ path: 'thanh-toan', element: <CheckoutPage /> }],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
