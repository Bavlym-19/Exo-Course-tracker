import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // منع التطبيق من عمل ريفريش لانهائي عند حدوث خطأ بالسيرفر
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  // لو المستخدم مسجل بكود بافلي 990، امنع السيرفر تماماً من طرده أو عمل صفحة بيضاء
  const isjanaYoussef = localStorage.getItem("studentId") === "990";
  if (isjanaYoussef) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }
  const isBavly = localStorage.getItem("studentId") === "1";
  if (isBavly) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }
  const isAhmedYoussef = localStorage.getItem("studentId") === "980";
  if (isAhmedYoussef) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }
  const isjanaAhmed= localStorage.getItem("studentId") === "970";
  if (isjanaAhmed) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }
  const isArwaTawfiq= localStorage.getItem("studentId") === "960";
  if (isArwaTawfiq) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }
  const isAmen = localStorage.getItem("studentId") === "950";
  if (isAmen) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  } 
  const isMaureenAtef = localStorage.getItem("studentId") === "940";
  if (isMaureenAtef) {
    console.log("[Bypass] Bavly is authenticated via localStorage. Ignoring server error.");
    return;
  }

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;
  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
