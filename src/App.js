import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import { UserProvider } from "./contexts/user.context";
import WeightAnalytics from "./pages/WeightAnalytics.page";
import DisplayDietEntry from "./pages/DisplayDietEntry.page";
import CreateWeight from "./pages/CreateWeight.page";
import CreateBloodSugarLevel from "./pages/CreateBloodSugarLevel.page";
import BloodSugarLevelAnalytics from "./pages/BloodSugarLevelAnalytics.page";
import CreateDietEntry from "./pages/CreateDietEntry.page";
import EditWeight from "./pages/EditWeight.page";
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";
import Signup from "./pages/Signup.page";
import EditBloodSugarLevel from "./pages/EditBloodSugarLevel.page";
import ExerciseAnalytics from "./pages/ExerciseAnalytics.page";
import CreateExerciseEntry from "./pages/CreateExerciseEntry.page";
import EditExercise from "./pages/EditExercise.page";
import DisplayAppointment from "./pages/DisplayAppointment.page";
import CreateAppointment from "./pages/CreateAppointment.page";
import EditAppointment from "./pages/EditAppointment.page";
import { Outlet } from "react-router-dom";
import ExerciseResource from "./components/ExerciseResource.componenet";
import EditDietEntry from "./pages/EditDietEntry.page";


function App() {
  return (
    <BrowserRouter>
      {/* We are wrapping our whole app with UserProvider so that */}
      {/* our user is accessible through out the app from any page*/}
      <UserProvider>

        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            element={
              <>
                <NavBar />
                <Outlet />
              </>
            }
          >

            {/* We are protecting our Home Page from unauthenticated */}
            {/* users by wrapping it with PrivateRoute here. */}
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/new" element={<CreateWeight />} />
              <Route exact path="/bloodsugarlevel" element={<CreateBloodSugarLevel />} />
              <Route exact path="/bloodSugarLevel/:id/edit" element={<EditBloodSugarLevel />} />
              <Route exact path="/bloodsugarlevelanalytics" element={<BloodSugarLevelAnalytics />} />
              <Route exact path="/weight/:id/edit" element={<EditWeight />} />
              <Route exact path="/weightanalytics" element={<WeightAnalytics />} />
              <Route exact path="/dietentries" element={<DisplayDietEntry />} />
              <Route exact path="/addfood" element={<CreateDietEntry />} />
              <Route exact path="/dietentries/:id/edit" element={<EditDietEntry />} />
              <Route exact path="/exerciseanalytics" element={<ExerciseAnalytics />} />
              <Route exact path="/exerciseEntry" element={<CreateExerciseEntry />} />
              <Route exact path="/exercise/:id/edit" element={<EditExercise />} />
              <Route exact path="/appointment" element={<DisplayAppointment />} />
              <Route exact path="/addappointment" element={<CreateAppointment />} />
              <Route exact path="/app/:id/edit" element={<EditAppointment />} />
              <Route exact path="/exerciseresource" element={<ExerciseResource />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
