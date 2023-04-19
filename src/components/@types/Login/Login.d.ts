export type LoginContextType = {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
};

export type LoginProps = {
  children: string | JSX.Element | JSX.Element[];
};
