import React from "react";
import ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TransactionWeb3js from "./components/transaction-web3js";
import TransactionEtherjs from "./components/transaction-etherjs";

const App = () => (
  <Router>
      <Routes>
        <Route path="/transaction-web3js" element={<TransactionWeb3js />} />
        <Route path="/transaction-etherjs" element={<TransactionEtherjs />} />
      </Routes>
  </Router>
);

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}

