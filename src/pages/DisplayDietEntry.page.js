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
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { spacing } from '@material-ui/system'


const DisplayDietEntry = () => {

  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);

  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dietArray, setDietArray] = useState([]);
  const [rows, setRowsArray] = useState(null);
  const [columns, setColumnsArray] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  let deleteDietQuery = '';
  let queryVariablesDelete = '';

  // MODAL
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const loadAnalytics = async () => {
   
    const getDietQuery = gql`
    {
      tbldiets {
        userID
        createDate
        foodItem,
        servingSize,
        calories,
        mealType
        _id
      }
    }
    `;
    // Query variables that will be used to perform the analytics from a particular 
    // date to a particular date.
    const queryVariables = { query: { userID: String(user.id)} };
    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      const resp = await request(GRAPHQL_ENDPOINT, getDietQuery, queryVariables, headers);
      setDietArray(_ => resp.tbldiets.map(item => ({ ...item, createDate: item.createDate, foodItem: item.foodItem, servingSize: item.servingSize, calories: item.calories, mealType: item.mealType, id: item._id})));
      
      var todaysDate = new Date();
      let thisCalorieTotal = 0;

      for (let i = 0; i < resp.tbldiets.length; i++) {

        let thisDate = new Date(resp.tbldiets[i].createDate);
        thisDate.setHours(0,0,0,0);

        if(thisDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
          thisCalorieTotal += resp.tbldiets[i].calories;
        }
       
      }
      // set calorie state
      setTotalCalories(thisCalorieTotal);

    } catch (error) {
      alert(error);
    }
    
  };

  // DELETE QUERY
    const onButtonClick = (e, _id) => {
      e.stopPropagation();
      deleteDietQuery = gql`
        mutation DeleteDiet($query: TbldietQueryInput!) {
          deleteOneTbldiet(query: $query) {
            _id
          }
        }
        `;
      // Passing the expense-id in the query to delete a specific expense
      let queryVariablesDelete = { query: { _id } };
      deleteThisDietEntry(e, deleteDietQuery, queryVariablesDelete);
  }
  const headers = { Authorization: `Bearer ${user._accessToken}` };
  const deleteThisDietEntry = async (e, deleteDietQuery, queryVariablesDelete) => {

  // Confirming the user action
  const resp = window.confirm("Are you sure you want to delete this entry?");
    if (!resp) return;
    try {
      await request(GRAPHQL_ENDPOINT, deleteDietQuery, queryVariablesDelete, headers);
      alert("Record Deleted");
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    loadAnalytics(); 
  }, []);

  return (
    <PageContainer>
      <h1>Food Entries</h1>
      <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/addfood">Add Diet Entry</Button>
      <Button color="success" variant="contained" sx={{ ml: 3 }} onClick={handleOpen}>Dietary Suggestions
</Button>
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Dietary Suggestions
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      <b>Choose low-glycemic index (GI) foods: </b>These foods have a lower impact on blood sugar levels. Examples include non-starchy vegetables, legumes, whole grains, nuts, and seeds.<br/><br/>
      <b>Monitor carbohydrate intake: </b>Carbohydrates have the most significant effect on blood sugar levels. Therefore, it is essential to monitor the amount and type of carbohydrates consumed. Consider working with a registered dietitian to help determine your specific carbohydrate needs.<br/><br/>
      <b>Incorporate lean protein: </b>Protein can help slow the absorption of carbohydrates and help manage blood sugar levels. Lean protein sources include chicken, turkey, fish, lean beef, tofu, and legumes.<br/><br/>
      <b>Choose healthy fats: </b>Include healthy fats such as avocado, nuts, seeds, and olive oil in your diet. However, keep in mind that fat is high in calories, so it is essential to monitor portions.<br/><br/>
      <b>Avoid sugary and processed foods: </b>Sugary and processed foods should be avoided, as they can cause rapid spikes in blood sugar levels.<br/><br/>
      <b>Stay hydrated: </b>Drink plenty of water to help control blood sugar levels and prevent dehydration.<br/><br/><br/>
      Spread meals throughout the day: Eating smaller, more frequent meals throughout the day can help maintain stable blood sugar levels.
      <br/><br/>
    </Typography>
  </Box>
</Modal>
      <p style={{fontSize: '24px', fontWeight: '500'}}>Total Calories Consumed Today: { totalCalories }</p>

      <div style={{ height: 500, width: '70%',marginTop: '20px' }}>

          <DataGrid
          rows={dietArray.filter(x => x.userID === user.id)}
          getRowId={(row) => row._id}
          columns={[{ field: 'createDate', headerName: 'Date Entered', minWidth: 250,  valueFormatter: params => 
          moment(params?.value).format("MM/DD/YYYY hh:mm A") }, 
          {field: 'mealType', headerName: 'Meal Type', editable: false, minWidth: 150},          
          {field: 'foodItem', headerName: 'Item', editable: true, minWidth: 200},
          {field: 'servingSize', headerName: 'Serving(s)', editable: true, minWidth: 50},
          {field: 'calories', headerName: 'Calories', editable: true, minWidth: 50},
          {field: '_id', headerName: ' ', editable:false, minWidth:100, renderCell: (params) => <a href={'/dietentries/'+params.id+'/edit/'} className='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root'>Edit</a>},
          {
            field: 'actions', headerName: ' ', width: 100, renderCell: (params) => {
              return (
                <Button
                  onClick={(e) => onButtonClick(e, params.id)}
                  variant="contained">
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