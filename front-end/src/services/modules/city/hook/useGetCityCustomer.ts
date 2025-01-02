import { useEffect, useState, useCallback, useRef } from "react";
import { cloneDeep, isEmpty, isObject } from "lodash";

import { useSave } from "@/stores/useStore";
import { AxiosResponse } from "axios";
import { useNotifications } from "@/helpers/toast";
import { ResponseList } from "@/interfaces/common";
import cityCustomerServices, {
  FiltersGetCitiesCustomer,
  RequestGetCitiesCustomer,
} from "../cityCustomer.services";
import { City } from "../interfaces/city";
import { ResponseCityList } from "../city.services";

/********************************************************
 * SNIPPET GENERATED
 * GUIDE
 * Snippet for infinite scroll with page + rowsPerPage
 * Maybe you should check function:
 * - interface Request / Response
 * - parseRequest
 * - checkConditionPass
 * - fetch
 * - refetch
 * - requestAPI
 ********************************************************/
const parseRequest = (
  filters: FiltersGetCitiesCustomer,
): RequestGetCitiesCustomer => {
  return cloneDeep({
    page: filters.page,
    perPage: filters.perPage,
    sortField: filters.sortField,
    sortOrder: filters.sortOrder,
  });
};

//* Check parse body request
const requestAPI = cityCustomerServices.getCityCustomer;

const useGetCityCustomer = (
  // filters: FiltersGetGallery,
  options: { isTrigger?: boolean; refetchKey?: string } = {
    isTrigger: true,
    refetchKey: "",
  },
) => {
  //! State
  const { isTrigger = true, refetchKey = "" } = options;
  const signal = useRef(new AbortController());
  const save = useSave();
  const [data, setData] = useState<ResponseList<City[]>>();
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showError } = useNotifications();
  //! Function
  const fetch: () => Promise<ResponseCityList> | undefined = useCallback(() => {
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
          setError(error);
          reject(error);
        }
      })();
    });
  }, [isTrigger]);

  const checkConditionPass = useCallback((response: ResponseCityList) => {
    //* Check condition of response here to set data
    if (isObject(response?.data)) {
      setData(response.data.data);
    }
  }, []);

  //* Refetch implicity (without changing loading state)
  const refetch = useCallback(async () => {
    try {
      if (signal.current) {
        signal.current.abort();
        signal.current = new AbortController();
      }

      setRefetching(true);
      const response = await fetch();
      if (response) {
        checkConditionPass(response);
      }

      setRefetching(false);
    } catch (error: any) {
      if (!error.isCanceled) {
        showError(error);
      }
    }
  }, [fetch, checkConditionPass]);

  useEffect(() => {
    save(refetchKey, refetch);
  }, [save, refetchKey, refetch]);

  //* Refetch with changing loading state
  const refetchWithLoading = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch();
      console.log("Response: ", response);
      if (response) {
        checkConditionPass(response);
      }
      setLoading(false);
    } catch (error) {
      showError(error);
      setLoading(false);
    }
  }, [fetch, checkConditionPass]);

  //* Main handler
  useEffect(() => {
    //* Fetch initial API
    const fetchAPI = async () => {
      try {
        signal.current = new AbortController();
        setLoading(true);
        const response = await fetch();
        if (response) {
          checkConditionPass(response);
        }
      } catch (error) {
        showError(error);
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
  }, [fetch, checkConditionPass]);

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

export default useGetCityCustomer;
