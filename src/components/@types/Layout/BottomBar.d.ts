export type linksType = {
  linkName: activePageCheck;
  links: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
};

export type BottomBarProps = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<activePageCheck>>;
  notiCount: Number;
};
