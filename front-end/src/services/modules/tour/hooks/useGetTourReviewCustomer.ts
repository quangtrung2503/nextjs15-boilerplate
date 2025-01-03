import { useEffect, useState, useCallback, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import { isObject } from "lodash";
import { useSave } from "@/stores/useStore";
import { useNotifications } from "@/helpers/toast";
import { CustomerReview, ReviewData, Stats } from "../interfaces/tour";
import tourCustomerServices, {
  ExtraReview,
  FiltersGetReviewCustomer,
  RequestGetReviewCustomer,
  ResponseReviewCustomer,
  ResponseTourCustomerReview,
} from "../tourCustomer.services";
import { AxiosResponse } from "axios";

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
const parseRequest = (
  filters: FiltersGetReviewCustomer,
): RequestGetReviewCustomer => {
  return cloneDeep({
    page: filters.page,
    perPage: filters.perPage,
    textSearch: filters.textSearch,
    sortField: filters.sortField,
    sortOrder: filters.sortOrder,
    ratings: (filters?.ratings && + filters?.ratings !== 0 )?  [filters?.ratings] : undefined
  });
};

const requestAPI = tourCustomerServices.getTourCustomerReview;

const useGetTourCustomer = (
  filters: FiltersGetReviewCustomer,
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
  const [dataCustomerReview, setDataCustomerReview] =
    useState<CustomerReview[]>();
  const [stats, setStats] = useState<Stats>();
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showError } = useNotifications();

  //! Function
  const fetch: () =>
    | Promise<AxiosResponse<ExtraReview<CustomerReview[]>>>
    | undefined = useCallback(() => {
    if (!isTrigger) {
      return;
    }

    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const nextFilters = parseRequest(filters);
          const response = await requestAPI(nextFilters, slug, {
            signal: signal.current.signal,
          });
          resolve(response);
        } catch (error) {
          setError(error);
          reject(error);
        }
      })();
    });
  }, [filters, isTrigger]);

  const checkConditionPass = useCallback(
    (response: AxiosResponse<ExtraReview<CustomerReview[]>>) => {
      //* Check condition of response here to set data
      if (isObject(response?.data)) {
        if ((response.data.data.currentPage || 1) > 1) {
          setDataCustomerReview((prev) => [
            ...(prev || []),
            ...(response.data.data.items || []),
          ]);
          setStats(response.data.data.stats);
          setHasMore(
            response.data.data.totalPage > response.data.data.currentPage,
          );
          return;
        }

        setHasMore(
          response.data.data.totalPage > response.data.data.currentPage,
        );
        setStats(response.data.data.stats);
        setDataCustomerReview(response.data.data.items);
      }
    },
    [],
  );

  //* Refetch impliTour (without changing loading state)
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
        // showError(error);

        console.log({ error });
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
    dataCustomerReview,
    loading,
    error,
    stats,
    hasMore,
    refetch,
    refetchWithLoading,
    refetching,
    setDataCustomerReview,
  };
};

export default useGetTourCustomer;