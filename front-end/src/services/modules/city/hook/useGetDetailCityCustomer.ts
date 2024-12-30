import { useEffect, useState, useCallback, useRef } from "react";
import { cloneDeep, isEmpty, isObject } from "lodash";

import { useSave } from "@/stores/useStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNotifications } from "@/helpers/toast";
import { ResponseList } from "@/interfaces/common";
import cityCustomerServices, {
  FiltersGetDetailCitiesCustomer,
  RequestGetDetailCitiesCustomer,
  ResponseCityCustomerDetail,
  ResponseCityDetail,
} from "../cityCustomer.services";
import { CityDetail } from "../interfaces/city";

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

//* Check parse body request
const requestAPI = cityCustomerServices.getDetailCityCustomer;

const useGetDetailCityCustomer = (
  // filters: FiltersGetGallery,
  slug: string,
  options: { isTrigger?: boolean; refetchKey?: string } = {
    isTrigger: true,
    refetchKey: "",
  },
) => {
  //! State
  const { isTrigger = true, refetchKey = "" } = options;
  const signal = useRef(new AbortController());
  const save = useSave();
  const [data, setData] = useState<ResponseCityCustomerDetail>();
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showError } = useNotifications();
  //! Function
  const fetch: () =>
    | Promise<AxiosResponse<ResponseCityCustomerDetail>>
    | undefined = useCallback(() => {
    if (!isTrigger) {
      return;
    }
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // const nextFilters = parseRequest(filters);
          const response = await requestAPI(slug, {
            signal: signal.current.signal,
          });
          resolve(response);
        } catch (error) {
          // setError(error);
          reject(error);
        }
      })();
    });
  }, [slug, isTrigger]);

  const checkConditionPass = useCallback(
    (response: AxiosResponse<ResponseCityCustomerDetail>) => {
      //* Check condition of response here to set data
      if (isObject(response?.data)) {
        setData(response.data);
      }
    },
    [],
  );

  //* Refetch implicity (without changing loading state)
  const refetch = useCallback(async () => {
    try {
      if (signal.current) {
        signal.current.abort();
        signal.current = new AbortController();
      }
      console.log("refetch");
      setRefetching(true);
      const response = await fetch();
      if (response) {
        checkConditionPass(response);
      }

      setRefetching(false);
    } catch (error: any) {
      if (!axios.isCancel(error)) {
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
      if (response) {
        checkConditionPass(response);
      }
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        showError(error);
      }
    } finally {
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

export default useGetDetailCityCustomer;
