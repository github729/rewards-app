import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Pagination from "./Pagination";
import { getLastThreeMonths } from "../utils/dateUtils";

const Card = styled.div`
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 16px;
  margin: 8px 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,td {
    border-bottom: 1px solid #334155;
    padding: 8px;
    text-align: left;
  }
  th {
    background: #1e293b;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1;
    }
`;

const CustomerList = ({ transactions, onSelectCustomer, selectedCustomer, selectedYear, selectedMonth }) => {
   const today = new Date();
   const lastThreeMonths = getLastThreeMonths(today);

   //Apply filtering based on selected customer, year, and month
   const filteredTransactions = transactions.filter(transaction => {
       const transactionDate = new Date(transaction.date);
       const transactionYear = transactionDate.getFullYear();
       const transactionMonth = transactionDate.getMonth() + 1; // Months are 0-indexed in JS

       const matchesCustomer = selectedCustomer ? transaction.customerId === selectedCustomer : true;
       const matchesYear = selectedYear ? transactionYear === parseInt(selectedYear) : true;
       const matchesMonth = selectedMonth ? transactionMonth === parseInt(selectedMonth) : true;
       return matchesCustomer && matchesYear && matchesMonth;
   });
   // Extract unique customers from filtered transactions
   const customers = filteredTransactions.reduce((acc, transaction) => {
       if (!acc.includes(transaction.customerId)) {
           acc.push(transaction.customerId);
       }
       return acc;
    }, []);

    const [page, setPage] = React.useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(customers.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedCustomers = customers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Card>
            <Table>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map((customerId) => (
                        <tr key={customerId}>
                            <td>{customerId}</td>
                            <td><button onClick={() => onSelectCustomer(customerId)}>View Details</button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </Card>
    );
}

CustomerList.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        customerId: PropTypes.string.isRequired,
        transactionId: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
    })).isRequired,
    onSelectCustomer: PropTypes.func.isRequired,
    selectedCustomer: PropTypes.string
};

export default CustomerList;