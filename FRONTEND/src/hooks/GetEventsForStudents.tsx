import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../App";
import { setEventsForStudents, Event } from "../slices/eventSlice";
import type { RootState, AppDispatch } from "../store/store";

const useGetEventsForStudents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.events.events);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${baseUrl}/api/maintenance/get-all-issues`,
          {
            credentials: "include",
          }
        );
        

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();
        dispatch(setEventsForStudents(data.events as Event[]));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dispatch]);

  return { events, loading, error };
};

export default useGetEventsForStudents;
