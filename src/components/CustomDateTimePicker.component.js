import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';

const CustomDatePicker = ({ label, value, onChange, style }) => {
  return (
    <span style={style}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <div style={{margin: 20}}/>
        <TimePicker
          label="Time"
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </span>
  );
};

export default CustomDatePicker;