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
  did: string;
  handle: string;
  caption?: string;
  image?: string;
  likes: number;
  comments: number;
  uri: string;
  cid: string;
  repostCount: number;
  reply: any;
  reason: any;
  embed: any;
  indexedAt: any;
  replyParent: any;
  isFromProfile: boolean;
};

export type differentButtonsForFeed = differentButtonsForFeedProps[];

export type dataGotFromApi = {
  reply: {
    text: any;
    by: any;
  };
  reason: {
    by: any;
  };
  author: {
    displayName: any;
    avatar: any;
    handle: any;
    did: any;
  };
  likes: any;
  comments: any;
  caption: {
    text: any;
  };
  uri: any;
  cid: any;
  repostCount: number;
  embed: {
    $type: any;
    data: any;
  };
  image: {
    embed: {
      images: {
        thumb: any;
      }[];
    };
  };
  indexedAt: any;
  replyParent: any;
};
