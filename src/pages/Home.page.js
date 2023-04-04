import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import WeightLineChart from '../components/WeightLineChart.component';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Add, PieChart, Logout } from '@mui/icons-material/';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Line } from "react-chartjs-2";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);
  const [bloodSugar, setBloodSugar] = useState([]);
  const [appointment, setAppointment] = useState({});

  // GraphQL query to fetch all the expenses from the collection. 
  const getAllBloodSugarLevels = gql`
  query getAllBloodSugar {
    tblbloodsugars {
      _id
      userID
      createDate
      bloodSugarLevel
    }
  }
  `;

  const getAppointemntQuery = gql`
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
  // Since we don't want to filter the results as of now,
  // we will just use the empty query object
  const queryVariables = { query: { userID: String(user.id) } };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` }

  // loadExpenses function is responsible for making the GraphQL
  // request to Realm and update the expenses array from the response. 
  const loadBloodSugar = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllBloodSugarLevels,
      queryVariables,
      headers
    );

    setBloodSugar(_ => resp.tblbloodsugars.map(bloodSugar => ({ ...bloodSugar, key: bloodSugar._id, afterDelete })));
  };

  const loadAppointment = async () => {
    try {
      const resp = await request(GRAPHQL_ENDPOINT, getAppointemntQuery, queryVariables, headers);
      let upcoming = moment().add(100, 'year')
      // setAppointment(resp.tblappointments[0])
      for (var i = 0; i < resp.tblappointments.length; i++) {
        if (resp.tblappointments[i]['userID'] == user.id) {
          if (moment(resp.tblappointments[i]['appointmentDate']) > moment() && moment(resp.tblappointments[i]['appointmentDate']) < upcoming) {
            upcoming = moment(resp.tblappointments[i]['appointmentDate'])
            setAppointment(resp.tblappointments[i])
            // console.log(i)
          }
          // setAppointment(resp.tblappointments[i])
          // console.log(i)
        }

      }

    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    loadBloodSugar();
    loadAppointment();
  }, []);

  // // Helper function to be performed after an expense has been deleted.
  const afterDelete = () => {
    loadBloodSugar();
    loadAppointment();
  }

  const ll = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels: ll,
    datasets: [
      {
        label: "Profit$",
        data: bloodSugar,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.4)"
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  const lineChart = ({ data }) => (
    <>
      <div className="header">
        <h1 className="title">Test</h1>
        <div className="links"></div>
      </div>
      <Line data={data} options={options} />
    </>
  );







  return <PageContainer>
    <h1>Welcome, {user._profile.data.email}! </h1>
    <Card style={{ backgroundColor: "lightblue" }}>
      <CardContent>
        <h3 style={{ textAlign: "center" }}>Description</h3>
        <p>Diabetes is a chronic condition that affects millions worldwide (World Health Organization, 2023). It affects the body's ability to produce glucose, resulting in high blood sugar levels, leading to a variety of symptoms including but not limited to fatigue, frequent urination, and vulnerability to infections (Mayo Clinic, 2023). However, it's possible to manage the condition to maintain a higher quality of life with proper management. While living with type 2 diabetes can be challenging, it's possible to still live an enjoyable lifestyle with the right tools and resources. This tool aims to provide easy management strategies for those living with type 2 diabetes, helping to track and regulate blood sugar levels, physical activity, and diet.</p>
        <div><strong>Each user of the application should be able to perform the following:</strong>
          <ol>
            <li>Login/Register</li>
            <li>Track blood sugar levels</li>
            <li>Keep track of scheduled appointments (doctor, lab, nutritionist, etc) as well as receive reminders whenever the user is actively logged on</li>
            <li>Monitor weight loss</li>
            <li>Track exercise</li>
            <li>Track diet and/or get help with nutrition</li>
          </ol>
        </div>
      </CardContent>
    </Card>
    <br />
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <WeightLineChart data={bloodSugar}></WeightLineChart>
      </Grid>
      <Grid item xs={4}>
        {appointment['provider'] != undefined ? (
          <Card sx={{ width: "auto" }} style={{ backgroundColor: "Orange" }}>
            <CardContent>
              <h3>Upcoming Appointment</h3>
              <div>{moment(appointment['appointmentDate']).format('LLLL')}</div>
              <div><h4>Provider: </h4>{appointment['provider']}</div>
              <div><h4>Description: </h4>{appointment['description']}</div>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/appointment">Manage Appointment</Button>
            </CardActions>
          </Card>
        ) : (
          <Card sx={{ width: "auto" }} style={{ backgroundColor: "lightblue" }}>
            <CardContent>
              <h3>No Upcoming Appointment</h3>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/appointment">Manage Appointment</Button>
            </CardActions>
          </Card>
        )}
      </Grid>
    </Grid>
    <br />
    <Card style={{ backgroundColor: "lightblue" }}>
      <CardContent>
        <h3 style={{ textAlign: "center" }}>Links to External Resources</h3>
        <p>These links provide comprehensive information about type 2 diabetes, including its causes, symptoms, diagnosis,
          treatment, and management strategies. </p>
        <ul>
          <li><a href='https://www.cdc.gov/diabetes/basics/type2.html' target='_blank'>Centers for Disease Control and Prevention: Type 2 Diabetes</a></li>
          <li><a href='https://www.diabetes.org/diabetes/type-2' target='_blank'>American Diabetes Association: Type 2 Diabetes</a></li>
          <li><a href='https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes' target='_blank'>National Institute of Diabetes and Digestive and Kidney Diseases: Type 2 Diabetes</a></li>
          <li><a href='https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/symptoms-causes/syc-20351193' target='_blank'>Mayo Clinic: Type 2 Diabetes</a></li>
          <li><a href='https://www.health.harvard.edu/diseases-and-conditions/type-2-diabetes-overview' target='_blank'>Harvard Health Publishing: Type 2 Diabetes</a></li>
        </ul>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
      <h3 style={{ textAlign: "center" }}>References</h3>
      <ol>
        <li>Mayo Foundation for Medical Education and Research. (2023, January 20). <i>Diabetes.</i> Mayo Clinic. 
          <p>&nbsp;&nbsp;Retrieved April 3, 2023, from https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444</p></li>
        <li>World Health Organization. (n.d.). <i>Diabetes.</i>World Health Organization. 
        <p>&nbsp;&nbsp;Retrieved April 2, 2023, from https://www.who.int/health-topics/diabetes#tab=tab_1</p></li>
      </ol> 

      </CardContent>
    </Card>

  </PageContainer>
}

export default Home;