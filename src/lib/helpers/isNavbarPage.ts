const notNavBarPages = ["/sign-in", "/forgot-password"];

export const isNavbarPage = (pathname: string) => {
  return notNavBarPages.some((page) => pathname.includes(page));
};

export default isNavbarPage;
