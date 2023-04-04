import { useContext, useEffect, useState } from "react";
import { Button, Grid, Typography, IconButton } from "@mui/material";
import moment from 'moment';
import request, { gql } from "graphql-request";
import { formatISO, subMonths, endOfToday, startOfDay, endOfDay } from "date-fns";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import PageContainer from "../components/PageContainer.component";
import { DataGrid } from '@mui/x-data-grid';
import { Menu as MenuIcon, Add, PieChart, Logout, Home } from '@mui/icons-material/';
import { Link } from 'react-router-dom';

const DisplayDietEntry = () => {

  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);

  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dietArray, setDietArray] = useState([]);
  const [rows, setRowsArray] = useState(null);
  const [columns, setColumnsArray] = useState([]);
  let deleteDietQuery = '';
  let deleteBloodSugarLevelQuery = '';
  let queryVariablesDelete = '';

  const loadAnalytics = async () => {

    const getDietQuery = gql`
    {
      tblappointments {
        userID
        createDate
        modifyDate
        appointmentDate
        provider
        description
        _id
      }
    }
    `;
    // Query variables that will be used to perform the analytics from a particular 
    // date to a particular date.
    const queryVariables = { query: { userID: String(user.id) } };
    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      const resp = await request(GRAPHQL_ENDPOINT, getDietQuery, queryVariables, headers);
      console.log(resp.tblappointments);
      setDietArray(_ => resp.tblappointments.map(item => ({ ...item, createDate: item.createDate, foodItem: item.foodItem, servingSize: item.servingSize, calories: item.calories, id: item._id })));
    } catch (error) {
      alert(error);
    }

  };

  // DELETE QUERY

  // const onButtonClick = (e, _id) => {
  //   e.stopPropagation();
  //   deleteDietQuery = gql`
  //     mutation DeleteAppointment($query: TblappointmentQueryInput!) {
  //       deleteOneTblappointment(query: $query) {
  //         _id
  //       }
  //     }
  //     `;
  //   // Passing the expense-id in the query to delete a specific expense
  //   let queryVariablesDelete = { query: { _id } };
  //   deleteThisDietEntry(e, deleteDietQuery, queryVariablesDelete);
  // }
  // const headers = { Authorization: `Bearer ${user._accessToken}` };
  // const deleteThisDietEntry = async (e, deleteDietQuery, queryVariablesDelete) => {

  //   // Confirming the user action
  //   const resp = window.confirm("Are you sure you want to delete this entry?");
  //   if (!resp) return;
  //   try {
  //     await request(GRAPHQL_ENDPOINT, deleteDietQuery, queryVariablesDelete, headers);
  //     alert("Record Deleted");
  //     window.location.reload();
  //   } catch (error) {
  //     alert(error);
  //   }
  // };
  const onButtonClick = (e, _id) => {

    e.stopPropagation();
    deleteBloodSugarLevelQuery = gql`
      mutation DeleteAppointment($query: TblappointmentQueryInput!) {
        deleteOneTblappointment(query: $query) {
          _id
        }
      }
    `;

    // Passing the expense-id in the query to delete a specific expense
    queryVariablesDelete = { query: { _id } };
    console.log(_id)

    deleteThisBloodSugarLevel(e, deleteBloodSugarLevelQuery, queryVariablesDelete);

    // deleteThisExpense function is responsible for deleting the
    // expense based on the provided expense ID and then calling the
    // afterDelete function to do the cleanup. 

  }
  const headers = { Authorization: `Bearer ${user._accessToken}` };
  const deleteThisBloodSugarLevel = async (e, deleteBloodSugarLevelQuery, queryVariablesDelete) => {

    // Confirming the user action
    const resp = window.confirm("Are you sure you want to delete this blood sugar level entry?");
    if (!resp) return;

    try {
      console.log(GRAPHQL_ENDPOINT, deleteBloodSugarLevelQuery, queryVariablesDelete, headers)
      await request(GRAPHQL_ENDPOINT, deleteBloodSugarLevelQuery, queryVariablesDelete, headers);
      // alert("Record Deleted Successefully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    //do whatever you want with the row
  };



  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <PageContainer>
      <h1>Appointment</h1>
      <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/addappointment">Add Appointment</Button>
      <div style={{ height: 500, width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={dietArray.filter(x => x.userID === user.id)}
          getRowId={(row) => row._id}
          columns={[{
            field: 'appointmentDate', headerName: 'Date', minWidth: 250, valueFormatter: params =>
              moment(params?.value).format("MM/DD/YYYY hh:mm A")
          },
          { field: 'provider', headerName: 'Provider', editable: true, minWidth: 150 },
          { field: 'description', headerName: 'Description', editable: true, minWidth: 200 },
          { field: '_id', headerName: ' ', editable: false, minWidth: 100, renderCell: (params) => <a href={'/app/' + params.id + '/edit/'} className='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root'>Edit</a> },
          {
            field: 'actions', headerName: ' ', width: 100, renderCell: (params) => {
              return (
                <Button
                  onClick={(e) => onButtonClick(e, params.id)}
                  variant="contained"
                >
                  Delete
                </Button>
              );
            }
          }]}
          pageSize={10}
          rowsPerPageOptions={[5]}
        />
      </div>
    </PageContainer>
  );
}
export default DisplayDietEntry;