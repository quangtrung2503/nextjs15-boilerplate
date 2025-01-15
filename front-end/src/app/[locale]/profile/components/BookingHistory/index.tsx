"use client";

import { useState } from "react";
 import DetailOrder from "./detail";
import { Box } from "@mui/material";
import ListOrder from "./listOrder";

const BookingHistory = () => {
  const [idDetail, setIdDetail] = useState<number | null>(null);

  const onGoBack = () => {
    setIdDetail(null); 
  };

  const onViewDetail = (id: number) => {
    setIdDetail(id)
  }
  return (
    <Box>
      {idDetail ? (
        <DetailOrder id={idDetail} onGoBack={onGoBack} />
      ) : (
        <ListOrder onViewDetail={onViewDetail}/>
      )}
    </Box>
  );
};

export default BookingHistory;