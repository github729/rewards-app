import './App.css';
import React from 'react';
import styled from 'styled-components';
import Filters from './components/Filters';
import CustomerDetails from './components/CustomerDetails';
import { getLastThreeMonths } from './utils/dateUtils';
import CustomerList from './components/CustomerList';
import { fetchTransactions } from './utils/transactionsApi';

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

  //defaults to last three months
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const today = new Date();
  const [defaultYear, defaultMonth] = getLastThreeMonths({ date: today });
  const [selectedYear, setSelectedYear] = React.useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = React.useState(defaultMonth);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetching data from an API
    fetchTransactions().then(data => {
      setTransactions(data);
      setLoading(false);
    }).catch(err => {
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        
          <div>
            <Filters
              customers={transactions.reduce((acc, tx) => {
                if (!acc.find(c => c.id === tx.customerId)) {
                  acc.push({ id: tx.customerId, name: `Customer ${tx.customerId}` });
                }
                return acc;
              }, [])}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
              year={selectedYear ? selectedYear.getFullYear() : null}
              onYearChange={(year) => setSelectedYear(year ? new Date(year, 0, 1) : null)}
              month={selectedMonth ? selectedMonth.getMonth() + 1 : null}
              onMonthChange={(month) => {
                if (month) {
                  const yr = selectedYear ? selectedYear.getFullYear() : today.getFullYear();
                  setSelectedMonth(new Date(yr, month - 1, 1));
                } else {
                  setSelectedMonth(null);
                }
              }}
            />
            <Grid>
              <CustomerList
                transactions={transactions}
                onSelectCustomer={setSelectedCustomer}
                selectedCustomer={selectedCustomer}
                selectedMonth={selectedMonth ? selectedMonth.getMonth() + 1 : null}
                selectedYear={selectedYear ? selectedYear.getFullYear() : null}
              />
          <div>
            {selectedCustomer  ? (
              <CustomerDetails
                customerId={selectedCustomer}
                transactions={transactions.filter(tx => {
                  if (selectedYear && tx.date.split("-")[0] !== String(selectedYear.getFullYear())) {
                    return false;
                  }
                  if (selectedMonth && (tx.date.split("-")[1] !== String(selectedMonth.getMonth() + 1).padStart(2, '0'))) {
                    return false;
                  }
                  return tx.customerId === selectedCustomer;
                })}
                selectedYear={selectedYear ? selectedYear.getFullYear() : null}
                selectedMonth={selectedMonth ? selectedMonth.getMonth() + 1 : null}
                onMonthRowClick={(month) => {
                  const yr = selectedYear ? selectedYear.getFullYear() : today.getFullYear();
                  setSelectedMonth(new Date(yr, month - 1, 1));
                }}
              />
            ) : (
              <p>Please select a customer to view details</p>
            )}
          </div>
        </Grid>
        </div>
      )}
   </Shell>
  );
}

export default App;
