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

export type fieldDataProps = {
  profileImg?: string;
  author: string;
  caption?: string;
  image?: string;
  likes: number;
  comments: number;
};

export type differentButtonsForFeed = differentButtonsForFeedProps[];

export type dataGotFromApi = {
  author: {
    displayName: string;
    avatar: string;
  };
  comments: number;
  likes: number;
  caption: {
    text: string;
  };
  image: {
    embed: {
      images: {
        thumb: any;
      };
    };
  };
};
