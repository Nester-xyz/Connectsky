export type LayoutProps = {
  children: string | JSX.Element | JSX.Element[];
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<activePageCheck>>;
};
