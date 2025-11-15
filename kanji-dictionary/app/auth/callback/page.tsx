import { Suspense } from "react";
import AuthCallbackPage from "./components/AuthCallbackPage";

export default function Page() {
  return (
    <Suspense
      fallback={<p className="text-gray-600 text-lg">Verifying account...</p>}
    >
      <AuthCallbackPage />
    </Suspense>
  );
}
