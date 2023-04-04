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

const ExerciseAnalytics = () => {

  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);
  let deleteExerciseQuery = '';
  let queryVariablesDelete = '';

  const { user } = useContext(UserContext);
  const [exerciseArray, setExerciseArray] = useState([]);

  const loadAnalytics = async () => {
    const getExerciseQuery = gql`
    {
      tblexercises {
        userID
        exerciseName
        exerciseTime
        createDate
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
      const resp = await request(GRAPHQL_ENDPOINT, getExerciseQuery, queryVariables, headers);
      setExerciseArray(_ => resp.tblexercises.map(item => ({ ...item, exerciseName: item.exerciseName, exerciseTime: item.exerciseTime, createDate: item.createDate })));
      exerciseArray.push(resp);


    } catch (error) {
      alert(error);
    }
  };

  const onButtonClick = (e, _id) => {
    e.stopPropagation();
    deleteExerciseQuery = gql`
  mutation deleteExerciseQuery($query: TblexerciseQueryInput!) {
    deleteOneTblexercise(query: $query) {
      _id
    }
  }
  `;

    // Passing the expense-id in the query to delete a specific expense
    queryVariablesDelete = { query: { _id } };


    deleteThisExercise(deleteExerciseQuery, queryVariablesDelete);

    // deleteThisExpense function is responsible for deleting the
    // expense based on the provided expense ID and then calling the
    // afterDelete function to do the cleanup. 

  }
  const headers = { Authorization: `Bearer ${user._accessToken}` };
  const deleteThisExercise = async (deleteExerciseQuery, queryVariablesDelete) => {

    // Confirming the user action
    const resp = window.confirm("Are you sure you want to delete this exercise entry?");
    if (!resp) return;

    try {
      await request(GRAPHQL_ENDPOINT, deleteExerciseQuery, queryVariablesDelete, headers);
      alert("Record Deleted Successefully");
      window.location.reload();
    } catch (error) {
      alert(error);
    }
    //do whatever you want with the row
  };

  useEffect(() => {
    loadAnalytics(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <h1>Exercise Analytics</h1>
      <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/exerciseEntry">Add Exercise</Button>
      <h3>Entries</h3>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={exerciseArray.filter(x => x.userID === user.id)}
          getRowId={(row) => row._id}
          columns={[{
            field: 'createDate', headerName: 'Date Entered', minWidth: 200, valueFormatter: params =>
              moment(params?.value).format("MM/DD/YYYY hh:mm A")
          }, {
            field: 'exerciseName', headerName: 'Exercise Name', minWidth: 200
          }, {
            field: 'exerciseTime', headerName: 'Exercise Time', minWidth: 200
          }, {
            field: '_id', headerName: 'Actions', editable: false, minWidth: 100, renderCell: (params) => <a href={'/exercise/' + params.id + '/edit/'} className='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root'>Edit</a>
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

export default ExerciseAnalytics;