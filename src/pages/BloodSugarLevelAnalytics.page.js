import { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import moment from 'moment';
import request, { gql } from "graphql-request";
import { formatISO, subMonths, endOfToday, startOfDay, endOfDay } from "date-fns";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import { DataGrid } from '@mui/x-data-grid';
import { Menu as MenuIcon, Add, PieChart, Logout, Home } from '@mui/icons-material/';
import { Link } from 'react-router-dom';

const BloodSugarLevelAnalytics = () => {

  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);
  let deleteBloodSugarLevelQuery = '';
  let queryVariablesDelete = '';

  const { user } = useContext(UserContext);
  const [bloodSugarLevelArray, setBloodSugarLevelArray] = useState([]);

  const loadAnalytics = async () => {
    const getBloodSugarLevelQuery = gql`
    {
      tblbloodsugars {
        userID
        createDate
        bloodSugarLevel
        _id
      }
    }
    `;
    // Query variables that will be used to perform the analytics from a particular 
    // date to a particular date.
    const queryVariables = { query: { userID: String(user.id) } };
    console.log(queryVariables);
    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      const resp = await request(GRAPHQL_ENDPOINT, getBloodSugarLevelQuery, queryVariables, headers);
      setBloodSugarLevelArray(_ => resp.tblbloodsugars.map(item => ({ ...item, createDate: item.createDate, bloodSugarLevel: item.bloodSugarLevel })));
      bloodSugarLevelArray.push(resp);


    } catch (error) {
      alert(error);
    }
  };

  const onButtonClick = (e, _id) => {
    e.stopPropagation();
    deleteBloodSugarLevelQuery = gql`
  mutation DeleteBloodsugar($query: TblbloodsugarQueryInput!) {
    deleteOneTblbloodsugar(query: $query) {
      _id
    }
  }
  `;

    // Passing the expense-id in the query to delete a specific expense
    queryVariablesDelete = { query: { _id } };


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
      await request(GRAPHQL_ENDPOINT, deleteBloodSugarLevelQuery, queryVariablesDelete, headers);
      alert("Record Deleted Successfully");
      window.location.reload();
    } catch (error) {
      alert(error);
    }
    //do whatever you want with the row
  };

  useEffect(() => {
    loadAnalytics(); 
  }, []);

  return (
    <PageContainer>
      <h1>Blood Sugar Level Analytics</h1>
      <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/bloodsugarlevel">Add Blood Sugar Level</Button>
      <h3>Entries</h3>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={bloodSugarLevelArray.filter(x => x.userID === user.id)}
          getRowId={(row) => row._id}
          columns={[{
            field: 'createDate', headerName: 'Date Entered', minWidth: 200, valueFormatter: params =>
              moment(params?.value).format("MM/DD/YYYY hh:mm A")
          }, {
            field: 'bloodSugarLevel', headerName: 'Blood Sugar Level (lbs)', minWidth: 200
          }, {
            field: '_id', headerName: 'Actions', editable: false, minWidth: 100, renderCell: (params) => <a href={'/bloodSugarLevel/' + params.id + '/edit/'} className='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root'>Edit</a>
          }, {
            field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
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

export default BloodSugarLevelAnalytics;