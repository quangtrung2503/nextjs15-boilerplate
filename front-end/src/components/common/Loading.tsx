import { CircularProgressProps } from '@mui/material/CircularProgress';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = (props: CircularProgressProps) => {
  const {color,...rest} = props;
  return (
    <CircularProgress {...rest} color={color} />
  );
};

export default Loading;
