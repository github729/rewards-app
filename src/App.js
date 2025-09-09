import "./App.css";
import React from "react";
import styled from "styled-components";
import CustomerDetails from "./components/CustomerDetails";
import CustomerList from "./components/CustomerList";
import { fetchTransactions } from "./utils/transactionsApi";

const Shell = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 16px;
`;

function App() {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetching data from an API
    fetchTransactions()
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching data");
        setLoading(false);
      });
  }, []);

  return (
    <Shell>
      <Header>
        <h1>Customer Rewards Dashboard</h1>
      </Header>
      {loading && <p>Loading transactions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div>
          <CustomerList
            transactions={transactions}
            onSelectCustomer={setSelectedCustomer}
          />
          <div>
            {selectedCustomer && (
              <CustomerDetails
                customerId={selectedCustomer}
                transactions={transactions.filter((tx) => {
                  return tx.customerId === selectedCustomer;
                })}
              />
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}

export default App;
