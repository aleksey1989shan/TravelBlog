
export interface IPost {
  city: string;
  county: string;
  excerpt: string;
  id: number;
  photo: string;
  title: string;
}

export interface IPostCard {
  city: string;
  county: string;
  excerpt: string;
  id: number;
  photo: string;
  title: string;
}

// запрос поста по id
export interface IComment {
  author_name: string;
  comment: string;
  created_at: string;
}

export interface IUserInfo {
  full_name: string;
  city: string;
  bio: string;
}

export interface IPostDetail {
  id: number;
  title: string;
  description: string;
  country: string;
  city: string;
  photo: string;
  comments: IComment[];
  userInfo: IUserInfo;
}

export interface IButtonMain{
    text: string;
    onClick?: ()=> void;
    disabled?: boolean;
}

export interface IUser {
  id: number;
  full_name: string;
  city: string;
  country: string;
  bio: string;
  photo: string;
}

export interface IModal{
  isOpen: boolean;
  text: string;
  closePopap: ()=> void;
}