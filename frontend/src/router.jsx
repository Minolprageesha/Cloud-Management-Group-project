import { createBrowserRouter } from "react-router-dom";
import ChangeStatus from "./components/CreateOrder";
import CreateInvoice from "./components/ChangeStatus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChangeStatus />,
  },
  {
    path: "/invoice",
    element: <CreateInvoice />,
  },
]);

export default router;
