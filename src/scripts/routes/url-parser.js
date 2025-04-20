export function getActivePathname() {
  return location.hash.replace("#", "") || "/";
}

function extractPathnameSegments(path) {
  const splitUrl = path.split("/");
  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null
  };
}

function constructRouteFromSegments({ resource, id }) {
  let pathname = "";
  if (resource) {
    pathname += `/${resource}`;
  }
  if (id) {
    pathname += "/:id";
  }
  return pathname || "/";
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const segments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(segments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const segments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(segments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
