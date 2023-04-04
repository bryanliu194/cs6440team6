import { Card, CardContent } from "@material-ui/core";
import PageContainer from "./PageContainer.component";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const ExerciseResource = () => {
  return <PageContainer>
    <Card xs={{ maxWidth: "400px" }} style={{ backgroundColor: "lightgray" }}>
      <CardContent>
        <h3 style={{ textAlign: "center" }}>EXERCISE SUGGESTIONS</h3>
        <p><b>Warm-up:</b> Start with a five-minute warm-up to get the blood flowing and prepare the body for exercise. This can be a light walk or jog,
          or simple stretching exercises such as arm circles, leg swings, and neck rotations.
        </p>
        <p><b>Cardiovascular exercise:</b> Aim for at least 30 minutes of moderate-intensity cardiovascular exercise on most days of
          the week. This can include activities such as brisk walking, cycling, swimming, dancing, or using cardio equipment at the gym.
        </p>
        <p><b>Strength training:</b> Incorporate strength training exercises two to three times per week. This can be done with
          bodyweight exercises such as push-ups, squats, and lunges, or by using weights, resistance bands, or weight machines.
          Aim for 8-12 repetitions of each exercise, and start with lighter weights or resistance bands if you are new to strength training.
        </p>
        <p><b>Flexibility exercises:</b> Stretching can help improve flexibility, range of motion, and prevent injury.
          Incorporate stretching exercises into your routine, holding each stretch for 10-30 seconds. You can stretch your calves,
          hamstrings, quadriceps, hip flexors, back, chest, shoulders, and neck.
        </p>
        <p><b>Cool-down:</b> End your exercise routine with a five-minute cool-down to gradually lower your heart rate and prevent
          dizziness or lightheadedness. This can be a light walk or jog, or simple stretching exercises such as arm circles, leg swings,
          and neck rotations.
        </p>
        <p>It is important to monitor your blood sugar levels before and after exercise, and adjust your insulin or medication doses as needed.
          Additionally, staying hydrated and wearing comfortable shoes and clothing can help prevent injuries and improve the overall exercise
          experience.</p>
        <p><strong>Remember to start slowly and gradually increase the intensity and duration of your exercise routine over time. Consistency is key,
          and incorporating regular exercise into your lifestyle can help improve blood sugar control, reduce the risk of complications, and
          improve overall health and well-being.</strong>
        </p>
        <h3 style={{ textAlign: "center" }}>EXERCISE VIDEOS</h3>
        <p><b>Squats:</b> Squats are a great lower body exercise that work the quadriceps, hamstrings, and glutes. They can be done with bodyweight,
          or with added weights such as dumbbells or a barbell.&nbsp;
          <a href="https://www.youtube.com/watch?v=ultWZbUMPL8" target="_blank">Click Here</a>&nbsp;
          to watch a video on how to do a basic squat.
        </p>
        <p><b>Push-ups:</b> Push-ups are a classic exercise that work the chest, shoulders, and triceps. They can be done with modified versions
          for beginners, or with added resistance for advanced exercisers.&nbsp;
          <a href="https://www.youtube.com/watch?v=IODxDxX7oi4" target="_blank">Click Here</a>&nbsp;
          to watch a video on how to do a basic push-up.
        </p>
        <p><b>Lunges:</b> Lunges are another great lower body exercise that work the quadriceps, hamstrings, and glutes.
          They can be done with bodyweight, or with added weights such as dumbbells or a barbell.&nbsp;
          <a href="https://www.youtube.com/watch?v=eBZPxp32Nmw" target="_blank">Click here</a>&nbsp;
          to watch a video on how to do a basic lunge.
        </p>
        <p><b>Plank:</b> Planks are a core exercise that work the abdominals, back, and shoulder muscles.
          They can be done with modified versions for beginners, or with added resistance for advanced exercisers.&nbsp;
          <a href="https://www.youtube.com/watch?v=ASdvN_XEl_c" target="_blank">Click here</a>&nbsp;
          to watch a video on how to do a basic plank.
        </p>
        <p><b>Seated row:</b> Seated rows are an upper body exercise that work the back, shoulders, and biceps.
          They can be done with resistance bands or with a cable machine at the gym. &nbsp;
          <a href="https://www.youtube.com/watch?v=xQNrFHEMhI4" target="_blank">Click here</a>&nbsp;
          to watch a video on how to do a seated row with a resistance band.
        </p>
        <p><strong>Remember to start with light weights or resistance bands, and gradually increase the resistance over time as you get stronger.
          It is also important to maintain proper form and technique to prevent injury and maximize the benefits of each exercise.
        </strong> </p>
        <Button color="primary" variant="contained" component={Link} to="/exerciseEntry">Back</Button>
      </CardContent>
    </Card>
  </PageContainer>
}
export default ExerciseResource;