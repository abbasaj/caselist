import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, getCountFromServer, deleteField } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Define the App component which will serve as the root for our entire application.
// All other components will be rendered within this component.
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('client'); // Default to client role
  const [loading, setLoading] = useState(true);
  const [firebase, setFirebase] = useState(null);

  // Firestore DB initialization and authentication
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const functions = getFunctions(app);

        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }

        setFirebase({ app, auth, db, functions, appId });
        setLoading(false);
      } catch (e) {
        console.error("Firebase initialization error:", e);
      }
    };

    initializeFirebase();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  // --- Navbar Component ---
  const Navbar = ({ links, logoText }) => {
    return (
      <nav className="flex justify-between items-center bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v17.25m0 0a2.25 2.25 0 0 1-2.25 2.25H9M12 20.25a2.25 2.25 0 0 0 2.25 2.25h2.25M12 20.25v-18A2.25 2.25 0 0 0 9.75 0h-1.5A2.25 2.25 0 0 0 6 2.25v18m6-18c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5m0-9a4.5 4.5 0 0 0-4.5 4.5M6 14.25a2.25 2.25 0 0 0-2.25 2.25v2.25a2.25 2.25 0 0 0 2.25 2.25h12.75a2.25 2.25 0 0 0 2.25-2.25v-2.25a2.25 2.25 0 0 0-2.25-2.25H6z"
            />
          </svg>
          <span className="text-2xl font-bold">{logoText}</span>
        </div>
        <div className="flex flex-grow justify-end space-x-4 items-center">
          <div className="hidden sm:flex space-x-4">
            {links.map((link) => (
              <button key={link.name} onClick={() => setCurrentPage(link.page)} className="hover:text-gray-300 transition duration-150 ease-in-out">
                {link.name}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-md hover:bg-blue-700 transition duration-150 ease-in-out">
            Login / Sign Up
          </button>
        </div>
      </nav>
    );
  };

  // --- Footer Component ---
  const Footer = () => {
    return (
      <footer className="w-full bg-gray-900 text-gray-300 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto text-center text-sm space-y-2">
          <p>
            &copy; {new Date().getFullYear()} Caselist. All rights reserved.
          </p>
          <p className="max-w-prose mx-auto">
            Disclaimer: The information provided on this platform is for general informational purposes only and does not constitute legal advice. While we strive to provide accurate and up-to-date information, it may not be applicable to your specific legal situation. You should not rely on this information as a substitute for professional legal counsel.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#terms-of-service" className="hover:text-white transition duration-150 ease-in-out">
              Terms of Service
            </a>
            <a href="#privacy-policy" className="hover:text-white transition duration-150 ease-in-out">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    );
  };

  // --- Page Component (Home Page Content) ---
  const Page = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-20 w-auto text-blue-600 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v17.25m0 0a2.25 2.25 0 0 1-2.25 2.25H9M12 20.25a2.25 2.25 0 0 0 2.25 2.25h2.25M12 20.25v-18A2.25 2.25 0 0 0 9.75 0h-1.5A2.25 2.25 0 0 0 6 2.25v18m6-18c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5m0-9a4.5 4.5 0 0 0-4.5 4.5M6 14.25a2.25 2.25 0 0 0-2.25 2.25v2.25a2.25 2.25 0 0 0 2.25 2.25h12.75a2.25 2.25 0 0 0 2.25-2.25v-2.25a2.25 2.25 0 0 0-2.25-2.25H6z"
            />
          </svg>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight">
            Caselist
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your modern pocket lawyer
          </p>
        </div>
        <div className="w-full max-w-xl">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search for legal information in Singapore..."
              className="flex-grow p-4 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
            <button className="p-4 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out">
              Chat with GPT
            </button>
            <button className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out">
              I'm feeling lucky
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Dashboard Placeholder Component ---
  const Dashboard = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Client Dashboard
        </h2>
        <p className="mt-4 text-gray-600">
          This is a placeholder for your client dashboard.
        </p>
      </div>
    );
  };

  // --- Services Placeholder Component ---
  const Services = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Our Services
        </h2>
        <p className="mt-4 text-gray-600">
          This is a placeholder for the Services page.
        </p>
      </div>
    );
  };

  // --- Admin Layout and Content ---
  const AdminLayout = () => {
    const adminLinks = [
      { name: 'Dashboard', page: 'adminDashboard' },
      { name: 'Users', page: 'adminUsers' },
      { name: 'Cases', page: 'adminCases' },
    ];
    return (
      <>
        <Navbar links={adminLinks} logoText="Caselist Admin" />
        <main>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Admin Dashboard
            </h2>
            <p className="mt-4 text-gray-600">
              This is the admin panel.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  };

  // --- Lawyer Layout and Content ---
  const LawyerLayout = () => {
    const lawyerLinks = [
      { name: 'Dashboard', page: 'lawyerDashboard' },
      { name: 'My Cases', page: 'lawyerCases' },
      { name: 'Billing', page: 'lawyerBilling' },
    ];
    return (
      <>
        <Navbar links={lawyerLinks} logoText="Caselist Lawyer" />
        <main>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Lawyer Dashboard
            </h2>
            <p className="mt-4 text-gray-600">
              This is the lawyer portal.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  };

  // --- Client Layout and Content ---
  const ClientLayout = () => {
    const clientLinks = [
      { name: 'Home', page: 'home' },
      { name: 'Dashboard', page: 'dashboard' },
      { name: 'Services', page: 'services' },
    ];
    const renderClientContent = () => {
      switch (currentPage) {
        case 'home':
          return <Page />;
        case 'dashboard':
          return <Dashboard />;
        case 'services':
          return <Services />;
        default:
          return <Page />;
      }
    };
    return (
      <>
        <Navbar links={clientLinks} logoText="Caselist" />
        <main>
          {renderClientContent()}
        </main>
        <Footer />
      </>
    );
  };

  // Main conditional rendering for the whole app
  const renderApp = () => {
    switch (userRole) {
      case 'client':
        return <ClientLayout />;
      case 'lawyer':
        return <LawyerLayout />;
      case 'admin':
        return <AdminLayout />;
      default:
        return <ClientLayout />;
    }
  };

  return (
    <div className="App">
      {renderApp()}
    </div>
  );
}

export default App;
