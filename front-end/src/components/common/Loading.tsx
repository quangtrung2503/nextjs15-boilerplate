import { CircularProgressProps } from '@mui/material/CircularProgress';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = (props: CircularProgressProps) => {
  const {color} = props;
  return (
    <CircularProgress color={color} />
  );
};

export default Loading;
