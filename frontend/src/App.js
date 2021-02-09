import React from 'react';
import routes from "./routes";
import {Route,Switch} from "react-router-dom";
// import Header from "./Components/Header";
import './App.css';
import Home from "./Pages/Home";
import AdminPage from "./Pages/AdminPage";
import AdminContent from "./Pages/AdminContent";
import ChangePassword from "./Components/ChangePassword";
import InvoicePage from "./Pages/InvoicePage";
import InvoiceData from "./Pages/InvoiceData";
import PDF from "./Pages/PDF";
import ChangeRights from './Pages/ChangeRights';
import PDFadmin from "./Pages/PDFadmin";

function App() {
  return (
    <>
      <Switch>
      
      <Route path={routes.admin}>
      <AdminPage/>
      </Route>
      <Route path={routes.adminContent}>
      <AdminContent/>
      </Route>
      <Route path={routes.changepassword}>
      <ChangePassword/>
      </Route>
      <Route path={routes.invoice}>
        <InvoicePage/>
      </Route>
      <Route path={routes.invoiceData}>
        <InvoiceData/>
      </Route>
      <Route path={routes.changerights}>
        <ChangeRights/>
      </Route>
      <Route path={routes.pdf}>
        <PDF/>
      </Route>
      <Route path={routes.pdfadmin}>
        <PDFadmin/>
      </Route>
      <Route path={routes.home}>
      <Home/>
      </Route>
      </Switch>
    </>
    
  );
}

export default App;
