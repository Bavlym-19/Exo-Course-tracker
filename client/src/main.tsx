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
  if (typeof window === "undefined") return;

  // قائمة بكل الأكواد المسموح لها بالتخطي والدخول فوراً
  const allowedBypassIds = ["1", "990", "980", "970", "960", "950", "940"];
  
  // بنجيب الكود من الـ localStorage بأمان تماماً
  const currentStudentId = window.localStorage ? localStorage.getItem("studentId") : null;

  // لو المستخدم معاه كود من الأكواد دي، بنعمل تخطي لأي خطأ فوراً ومستحيل يطرد أو يبيض الصفحة
  if (currentStudentId && allowedBypassIds.includes(currentStudentId)) {
    console.log(`[Bypass] Student ${currentStudentId} is authenticated.`);
    return;
  }

  // تشيك أمان بسيط عشان نضمن إن الكود ميكسرش الصفحة لو الـ error مش جاي سليم
  const errorMessage = error && typeof error === "object" && "message" in error 
    ? (error as any).message 
    : "";

  const isUnauthorized = errorMessage === UNAUTHED_ERR_MSG;
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
