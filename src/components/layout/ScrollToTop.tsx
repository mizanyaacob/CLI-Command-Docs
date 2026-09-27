import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets scroll position on route change; in-page hash jumps are handled separately by SiteSidebar. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}
