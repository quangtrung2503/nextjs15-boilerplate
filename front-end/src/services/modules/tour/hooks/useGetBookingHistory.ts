import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { isObject } from "lodash";

import { useSave } from "@/stores/useStore";
import { useNotifications } from "@/helpers/toast";
import { ResponseList } from "@/interfaces/common";
import tourCustomerServices, { ResponseBookingHistory } from "../tourCustomer.services";
import { HistoryBookingTour } from "../interfaces/tour";

const requestAPI = tourCustomerServices.getBookingHistory;

interface UseGetBookingHistoryOptions {
  isTrigger?: boolean;
  refetchKey?: string;
}

const useGetBookingHistory = (
  options: UseGetBookingHistoryOptions = { isTrigger: true, refetchKey: "" }
) => {
  const { isTrigger = true, refetchKey = "" } = options;

  //! State and Refs
  const signal = useRef(new AbortController());
  const save = useSave();
  const [data, setData] = useState<HistoryBookingTour[]>([]);
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showError } = useNotifications();

  //! Fetch Function
  const fetch: () => Promise<ResponseBookingHistory> | undefined =
      useCallback(() => {
        if (!isTrigger) {
          return;
        }
        return new Promise((resolve, reject) => {
          (async () => {
            try {
              // const nextFilters = parseRequest(filters);
              const response = await requestAPI({
                signal: signal.current.signal,
              });
              resolve(response);
            } catch (error) {
              // setError(error);
              reject(error);
            }
          })();
        });
      }, [isTrigger]);
   // Đảm bảo `showError` không bị thay đổi mỗi lần render.
  

  //! Parse and Set Data
  const handleResponse = useCallback((response: ResponseBookingHistory) => {
    if (response?.data?.data) {
      setData(response.data.data.items || []);
    } else {
      setData([]);
    }
  }, []);

  //! Refetch without Loading State
  const refetch = useCallback(async () => {
    try {
      if (signal.current) {
        signal.current.abort();
        signal.current = new AbortController();
      }
      setRefetching(true);
      const response = await fetch();
      if (response) {
        handleResponse(response);
      }
    } finally {
      setRefetching(false);
    }
  }, [fetch, handleResponse]);

  //! Refetch with Loading State
  const refetchWithLoading = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch();
      if (response) {
        handleResponse(response);
      }
    } finally {
      setLoading(false);
    }
  }, [fetch, handleResponse]);

  //! Save Refetch Method
  useEffect(() => {
    save(refetchKey, refetch);
  }, [save, refetchKey, refetch]);

  //! Initial Fetch
  useEffect(() => {
    //* Fetch initial API
    const fetchAPI = async () => {
      try {
        signal.current = new AbortController();
        setLoading(true);
        const response = await fetch();
        if (response) {
          handleResponse(response);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          showError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
    return () => {
      if (signal.current) {
        signal.current.abort();
      }
    };
  }, [fetch, handleResponse]);

  return {
    data,
    loading,
    error,
    refetch,
    refetchWithLoading,
    refetching,
    setData,
  };
};

export default useGetBookingHistory;
