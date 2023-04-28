export type feedOptionsButtonsProps = {
  name: string;
  filter: string;
  icon: string | undefined | Element;
};

export type feedOptionsButtons = {
  name: string;
  filter: string;
};

export type differentButtonsForFeedProps = {
  name: string;
  icon: JSX.Element | undefined;
  action: () => void;
};

export type differentButtonsForFeed = differentButtonsForFeedProps[];
