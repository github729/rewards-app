import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rewardCalculator } from "../utils/rewardCalculator";

const Wrapper = styled.div`
  display: grid;
  gap: 16px;
`;

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
`;

const CustomerDetails = ({ customerId, transactions, selectedYear, selectedMonth, onMonthRowClick }) => {
    
    const customerTransactions = transactions.filter(tx => tx.customerId === customerId);

    const transactionsByMonth = customerTransactions.reduce((acc, tx) => {
        const month = tx.date.split("-")[1];
        if (!acc[month]) {
            acc[month] = { totalAmount: 0, pointsEarned: 0 };
        }
        acc[month].totalAmount += tx.amount;
        acc[month].pointsEarned += rewardCalculator(tx.amount);
        return acc;
    }, {});


    const totalPoints = Object.values(transactionsByMonth).reduce((sum, month) =>
        sum + month.pointsEarned, 0);
    

    const filteredTransactions = Object.entries(transactionsByMonth).map(([month, data]) => ({
        id: `${customerId}-${month}`,
        month,
        amount: data.totalAmount,
        points: data.pointsEarned
        
    }));

    const selectedKey = selectedMonth ? `Month: ${selectedMonth}` : `Year: ${selectedYear || 'All'}`;

    return (
        <Wrapper>
            <h2>Rewards Summary - Customer: {customerId}</h2>
            <h3>Total Points: {totalPoints}</h3>
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Amount</th>
                            <th>Points Earned</th>
                        </tr>
                    </thead>
                    <tbody>
                      {Object.entries(transactionsByMonth).map(([month, data]) => (
                        <tr key={month} onClick={() => onMonthRowClick(month)}>
                          <td>{month}</td>
                          <td>{data.totalAmount}</td>
                          <td>{data.pointsEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                    {Object.keys(transactionsByMonth).length === 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan="3">No transactions available</td>
                            </tr>
                        </tfoot>
                    )}
                </Table>
            </Card>
            <Card>
                <h3>Transactions - {selectedKey}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Points Earned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.id}</td>
                                <td>{tx.month}</td>
                                <td>{tx.amount}</td>
                                <td>{rewardCalculator(tx.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                    {filteredTransactions.length === 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan="4">No transactions available</td>
                            </tr>
                        </tfoot>
                    )}
                </Table>
            </Card>
        </Wrapper>
    );
}


CustomerDetails.propTypes = {
    customerId: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        points: PropTypes.number.isRequired
    })).isRequired,
    selectedYear: PropTypes.number,
    selectedMonth: PropTypes.number,
    onMonthRowClick: PropTypes.func.isRequired
};

export default CustomerDetails;
