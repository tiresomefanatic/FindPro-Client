import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/rootReducer";

export default function LoginSuccess() {
  const loggingInFromRoute = useSelector(
    (state: RootState) => state.authFlow.loggingInFromRoute
  );
  const router = useRouter();

  useEffect(() => {
    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Save the query parameters in localStorage
    queryParams.forEach((value, key) => {
      localStorage.setItem(key, value);
    });

    // Redirect to the loggingInFromRoute if it exists
    if (loggingInFromRoute) {
      router.push(`/${loggingInFromRoute}`);
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      {/* Your component JSX */}
      <p>Login Successful, redirecting to.....: {loggingInFromRoute}</p>
    </div>
  );
}