import { useContext, useEffect, useState } from "react";
import { Button, Grid, Typography, IconButton } from "@mui/material";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const WeightAnalytics = () => {

  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);

  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [weightArray, setWeightArray] = useState([]);
  const [rows, setRowsArray] = useState(null);
  const [columns, setColumnsArray] = useState([]);
  let deleteWeightQuery = '';
  let queryVariablesDelete = '';

  const loadAnalytics = async () => {
   
    const getWeightQuery = gql`
    {
      tblweights {
        userID
        createDate
        weight
        _id
      }
    }
    `;
    // Query variables that will be used to perform the analytics from a particular 
    // date to a particular date.
    const queryVariables = { query: { userID: String(user.id)} };
    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      const resp = await request(GRAPHQL_ENDPOINT, getWeightQuery, queryVariables, headers);
      console.log(resp)
      setWeightArray(_ => resp.tblweights.map(item => ({ ...item, createDate: item.createDate, weight: item.weight, id: item._id})));
    } catch (error) {
      alert(error);
    }
    
  };

  const onButtonClick = (e, _id) => {
          e.stopPropagation();
          deleteWeightQuery = gql`
            mutation DeleteWeight($query: TblweightQueryInput!) {
              deleteOneTblweight(query: $query) {
                _id
              }
            }
            `;
          let queryVariablesDelete = { query: { _id } };
          deleteThisWeightEntry(e, deleteWeightQuery, queryVariablesDelete);
  }
  const headers = { Authorization: `Bearer ${user._accessToken}` };
  const deleteThisWeightEntry = async (e, deleteWeightQuery, queryVariablesDelete) => {

    // Confirming the user action
    const resp = window.confirm("Are you sure you want to delete this entry?");
    if (!resp) return;
    try {
      await request(GRAPHQL_ENDPOINT, deleteWeightQuery, queryVariablesDelete, headers);
      alert("Record Deleted");
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

    //TODO: Implement later
    // function updateData(data) {
    // e.preventDefault();
    // console.log('You clicked refresh.');
    // }

  useEffect(() => {
    loadAnalytics(); 
  }, []);

  return (
    <PageContainer>
      <h1>Weight Analytics</h1>
      <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/new">Add Weight</Button>
      <h3>Entries</h3>
      <div style={{ height: 500, width: '70%' }}>
          <DataGrid
          rows={weightArray.filter(x => x.userID === user.id)}
          getRowId={(row) => row._id}
          columns={[{ field: 'createDate', headerName: 'Date Entered', minWidth: 250,  valueFormatter: params => 
          moment(params?.value).format("MM/DD/YYYY hh:mm A") }, 
          {field: 'weight', headerName: 'Weight (lbs)', editable: true, minWidth: 250},
          {field: '_id', headerName: ' ', editable:false, minWidth:40, renderCell: (params) => <a href={'/weight/'+params.id+'/edit/'} className='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root'>Edit</a>},
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
export default WeightAnalytics;