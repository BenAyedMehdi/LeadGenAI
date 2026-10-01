import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/');
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setPathname(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({ pathname, navigate, params }), [pathname, navigate, params]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useNavigate must be used within a BrowserRouter');
  }
  return context.navigate;
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useLocation must be used within a BrowserRouter');
  }
  return { pathname: context.pathname };
}

export function useParams<T extends Record<string, string | undefined>>(): T {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useParams must be used within a BrowserRouter');
  }
  return context.params as T;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, children, ...props }: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export function Route(_props: RouteProps): React.ReactElement | null {
  return null;
}

// Match URL path against pattern like /searches/:id or /leads/:id
function matchPath(pattern: string, pathname: string): { matches: boolean; params: Record<string, string> } {
  if (pattern === '*' || pattern === pathname) {
    return { matches: true, params: {} };
  }

  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

export function Routes({ children }: { children: React.ReactNode }) {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('Routes must be used within a BrowserRouter');
  }

  const { pathname } = context;
  const childArray = React.Children.toArray(children) as React.ReactElement<RouteProps>[];

  let matchedElement: React.ReactNode = null;
  let matchedParams: Record<string, string> = {};

  for (const child of childArray) {
    if (!React.isValidElement(child)) continue;
    const { path, element } = child.props;
    const match = matchPath(path, pathname);

    if (match.matches) {
      matchedElement = element;
      matchedParams = match.params;
      break;
    }
  }

  // Inject matched params into context
  useEffect(() => {
    context.params = matchedParams;
  }, [matchedParams]);

  const valueWithParams = useMemo(
    () => ({
      ...context,
      params: matchedParams
    }),
    [context, matchedParams]
  );

  return (
    <RouterContext.Provider value={valueWithParams}>
      {matchedElement}
    </RouterContext.Provider>
  );
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}
