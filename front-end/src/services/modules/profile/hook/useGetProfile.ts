import { AxiosResponse } from "axios";
import profileServices, { ResponseProfile } from "../profile.services";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { isEmpty, isObject, isString } from "lodash";
import { useSave } from "@/stores/useStore";
import { Profile } from "../interface/profile";

const requestAPI = profileServices.getProfileUser;

const useGetProfile = (
  id: number,
  options: { isTrigger?: boolean; refetchKey?: string } = {
    isTrigger: true,
    refetchKey: "",
  }
) => {
  //! State
  const {isTrigger = true, refetchKey = ""} = options;
  const signal = useRef(new AbortController());
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<Profile>();
  const [hasMore, setHasMore] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const save = useSave();
  const [loading, setLoading] = useState(false);
  
  

  const fetch: () => Promise<AxiosResponse<ResponseProfile>> | undefined = useCallback(() => {
      if (!isTrigger) {
        return;
      }
  
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const response = await requestAPI(id,{
              signal: signal.current.signal,
            });
            resolve(response);
          } catch (error) {
            setError(error);
            reject(error);
          }
        })();
      });
    }, [id, isTrigger]);

  const checkConditionPass = useCallback((response: AxiosResponse<ResponseProfile>) => {
      //* Check condition of response here to set data
      if (isObject(response?.data.data)) {
        setData(response.data.data);
      }
  }, []);
 
  

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
        // showError(error);
        console.log(error);
      }
    }
  }, [fetch, checkConditionPass]);

  useEffect(() => {
    save(refetchKey, refetch);
  }, [save, refetchKey, refetch]);

  const refetchWithLoading = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch();
      if (response) {
        checkConditionPass(response);
      }
      setLoading(false);
    } catch (error) {
      // showError(error);
      console.log(error);
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
        // showError(error);
        console.log(error);
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
    hasMore,
    setData,
  };
};

export default useGetProfile;