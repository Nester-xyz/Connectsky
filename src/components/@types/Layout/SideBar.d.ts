export type linksType = {
  linkName: activePageCheck;
  links: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
};

export type SideBarProps = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<activePageCheck>>;
  notiCount: Number;
};
