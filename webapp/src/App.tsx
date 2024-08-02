import React from "react";
import { Routes, Route } from "react-router-dom";
import NavLayout from "./components/NavLayout";
import Home from "./pages/home/Home";
import OrderDetails from "./pages/orders/OrderDetails";
import Login from "./pages/login/Login";
import LocalDepot from "./pages/depot/LocalDepot";
import { AuthProvider } from "./context/useAuth";
import QRScanner from "./pages/QRScanner/QRScanner";
import OrdersProvider from "./components/useOrders";
import ConfirmationModalProvider from "./components/useConfirmationModal";
import Recording from "./pages/recording/Recording";
import AddRecorder from "./pages/recording/AddRecorder";
import RecorderControl from "./pages/recording/RecorderControl";
import RecordersProvider from "./components/useRecorders";
import RecorderiQRScanner from "./pages/recording/RecorderiQRScanner";

const App: React.FC = () => {
  return (
    <div id="App">
      <AuthProvider>
        <OrdersProvider>
          <RecordersProvider>
            <ConfirmationModalProvider>
              <NavLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="depot" element={<LocalDepot />} />
                  <Route path="order">
                    <Route path=":id" element={<OrderDetails />} />
                  </Route>
                  <Route path="QR" element={<QRScanner />} />
                  <Route path="recording">
                    <Route path="" element={<Recording />} />
                    <Route path="new" element={<AddRecorder />} />
                    <Route path=":id">
                      <Route path="" element={<RecorderControl />} />
                      <Route
                        path="link-item"
                        element={<RecorderiQRScanner />}
                      />
                    </Route>
                  </Route>
                </Routes>
              </NavLayout>
            </ConfirmationModalProvider>
          </RecordersProvider>
        </OrdersProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
