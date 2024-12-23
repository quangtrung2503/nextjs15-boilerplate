import { calculateRating } from "@/helpers/common";
import { LinearProgress, linearProgressClasses, styled } from "@mui/material";
import { Theme } from "@mui/material/styles";

const Progess = styled(LinearProgress)(
  ({ theme }: { theme: Theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles?.("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "var(--secondary)",
      ...theme.applyStyles?.("dark", {
        backgroundColor: "#308fe8",
      }),
    },
  })
);


interface RatingBarProps {
    value: number; // Giá trị cần truyền vào LinearProgress
    className?: string;
  }
  
  const RatingBar: React.FC<RatingBarProps> = ({ value, className }) => {  
    return (
        <div className={className}>
            <Progess
              variant="determinate"
              value={calculateRating(value)}
            />
        </div>
    );
  };
  
  export default RatingBar;
