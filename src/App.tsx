import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteHeader } from "./components/layout/SiteHeader";
import { Footer } from "./components/layout/Footer";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { HomePage } from "./routes/HomePage";
import { GettingStartedPage } from "./routes/GettingStartedPage";
import { CoreConceptsPage } from "./routes/CoreConceptsPage";

const CustomCommandsTutorialPage = lazy(() =>
  import("./routes/CustomCommandsTutorialPage").then((m) => ({ default: m.CustomCommandsTutorialPage })),
);
const BuiltinCommandsPage = lazy(() => import("./routes/BuiltinCommandsPage").then((m) => ({ default: m.BuiltinCommandsPage })));
const ExamplesGalleryPage = lazy(() => import("./routes/ExamplesGalleryPage").then((m) => ({ default: m.ExamplesGalleryPage })));
const ExampleDetailPage = lazy(() => import("./routes/ExampleDetailPage").then((m) => ({ default: m.ExampleDetailPage })));
const PlaygroundPage = lazy(() => import("./routes/PlaygroundPage").then((m) => ({ default: m.PlaygroundPage })));
const CheatSheetPage = lazy(() => import("./routes/CheatSheetPage").then((m) => ({ default: m.CheatSheetPage })));

function PageFallback() {
  return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground sm:px-6">Loading…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/getting-started" element={<GettingStartedPage />} />
              <Route path="/core-concepts" element={<CoreConceptsPage />} />
              <Route path="/custom-commands" element={<CustomCommandsTutorialPage />} />
              <Route path="/built-in-commands" element={<BuiltinCommandsPage />} />
              <Route path="/examples" element={<ExamplesGalleryPage />} />
              <Route path="/examples/:slug" element={<ExampleDetailPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/cheat-sheet" element={<CheatSheetPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
