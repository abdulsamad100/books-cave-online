import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Routechecker from './Routes/Routechecker';
import AnotherChecker from './Routes/AnotherChecker';
import CustomThemeProvider from './context/ThemeContext';
import NotFound from './components/NotFound';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import IntroText from './components/IntroText';
import AddNewBook from './components/AddNewBook';
import MyBooks from './components/MyBooks';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<IntroText />} />
      <Route element={<AnotherChecker />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-new-book" element={<AddNewBook />} />
        <Route path="mybooks" element={<MyBooks />} />
      </Route>
      <Route element={<Routechecker />}>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider >
        <RouterProvider router={router} />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;
